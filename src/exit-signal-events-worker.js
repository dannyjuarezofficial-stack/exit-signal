import {collect} from './exit-signal-events-collector.js';

const CLIENT = `(() => {
  if(navigator.globalPrivacyControl || navigator.doNotTrack==='1') return;
  const allowed=new Set([
    'page_view','quiz_start','quiz_step_reached','quiz_complete','result_type',
    'valuation_open','valuation_result_visible','valuation_impression',
    'valuation_embed_loaded','valuation_embed_error','valuation_interaction',
    'ef_handoff_notice_visible','ef_outbound_click','scroll_25','scroll_50','scroll_75','scroll_100',
    'engaged_30s','engaged_60s','engaged_120s','engaged_300s'
  ]);
  let count=0;
  const clean=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(v)?v.toLowerCase():'';
  function classify(){
    try{
      const params=new URLSearchParams(location.search);
      const us=clean(params.get('utm_source')||params.get('src')||'');
      const um=clean(params.get('utm_medium')||'');
      const campaign=clean(params.get('utm_campaign')||params.get('camp')||'');
      const host=(()=>{try{return new URL(document.referrer).hostname.toLowerCase()}catch{return''}})();
      const platform=us||(
        /(^|\.)google\./.test(host)?'google':
        /(^|\.)bing\.com$/.test(host)?'bing':
        /duckduckgo\.com$/.test(host)?'duckduckgo':
        /(^|\.)yahoo\./.test(host)?'yahoo':
        /chatgpt\.com$|openai\.com$/.test(host)?'chatgpt':
        /perplexity\.ai$/.test(host)?'perplexity':
        /gemini\.google\.com$/.test(host)?'gemini':
        /claude\.ai$/.test(host)?'claude':
        /reddit\.com$/.test(host)?'reddit':
        /youtube\.com$|youtu\.be$/.test(host)?'youtube':
        /linkedin\.com$/.test(host)?'linkedin':
        /facebook\.com$/.test(host)?'facebook':
        /instagram\.com$/.test(host)?'instagram':
        /tiktok\.com$/.test(host)?'tiktok':
        /(^|\.)x\.com$|twitter\.com$/.test(host)?'x':''
      );
      let channel='direct';
      if(/cpc|ppc|paid|paidsearch/.test(um)) channel='paid_search';
      else if(/email|newsletter/.test(um)) channel='email';
      else if(['chatgpt','perplexity','gemini','claude'].includes(platform)) channel='ai_search';
      else if(['google','bing','duckduckgo','yahoo'].includes(platform)) channel='organic_search';
      else if(platform==='reddit') channel='community';
      else if(platform==='youtube') channel='video';
      else if(['linkedin','facebook','instagram','tiktok','x'].includes(platform)) channel='social';
      else if(host && host!==location.hostname) channel='referral';
      return {source_channel:channel,source_platform:platform||channel,campaign_id:campaign};
    }catch{return {source_channel:'direct',source_platform:'direct',campaign_id:''}}
  }
  let attribution=classify();
  try{
    const saved=sessionStorage.getItem('es_attr_v1');
    if(saved) attribution=JSON.parse(saved);
    else sessionStorage.setItem('es_attr_v1',JSON.stringify(attribution));
  }catch{}
  function send(item){
    if(!item || !allowed.has(item.event) || count>=40) return;
    count++;
    const data={event:item.event,experience_version:'es_v4_3_trust_v1',...attribution};
    for(const key of ['result_type','quiz_step','question_id']){
      if(typeof item[key]==='string' && /^[a-zA-Z0-9_-]{1,64}$/.test(item[key])) data[key]=item[key];
    }
    fetch('/_events',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify(data),
      credentials:'omit',
      keepalive:true
    }).catch(()=>{});
  }
  const queue=window.dataLayer=window.dataLayer||[];
  queue.forEach(send);
  const push=queue.push;
  queue.push=function(...items){items.forEach(send);return push.apply(this,items);};
  send({event:'page_view'});
})();`;

export default {
  async fetch(request, env, ctx) {
    const url=new URL(request.url);
    if(url.pathname==='/_events') return collect(request,env,ctx);
    if(url.pathname==='/assets/events.js') {
      return new Response(CLIENT,{
        headers:{
          'content-type':'application/javascript; charset=utf-8',
          'cache-control':'public,max-age=300'
        }
      });
    }

    const response=await env.ASSETS.fetch(request);
    if(!response.headers.get('content-type')?.includes('text/html') || response.status>=400) return response;

    const headers=new Headers(response.headers);
    headers.delete('content-length');
    headers.delete('etag');
    headers.delete('content-encoding');
    const html=(await response.text()).replace('</body>','<script src="/assets/events.js" defer></script></body>');
    return new Response(html,{status:response.status,headers});
  }
};
