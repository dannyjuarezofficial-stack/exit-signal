import site from './valuation-worker.js';
import {collect} from './events-collector.js';
import {runDailyArchive, runWeeklyReport} from './analytics-reporter.js';
export default {
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    if(url.pathname==='/_events') return collect(request,env);
    if(url.pathname==='/assets/events.js') return new Response("(() => {\n  if(navigator.globalPrivacyControl || navigator.doNotTrack==='1') return;\n  const allowed=new Set(['page_view','quiz_start','quiz_complete','result_type','valuation_open','valuation_result_visible','valuation_impression','valuation_embed_loaded','valuation_embed_error','valuation_interaction','ef_outbound_click','scroll_25','scroll_50','scroll_75','scroll_100','engaged_30s','engaged_60s','engaged_120s','engaged_300s']);\n  let count=0;\n  function send(item) {\n    if(!item || !allowed.has(item.event) || count>=40) return;\n    count++;\n    const data={event:item.event};\n    for(const key of ['category_id','category_slug','experience_version']){\n      if(typeof item[key]==='string' && /^[a-zA-Z0-9_-]{1,64}$/.test(item[key])) data[key]=item[key];\n    }\n    fetch('/_events',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data),credentials:'omit',keepalive:true}).catch(()=>{});\n  }\n  const queue=window.dataLayer=window.dataLayer||[];\n  queue.forEach(send);\n  const push=queue.push;\n  queue.push=function(...items){items.forEach(send);return push.apply(this,items);};\n  send({event:'page_view',category_id:document.body.dataset.categoryId,category_slug:document.body.dataset.categorySlug,experience_version:'events-v1'});\n})();\n",{headers:{'content-type':'application/javascript; charset=utf-8','cache-control':'public,max-age=300'}});
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
