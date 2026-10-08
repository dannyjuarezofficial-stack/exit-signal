(() => {
const {questions,evaluate}=window.LaundromatExitReadiness;
let step=0,started=false; const answers={}; const reached=new Set();
const $=id=>document.getElementById(id);
function track(event,props={}){try{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...props});console.info('[Laundromat Exit event]',event,props);}catch{}}
function markStep(){const q=questions[step],key=step+':'+q.id;if(reached.has(key))return;reached.add(key);track('quiz_step_reached',{quiz_step:String(step+1),question_id:q.id});}
function start(){if(!started){started=true;track('quiz_start');}markStep();}
document.querySelectorAll('[data-start]').forEach(x=>x.addEventListener('click',start));
function render(){
 const q=questions[step],pct=Math.round((step+1)/questions.length*100);
 $('question').textContent=q.q;$('step-label').textContent=`Question ${step+1} of ${questions.length}`;$('step-percent').textContent=pct+'%';$('bar').style.width=pct+'%';
 $('options').innerHTML='';
 q.options.forEach(([value,label])=>{const l=document.createElement('label');l.className='option';const i=document.createElement('input');i.type='radio';i.name=q.id;i.value=value;i.checked=answers[q.id]===value;i.addEventListener('change',()=>{answers[q.id]=value;$('next').disabled=false;start();});const s=document.createElement('span');s.textContent=label;l.append(i,s);$('options').append(l);});
 $('back').disabled=step===0;$('next').disabled=!answers[q.id];$('next').textContent=step===questions.length-1?'See my reading':'Next';if(started)markStep();
}
function show(){
 const r=evaluate(answers);$('result-title').textContent=r.title;$('result-summary').textContent=r.summary;$('blocker-title').textContent=r.top.title;$('blocker-copy').textContent=r.top.reason+' '+r.top.action;$('next-move').textContent=r.top.action;
 $('reasons').innerHTML='';r.reasons.forEach(x=>{const li=document.createElement('li');li.textContent=x.title+': '+x.reason;$('reasons').append(li);});
 $('result').classList.remove('hidden');track('quiz_complete');track('result_type',{result_type:r.type});$('result').focus({preventScroll:true});$('result').scrollIntoView({behavior:'smooth',block:'start'});
}
$('back').addEventListener('click',()=>{if(step>0){step--;render();}});
$('next').addEventListener('click',()=>{if(!answers[questions[step].id])return;if(step<questions.length-1){step++;render();}else show();});
$('restart').addEventListener('click',()=>{Object.keys(answers).forEach(k=>delete answers[k]);step=0;started=false;reached.clear();$('result').classList.add('hidden');render();$('check').scrollIntoView({behavior:'smooth'});});
render();
})();