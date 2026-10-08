import fs from 'node:fs';
const html=fs.readFileSync('public/laundromat/index.html','utf8');
const rules=fs.readFileSync('public/laundromat/assets/readiness.js','utf8');
const app=fs.readFileSync('public/laundromat/assets/app.js','utf8');
const worker=fs.readFileSync('src/laundromat-worker.js','utf8');
const legal=['methodology','privacy','disclosure','terms'].map(x=>fs.readFileSync(`public/laundromat/${x}/index.html`,'utf8'));
const checks=[
 ['candidate is noindex',/noindex,nofollow/.test(html)],
 ['all supporting pages are noindex',legal.every(x=>/noindex,nofollow/.test(x))],
 ['10 questions',(rules.match(/id:'/g)||[]).length===10],
 ['lease under-five rule',/Under 5 years/.test(rules)&&/under five years/i.test(rules)],
 ['financial proof included',/financial_history/.test(rules)],
 ['revenue verification included',/revenue_verification/.test(rules)],
 ['equipment included',/equipment_age/.test(rules)],
 ['owner dependence included',/owner_dependence/.test(rules)],
 ['no live partner link',!/(wetyr\.com|laundromatmarketplace\.com)/i.test(html+app)],
 ['partner routing gated',/routing is not live/i.test(html)],
 ['no email gate',/No email/.test(html)],
 ['no valuation claim',/not an appraisal/i.test(html)],
 ['privacy page exists',fs.existsSync('public/laundromat/privacy/index.html')],
 ['disclosure page exists',fs.existsSync('public/laundromat/disclosure/index.html')],
 ['terms page exists and is linked',fs.existsSync('public/laundromat/terms/index.html')&&/href="\/laundromat\/terms\/"/.test(html)],
 ['worker isolates laundromat routes',/!u\.pathname\.startsWith\('\/laundromat\/'\)/.test(worker)],
 ['worker forces preview noindex header',/x-robots-tag','noindex, nofollow'/.test(worker)],
 ['analytics payload excludes quiz answers',/\['result_type','quiz_step','question_id'\]/.test(worker)&&!/answers\[/.test(worker)]
];
let failed=false;for(const [name,ok] of checks){console.log(ok?'PASS':'FAIL',name);if(!ok)failed=true;}if(failed)process.exit(1);