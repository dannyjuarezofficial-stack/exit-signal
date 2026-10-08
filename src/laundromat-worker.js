const EVENTS=new Set(['page_view','quiz_start','quiz_step_reached','quiz_complete','result_type']);
const SAFE=/^[a-zA-Z0-9_-]{1,64}$/;
const clean=v=>typeof v==='string'&&SAFE.test(v)?v:'';
const CLIENT=`(() => {if(navigator.globalPrivacyControl||navigator.doNotTrack==='1')return;const allowed=new Set(${JSON.stringify(Array.from(['page_view','quiz_start','quiz_step_reached','quiz_complete','result_type']))});const q=window.dataLayer=window.dataLayer||[];let n=0;function send(x){if(!x||!allowed.has(x.event)||n++>30)return;const d={event:x.event,experience_version:'laundromat_v1_candidate'};for(const k of ['result_type','quiz_step','question_id'])if(typeof x[k]==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(x[k]))d[k]=x[k];fetch('/laundromat/_events',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(d),credentials:'omit',keepalive:true}).catch(()=>{});}q.forEach(send);const p=q.push;q.push=function(...xs){xs.forEach(send);return p.apply(this,xs)};send({event:'page_view'});})();`;
export default{async fetch(request,env){
 const u=new URL(request.url);
 if(u.pathname==='/')return Response.redirect(new URL('/laundromat/',u),302);
 if(!u.pathname.startsWith('/laundromat/'))return new Response('Not found',{status:404,headers:{'x-robots-tag':'noindex, nofollow'}});
 if(u.pathname==='/laundromat/assets/events.js')return new Response(CLIENT,{headers:{'content-type':'application/javascript; charset=utf-8','cache-control':'public,max-age=300'}});
 if(u.pathname==='/laundromat/_events'){
  if(request.method!=='POST')return new Response('',{status:405});
  const origin=request.headers.get('origin');if(origin&&origin!==u.origin)return new Response('',{status:403});
  const size=Number(request.headers.get('content-length')||0);if(size>2048)return new Response('',{status:413});
  let x;try{x=await request.json()}catch{return new Response('',{status:400})}
  if(!EVENTS.has(x.event))return new Response('',{status:204});
  if(env.EVENTS)env.EVENTS.writeDataPoint({blobs:[x.event,'laundromat_exit_check',clean(x.experience_version),clean(x.result_type),clean(x.quiz_step),clean(x.question_id)],indexes:['laundromat_exit_check'],doubles:[1]});
  return new Response('',{status:204});
 }
 const r=await env.ASSETS.fetch(request);
 if(!r.headers.get('content-type')?.includes('text/html')||r.status>=400)return r;
 const h=new Headers(r.headers);h.delete('content-length');h.delete('etag');h.delete('content-encoding');h.set('x-robots-tag','noindex, nofollow');
 const html=(await r.text()).replace('</body>','<script src="/laundromat/assets/events.js" defer></script></body>');
 return new Response(html,{status:r.status,headers:h});
}};