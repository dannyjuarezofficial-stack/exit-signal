(() => {
  const REFERRAL_CODE = 'DBKZ7AVTPGFSXPVM';
  const {questions,evaluate,shouldShowValuation} = window.ExitSignalReadiness;

  let step = 0;
  const answers = {};
  let started = false;
  let efLoaded = false;

  const qText = document.getElementById('question-text');
  const opts = document.getElementById('answer-options');
  const back = document.getElementById('back-button');
  const next = document.getElementById('next-button');
  const progressLabel = document.getElementById('progress-label');
  const progressPercent = document.getElementById('progress-percent');
  const progressBar = document.getElementById('progress-bar');
  const resultSection = document.getElementById('result');
  const valuationSection = document.getElementById('valuation');

  function track(name, props={}) {
    const safe = { ...props };
    try {
      if (window.zaraz?.track) window.zaraz.track(name, safe);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event:name, ...safe});
      console.info('[Exit Signal event]', name, safe);
    } catch (_) {}
  }
  window.exitSignalTrack = track;

  function startQuiz() {
    if (started) return;
    started = true;
    track('quiz_start');
  }

  document.querySelectorAll('[data-track="quiz_start"]').forEach(el => el.addEventListener('click', startQuiz));

  function renderQuestion() {
    const item = questions[step];
    qText.textContent = item.q;
    const pct = Math.round(((step+1)/questions.length)*100);
    progressLabel.textContent = `Question ${step+1} of ${questions.length}`;
    progressPercent.textContent = `${pct}%`;
    progressBar.style.width = `${pct}%`;
    opts.innerHTML = '';
    item.options.forEach(([value,label]) => {
      const wrap = document.createElement('label');
      wrap.className = 'answer-option';
      const input = document.createElement('input');
      input.type='radio'; input.name=item.id; input.value=value;
      input.checked = answers[item.id] === value;
      input.addEventListener('change', () => {
        answers[item.id] = value;
        next.disabled = false;
        startQuiz();
      });
      const span = document.createElement('span'); span.textContent=label;
      wrap.append(input,span); opts.append(wrap);
    });
    back.disabled = step===0;
    next.textContent = step===questions.length-1 ? 'See my reading' : 'Next';
    next.disabled = !answers[item.id];
  }

  function showResult() {
    const r=evaluate(answers);
    document.getElementById('result-title').textContent=r.title;
    document.getElementById('result-summary').textContent=r.summary;
    document.getElementById('result-priority').textContent=r.priority;
    const list=document.getElementById('result-reasons'); list.innerHTML='';
    r.reasons.forEach(x=>{const li=document.createElement('li');li.textContent=x.reason;list.append(li)});
    resultSection.classList.remove('hidden');
    const showValuation = shouldShowValuation(r,answers);
    valuationSection.classList.toggle('hidden', !showValuation);
    track('quiz_complete');
    track('result_type',{result_type:r.type});
    resultSection.focus({preventScroll:true});
    resultSection.scrollIntoView({behavior:'smooth',block:'start'});
  }

  back.addEventListener('click',()=>{if(step>0){step--;renderQuestion();}});
  next.addEventListener('click',()=>{
    if (!answers[questions[step].id]) return;
    if(step<questions.length-1){step++;renderQuestion();}
    else showResult();
  });
  document.getElementById('restart-button').addEventListener('click',()=>{
    Object.keys(answers).forEach(k=>delete answers[k]); step=0; started=false;
    resultSection.classList.add('hidden'); valuationSection.classList.add('hidden');
    renderQuestion(); document.getElementById('check').scrollIntoView({behavior:'smooth'});
  });

  function wireEfShadow(host) {
    const tryWire = () => {
      const root=host.shadowRoot;
      if(!root) return false;
      if(root.host.dataset.exitSignalWired==='true') return true;
      root.host.dataset.exitSignalWired='true';
      const inspect = () => {
        if(root.querySelector('.ef-vt-results')) track('valuation_result_visible');
      };
      root.addEventListener('click',e=>{
        const target=e.composedPath().find(n=>n?.tagName==='A'||n?.tagName==='BUTTON');
        if(!target) return;
        if(target.tagName==='A') {
          const href=target.href||'';
          if(/empireflippers\.com/i.test(href)) track('ef_outbound_click',{destination:'empire_flippers'});
        }
      },true);
      new MutationObserver(inspect).observe(root,{childList:true,subtree:true});
      inspect(); return true;
    };
    if(tryWire()) return;
    const timer=setInterval(()=>{if(tryWire()) clearInterval(timer);},100);
    setTimeout(()=>clearInterval(timer),10000);
  }

  function loadEf() {
    if(efLoaded) return;
    efLoaded=true;
    track('valuation_open');
    document.getElementById('valuation-load').classList.add('hidden');
    document.getElementById('valuation-container').classList.remove('hidden');
    window.efVtConfig={
      fields:[
        {name:'monetization',defaultValue:'Amazon FBA',disabled:true},
        {name:'average_monthly_net_profit'},
        {name:'business_created_at'},
        {name:'number_of_products'}
      ],
      title:'What could your Amazon FBA business be worth?'
    };
    const script=document.createElement('script');
    script.src='https://vt-snippet.empireflippers.com/snippet-v2.1.js';
    script.dataset.referralCode=REFERRAL_CODE;
    script.dataset.styleUrl=new URL('/assets/ef-theme.css',location.href).href;
    script.onload=()=>wireEfShadow(document.getElementById('ef-vt-embed'));
    script.onerror=()=>document.getElementById('ef-fallback').classList.remove('hidden');
    document.body.appendChild(script);
    setTimeout(()=>{
      const host=document.getElementById('ef-vt-embed');
      if(!host.shadowRoot) document.getElementById('ef-fallback').classList.remove('hidden');
    },7000);
  }
  document.getElementById('valuation-load').addEventListener('click',loadEf);
  document.getElementById('ef-fallback-link').addEventListener('click',()=>track('ef_outbound_click',{destination:'empire_flippers_fallback'}));

  // Aggregate scroll-depth milestones. No answers, financial values, or personal data are sent.
  const seenScroll = new Set();
  function checkScrollDepth() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
    [25,50,75,100].forEach(mark => {
      if (pct >= mark && !seenScroll.has(mark)) {
        seenScroll.add(mark);
        track(`scroll_${mark}`);
      }
    });
  }
  window.addEventListener('scroll', checkScrollDepth, {passive:true});
  window.addEventListener('load', checkScrollDepth);

  // Basic engaged-time milestones count only while the page is visible.
  let engagedSeconds = 0;
  const engagedMilestones = new Set();
  setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    engagedSeconds += 1;
    [30,60,120,300].forEach(mark => {
      if (engagedSeconds >= mark && !engagedMilestones.has(mark)) {
        engagedMilestones.add(mark);
        track(`engaged_${mark}s`);
      }
    });
  }, 1000);

  renderQuestion();
})();
