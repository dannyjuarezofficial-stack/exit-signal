(() => {
  const REFERRAL_CODE='DBKZ7AVTPGFSXPVM';
  const body=document.body;
  const nicheId=body.dataset.nicheId || 'homepage';
  const nicheSlug=body.dataset.nicheSlug || 'homepage';
  const monetization=body.dataset.monetization || 'eCommerce';
  const version='ci-v1-niche-ecommerce';

  function track(name, props={}) {
    const safe={
      site_id:'calcinsider',
      niche_id:nicheId,
      niche_slug:nicheSlug,
      monetization,
      experience_version:version,
      ...props
    };
    try {
      if(window.zaraz?.track) window.zaraz.track(name,safe);
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:name,...safe});
      console.info('[Calc Insider event]',name,safe);
    } catch (_) {}
  }

  track('page_view');

  const search=document.getElementById('niche-search');
  const cards=[...document.querySelectorAll('[data-niche-link]')];
  const empty=document.getElementById('niche-empty');
  let filterTracked=false;

  if(search && cards.length){
    search.addEventListener('input',()=>{
      const q=search.value.trim().toLowerCase();
      let shown=0;
      cards.forEach(card=>{
        const hay=(card.dataset.nicheName||'')+' '+(card.dataset.nicheSlug||'');
        const match=!q || hay.includes(q);
        card.classList.toggle('hidden',!match);
        if(match) shown++;
      });
      empty?.classList.toggle('hidden',shown>0);
      if(q && !filterTracked){
        filterTracked=true;
        track('niche_filter_used');
      }
    });
    cards.forEach(card=>card.addEventListener('click',()=>{
      track('niche_select',{selected_niche:card.dataset.nicheSlug||'unknown'});
    }));
  }

  const valuation=document.getElementById('valuation');
  if(!valuation) return;

  let loaded=false;
  let interactionTracked=false;
  const fallback=document.getElementById('ef-fallback');

  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        track('valuation_impression');
        observer.disconnect();
      }
    },{threshold:0.35});
    observer.observe(valuation);
  } else {
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
      if(root.host.dataset.calcInsiderWired==='true') return true;
      root.host.dataset.calcInsiderWired='true';

      ['click','change','input','keydown'].forEach(type=>{
        root.addEventListener(type,markInteraction,true);
      });

      root.addEventListener('click',event=>{
        const target=event.composedPath().find(node=>node?.tagName==='A'||node?.tagName==='BUTTON');
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

  loadEf();
})();
