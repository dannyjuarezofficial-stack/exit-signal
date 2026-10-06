import site from './valuation-worker.js';
import {collect} from './events-collector.js';
import {runDailyArchive, runWeeklyReport} from './analytics-reporter.js';
export default {
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    if(url.pathname==='/_events') return collect(request,env,ctx);
    if(url.pathname==='/assets/events.js') return new Response("(() => {\n  if(navigator.globalPrivacyControl || navigator.doNotTrack==='1') return;\n  const allowed=new Set(['page_view','quiz_start','quiz_complete','result_type','valuation_open','valuation_result_visible','valuation_impression','valuation_embed_loaded','valuation_embed_error','valuation_interaction','ef_outbound_click','scroll_25','scroll_50','scroll_75','scroll_100','engaged_30s','engaged_60s','engaged_120s','engaged_300s']);\n  let count=0;\n  const clean=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(v)?v.toLowerCase():'';\n  function classify(){\n    try{\n      const params=new URLSearchParams(location.search);\n      const us=clean(params.get('utm_source')||params.get('src')||'');\n      const um=clean(params.get('utm_medium')||'');\n      const campaign=clean(params.get('utm_campaign')||params.get('camp')||'');\n      const host=(()=>{try{return new URL(document.referrer).hostname.toLowerCase()}catch{return''}})();\n      const platform=us||(\n        /(^|\\.)google\\./.test(host)?'google':/(^|\\.)bing\\.com$/.test(host)?'bing':/duckduckgo\\.com$/.test(host)?'duckduckgo':/(^|\\.)yahoo\\./.test(host)?'yahoo':/chatgpt\\.com$|openai\\.com$/.test(host)?'chatgpt':/perplexity\\.ai$/.test(host)?'perplexity':/gemini\\.google\\.com$/.test(host)?'gemini':/claude\\.ai$/.test(host)?'claude':/reddit\\.com$/.test(host)?'reddit':/youtube\\.com$|youtu\\.be$/.test(host)?'youtube':/linkedin\\.com$/.test(host)?'linkedin':/facebook\\.com$/.test(host)?'facebook':/instagram\\.com$/.test(host)?'instagram':/tiktok\\.com$/.test(host)?'tiktok':/(^|\\.)x\\.com$|twitter\\.com$/.test(host)?'x':'');\n      let channel='direct';\n      if(/cpc|ppc|paid|paidsearch/.test(um)) channel='paid_search';\n      else if(/email|newsletter/.test(um)) channel='email';\n      else if(['chatgpt','perplexity','gemini','claude'].includes(platform)) channel='ai_search';\n      else if(['google','bing','duckduckgo','yahoo'].includes(platform)) channel='organic_search';\n      else if(platform==='reddit') channel='community';\n      else if(platform==='youtube') channel='video';\n      else if(['linkedin','facebook','instagram','tiktok','x'].includes(platform)) channel='social';\n      else if(host && host!==location.hostname) channel='referral';\n      return {source_channel:channel,source_platform:platform||channel,campaign_id:campaign};\n    }catch{return {source_channel:'direct',source_platform:'direct',campaign_id:''}}\n  }\n  let attribution=classify();\n  try{const saved=sessionStorage.getItem('bvc_attr_v1');if(saved) attribution=JSON.parse(saved);else sessionStorage.setItem('bvc_attr_v1',JSON.stringify(attribution));}catch{}\n  function send(item) {\n    if(!item || !allowed.has(item.event) || count>=40) return;\n    count++;\n    const data={event:item.event,...attribution};\n    for(const key of ['category_id','category_slug','experience_version','source_channel','source_platform','campaign_id']){\n      if(typeof item[key]==='string' && /^[a-zA-Z0-9_-]{1,64}$/.test(item[key])) data[key]=item[key];\n    }\n    fetch('/_events',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data),credentials:'omit',keepalive:true}).catch(()=>{});\n  }\n  const queue=window.dataLayer=window.dataLayer||[];\n  queue.forEach(send);\n  const push=queue.push;\n  queue.push=function(...items){items.forEach(send);return push.apply(this,items);};\n  send({event:'page_view',category_id:document.body.dataset.categoryId,category_slug:document.body.dataset.categorySlug,experience_version:'events-v1'});\n})();\n",{headers:{'content-type':'application/javascript; charset=utf-8','cache-control':'public,max-age=300'}});
    const response=await site.fetch(request,env,ctx);
    if(!response.headers.get('content-type')?.includes('text/html') || response.status>=400) return response;
    const headers=new Headers(response.headers);headers.delete('content-length');headers.delete('etag');headers.delete('content-encoding');
    const html=(await response.text()).replace('</body>','<script src="/assets/events.js" defer></script></body>');
    return new Response(html,{status:response.status,headers});
  },

  async scheduled(controller, env, ctx) {
    if (controller.cron === '20 0 * * *') {
      ctx.waitUntil(runDailyArchive(env, controller.scheduledTime));
      return;
    }
    if (controller.cron === '35 0 * * MON') {
      ctx.waitUntil(runWeeklyReport(env, controller.scheduledTime));
    }
  }
};
