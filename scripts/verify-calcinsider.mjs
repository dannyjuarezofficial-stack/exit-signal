import fs from 'node:fs';

const worker=fs.readFileSync('src/calcinsider-worker.js','utf8');
const app=fs.readFileSync('public/calcinsider/assets/app.js','utf8');
const css=fs.readFileSync('public/calcinsider/assets/styles.css','utf8');
const wrangler=fs.readFileSync('wrangler.calcinsider.jsonc','utf8');
const favicon=fs.readFileSync('public/calcinsider/favicon.svg','utf8');

const slugs=[
  'supplements','pet-care','beauty','personal-care','home','apparel-accessories','automotive',
  'health-fitness','children-toys','outdoors','food-beverages','sports','occasions-gifts',
  'kitchenware','hobbies','gaming','travel-products','technology-electronics','equipment',
  'office-b2b-supply'
];

const checks=[
  ['exactly 20 niche definitions', (worker.match(/slug:'/g)||[]).length===20],
  ['all slugs present', slugs.every(s=>worker.includes("slug:'"+s+"'"))],\n  ['all 20 niches have scope boundaries', (worker.match(/scope:'/g)||[]).length===20],\n  ['no visitor-facing experiment language', !worker.includes('the experiment compares niche demand')],
  ['eCommerce locked', worker.includes("data-monetization=\"eCommerce\"") && app.includes("monetizations:[monetization]")],
  ['EF referral code preserved', worker.includes('DBKZ7AVTPGFSXPVM') && app.includes('DBKZ7AVTPGFSXPVM')],
  ['interaction tracking present', app.includes("track('valuation_interaction')")],
  ['outbound tracking present', app.includes("track('ef_outbound_click'")],
  ['niche selection tracking present', app.includes("track('niche_select'")],
  ['privacy excludes financial payloads', worker.includes('We do not intentionally send names, email addresses, revenue, profit figures')],
  ['production SEO host isolated', worker.includes("url.hostname === 'calcinsider.com'")],
  ['sitemap includes niche routes', worker.includes("...NICHES.map(n => '/' + n.slug + '/')")],
  ['wrangler points only to calcinsider source/assets', wrangler.includes('./src/calcinsider-worker.js') && wrangler.includes('./public/calcinsider')],
  ['CalcInsider worker name set', wrangler.includes('"name": "calcinsider"')],
  ['favicon is CI', favicon.includes('>CI<')],
  ['mobile breakpoint present', css.includes('@media(max-width:650px)')],
  ['focus-visible styling present', css.includes(':focus-visible')],\n  ['best-fit scope styling present', css.includes('.fit-note')]
];

let failed=0;
for(const [name,pass] of checks){
  console.log((pass?'PASS':'FAIL')+' — '+name);
  if(!pass) failed++;
}
if(failed){
  console.error('\n'+failed+' verification check(s) failed.');
  process.exit(1);
}
console.log('\nAll '+checks.length+' CalcInsider source checks passed.');
