import fs from 'node:fs';
const html=fs.readFileSync('public/laundromat/index.html','utf8');
const rules=fs.readFileSync('public/laundromat/assets/readiness.js','utf8');
const app=fs.readFileSync('public/laundromat/assets/app.js','utf8');
const checks=[
 ['candidate is noindex',/noindex,nofollow/.test(html)],
 ['10 questions', (rules.match(/id:'/g)||[]).length===10],
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
 ['disclosure page exists',fs.existsSync('public/laundromat/disclosure/index.html')]
];
let failed=false;for(const [name,ok] of checks){console.log(ok?'PASS':'FAIL',name);if(!ok)failed=true;}if(failed)process.exit(1);