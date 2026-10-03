(() => {
  const REFERRAL_CODE='DBKZ7AVTPGFSXPVM';
  const body=document.body;
  const categoryId=body.dataset.categoryId || 'unknown';
  const categorySlug=body.dataset.categorySlug || 'unknown';
  const monetization=body.dataset.monetization || '';
  const version='vp-v2-tool-first';

  function track(name,props={}) {
    const safe={category_id:categoryId,category_slug:categorySlug,experience_version:version,...props};
    try {
      if(window.zaraz?.track) window.zaraz.track(name,safe);
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:name,...safe});
      console.info('[Valuation Portfolio event]',name,safe);
    } catch (_) {}
  }
  window.portfolioTrack=track;

  let loaded=false;
  let interactionTracked=false;
  const loadBtn=document.getElementById('valuation-load');
  const container=document.getElementById('valuation-container');
  const fallback=document.getElementById('ef-fallback');
  const valuation=document.getElementById('valuation');

  if(valuation && 'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        track('valuation_impression');
        observer.disconnect();
      }
    },{threshold:0.35});
    observer.observe(valuation);
  } else if(valuation) {
    track('valuation_impression');
  }

  function markInteraction(){
    if(interactionTracked) return;
    interactionTracked=true;
    track('valuation_interaction');
  }

  function wireEfShadow(host){
    const tryWire=()=>{
      const root=host?.shadowRoot;
      if(!root) return false;
      if(root.host.dataset.portfolioWired==='true') return true;
      root.host.dataset.portfolioWired='true';

      ['click','change','input','keydown'].forEach(type=>{
        root.addEventListener(type,markInteraction,true);
      });

      root.addEventListener('click',e=>{
        const target=e.composedPath().find(n=>n?.tagName==='A'||n?.tagName==='BUTTON');
        if(target?.tagName==='A' && /empireflippers\.com/i.test(target.href||'')){
          track('ef_outbound_click',{destination:'empire_flippers'});
        }
      },true);
      return true;
    };

    if(tryWire()) return;
    const timer=setInterval(()=>{if(tryWire()) clearInterval(timer)},100);
    setTimeout(()=>clearInterval(timer),10000);
  }

  function loadEf(){
    if(loaded) return;
    loaded=true;
    loadBtn?.classList.add('hidden');
    container?.classList.remove('hidden');

    window.efVtConfig={fields:'auto',monetizations:[monetization]};

    const script=document.createElement('script');
    script.src='https://vt-snippet.empireflippers.com/snippet-v2.1.js';
    script.dataset.referralCode=REFERRAL_CODE;
    script.dataset.styleUrl='https://vt-snippet.empireflippers.com/default-v2.css';
    script.onload=()=>{
      track('valuation_embed_loaded');
      wireEfShadow(document.getElementById('ef-vt-embed'));
    };
    script.onerror=()=>{
      track('valuation_embed_error');
      fallback?.classList.remove('hidden');
    };
    document.body.appendChild(script);

    setTimeout(()=>{
      const host=document.getElementById('ef-vt-embed');
      if(host && !host.shadowRoot) fallback?.classList.remove('hidden');
    },7000);
  }

  loadBtn?.addEventListener('click',()=>{ markInteraction(); loadEf(); });
  document.getElementById('ef-fallback-link')?.addEventListener('click',()=>{
    markInteraction();
    track('ef_outbound_click',{destination:'empire_flippers_fallback'});
  });

  const seen=new Set();
  function checkScroll(){
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    const pct=Math.min(100,Math.round((window.scrollY/max)*100));
    [25,50,75,100].forEach(mark=>{
      if(pct>=mark&&!seen.has(mark)){
        seen.add(mark);
        track('scroll_'+mark);
      }
    });
  }
  addEventListener('scroll',checkScroll,{passive:true});
  addEventListener('load',checkScroll);

  let engaged=0;
  const milestones=new Set();
  setInterval(()=>{
    if(document.visibilityState!=='visible') return;
    engaged++;
    [30,60,120,300].forEach(mark=>{
      if(engaged>=mark&&!milestones.has(mark)){
        milestones.add(mark);
        track('engaged_'+mark+'s');
      }
    });
  },1000);

  // Tool-first experiment: load the official valuation experience immediately.
  loadEf();
})();