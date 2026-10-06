import {collect} from './exit-signal-events-collector.js';

const CLIENT = `(() => {
  if(navigator.globalPrivacyControl || navigator.doNotTrack==='1') return;
  const allowed=new Set([
    'page_view','quiz_start','quiz_complete','result_type',
    'valuation_open','valuation_result_visible','valuation_impression',
    'valuation_embed_loaded','valuation_embed_error','valuation_interaction',
    'ef_outbound_click','scroll_25','scroll_50','scroll_75','scroll_100',
    'engaged_30s','engaged_60s','engaged_120s','engaged_300s'
  ]);
  let count=0;
  function send(item){
    if(!item || !allowed.has(item.event) || count>=40) return;
    count++;
    const data={event:item.event,experience_version:'es-v4.3'};
    if(typeof item.result_type==='string' && /^[a-zA-Z0-9_-]{1,64}$/.test(item.result_type)){
      data.result_type=item.result_type;
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
