(() => {
  const KEY = 'exit_signal_tiktok_pixel_consent_v1';
  const ID = 'DB8PKKJC77UB6E0EB5FG';
  function startPixel() {
    if (window.ttq) return;
    !function(w,d,t){w.TiktokAnalyticsObject=t;var q=w[t]=w[t]||[];q.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];q.setAndDefer=function(a,b){a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<q.methods.length;i++)q.setAndDefer(q,q.methods[i]);q.instance=function(id){for(var e=q._i[id]||[],n=0;n<q.methods.length;n++)q.setAndDefer(e,q.methods[n]);return e};q.load=function(id,o){var url='https://analytics.tiktok.com/i18n/pixel/events.js';q._i=q._i||{};q._i[id]=[];q._i[id]._u=url;q._t=q._t||{};q._t[id]=+new Date;q._o=q._o||{};q._o[id]=o||{};var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src=url+'?sdkid='+id+'&lib='+t;var first=d.getElementsByTagName('script')[0];first.parentNode.insertBefore(s,first)};q.load(ID);q.page()}(window,document,'ttq');
  }
  function init() {
    let choice=null;
    try { choice=localStorage.getItem(KEY); } catch (_) {}
    if(choice==='yes'){startPixel();return;}
    if(choice==='no')return;
    const banner=document.createElement('div');
    banner.setAttribute('role','region');
    banner.setAttribute('aria-label','Optional TikTok analytics');
    banner.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#161b22;color:white;padding:14px 20px;z-index:9999;font:14px/1.5 system-ui,sans-serif;box-shadow:0 -2px 12px #0005';
    banner.innerHTML='<span>May we use TikTok analytics to measure visits? Optional. <a href="/privacy/" style="color:#a8d9ff">Privacy details</a>.</span> <button type="button" data-consent="yes" style="margin:6px;padding:7px 12px">Allow</button> <button type="button" data-consent="no" style="margin:6px;padding:7px 12px">Not now</button>';
    banner.addEventListener('click',e=>{const val=e.target?.getAttribute('data-consent');if(!val)return;try{localStorage.setItem(KEY,val)}catch(_){}banner.remove();if(val==='yes')startPixel()});
    document.body.appendChild(banner);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
