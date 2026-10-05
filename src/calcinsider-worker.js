import {CALCINSIDER_STYLES, CALCINSIDER_APP, CALCINSIDER_FAVICON} from './calcinsider-assets.js';
const REFERRAL_CODE = 'DBKZ7AVTPGFSXPVM';

const NICHES = [
  {
    slug:'supplements', name:'Supplements', label:'Supplement Brands',
    eyebrow:'For established supplement eCommerce owners',
    intro:'Get a preliminary estimate for an established supplement eCommerce business, then review the factors buyers may examine beyond revenue.',
    scope:'ingestible supplements and vitamin brands; use Health & Fitness for non-supplement fitness merchandise.',
    factors:[
      ['Repeat purchase quality','Subscription and replenishment behavior can make revenue more predictable, while weak repeat purchase can make growth more acquisition-dependent.'],
      ['Channel concentration','Heavy dependence on Amazon, one paid channel, or one marketplace can increase transfer risk for a buyer.'],
      ['Product and compliance risk','Shelf life, claims, formulation ownership, supplier durability and documentation can affect diligence and transferability.'],
      ['SKU concentration','A business built around one hero product can be attractive, but it also creates concentration risk if that product weakens.']
    ],
    prep:'Have recent profit, revenue, inventory, subscription or repeat-purchase information, major channel mix, and your top-SKU concentration ready.'
  },
  {
    slug:'pet-care', name:'Pet Care', label:'Pet Care Brands',
    eyebrow:'For established pet-care eCommerce owners',
    intro:'Estimate what a pet-care eCommerce business may be worth and review the operating traits buyers may care about in this niche.',
    scope:'pet products, accessories and consumables; not veterinary practices or local pet services.',
    factors:[
      ['Consumable vs. durable mix','Consumables can support repeat purchasing, while durable products may depend more heavily on ongoing acquisition and new-product demand.'],
      ['Customer retention','Repeat customers, subscriptions and reorder behavior can strengthen revenue quality when they are durable and verifiable.'],
      ['Hero-product concentration','A single dominant product can simplify the business but may also make results more vulnerable to one SKU.'],
      ['Channel dependence','Reliance on Amazon, paid social, one influencer channel or one retailer can affect how transferable growth appears.']
    ],
    prep:'Prepare recent financials, reorder or subscription data if available, channel mix, supplier details and revenue concentration by product.'
  },
  {
    slug:'beauty', name:'Beauty', label:'Beauty Brands',
    eyebrow:'For established beauty eCommerce owners',
    intro:'Estimate what a beauty eCommerce business may be worth and see the niche-specific factors a buyer may investigate.',
    scope:'cosmetics, skincare and beauty-product brands; use Personal Care for grooming and everyday hygiene products.',
    factors:[
      ['Repeat and replenishment','Beauty products with natural replenishment cycles can support stronger repeat behavior than purely one-time purchases.'],
      ['Brand and intellectual property','Trademarks, formulations, packaging, brand recognition and transferable creative assets can affect defensibility.'],
      ['Hero-SKU concentration','A breakout product can drive growth, but buyers also look at how dependent the business is on that one item.'],
      ['Channel mix','DTC, Amazon, retail, influencer and paid-social concentration can change both opportunity and acquisition risk.']
    ],
    prep:'Bring recent profit, repeat-purchase information, product concentration, channel mix, supplier or formulation ownership, and inventory levels.'
  },
  {
    slug:'personal-care', name:'Personal Care', label:'Personal Care Brands',
    eyebrow:'For established personal-care eCommerce owners',
    intro:'Estimate what a personal-care eCommerce business may be worth and review the factors that can shape buyer confidence.',
    scope:'grooming, hygiene and personal-care products; use Beauty for cosmetics and beauty-led skincare brands.',
    factors:[
      ['Replenishment behavior','Products that are used up and reordered can create a different revenue profile from durable or occasional purchases.'],
      ['Claims and documentation','Product claims, labeling, supplier records and transferable documentation can become diligence issues.'],
      ['Product concentration','Revenue concentrated in one product or one format can increase sensitivity to changes in demand.'],
      ['Acquisition efficiency','Buyers may look at how dependent growth is on paid channels versus repeat, direct and organic demand.']
    ],
    prep:'Prepare recent financials, repeat-purchase data, channel mix, supplier documentation, inventory and revenue by major product.'
  },
  {
    slug:'home', name:'Home Goods', label:'Home Goods Brands',
    eyebrow:'For established home-goods eCommerce owners',
    intro:'Estimate what a home-goods eCommerce business may be worth and review the operational factors that can influence buyer interest.',
    scope:'home goods, furnishings, décor and storage products; use Kitchenware for cookware and kitchen-focused products.',
    factors:[
      ['Inventory turns','Slow-moving or bulky inventory can tie up cash and create a different risk profile from fast-moving products.'],
      ['Shipping complexity','Oversized, fragile or expensive-to-ship products can affect margin quality and operational transferability.'],
      ['SKU breadth','A broad catalog can diversify revenue, but it can also increase inventory and forecasting complexity.'],
      ['Supplier concentration','Dependence on one manufacturer, geography or sourcing relationship can increase continuity risk.']
    ],
    prep:'Have recent financials, inventory aging, shipping economics, supplier concentration and revenue by major product or category ready.'
  },
  {
    slug:'apparel-accessories', name:'Apparel & Accessories', label:'Apparel & Accessories',
    eyebrow:'For established apparel and accessories eCommerce owners',
    intro:'Estimate what an apparel or accessories eCommerce business may be worth and review the factors that make this category distinctive.',
    scope:'clothing, fashion accessories and related DTC merchandise.',
    factors:[
      ['Returns and sizing','Fit, sizing complexity and return rates can materially affect the quality of reported revenue and margin.'],
      ['Inventory aging','Seasonal or trend-sensitive inventory can lose value faster than evergreen merchandise.'],
      ['Seasonality and fashion risk','Demand can move quickly with seasons, trends and influencer cycles, making durability important to buyers.'],
      ['Customer and channel mix','Repeat customers, wholesale relationships, DTC traffic and paid acquisition can each change transferability.']
    ],
    prep:'Prepare recent financials, return rates, inventory aging, repeat-purchase data, seasonality and revenue by channel.'
  },
  {
    slug:'automotive', name:'Automotive', label:'Automotive Brands',
    eyebrow:'For established automotive eCommerce owners',
    intro:'Estimate what an automotive-parts or accessories eCommerce business may be worth, with extra attention to fitment, warranty exposure and catalog durability.',
    scope:'vehicle parts, accessories and automotive-product brands; not repair shops or local automotive services.',
    factors:[
      ['Fitment complexity','Compatibility by make, model and year can increase catalog value while also increasing support and return complexity.'],
      ['Warranty and returns','Product failure, warranty exposure and return rates can materially affect normalized profit.'],
      ['Catalog durability','Long-lived SKUs and stable fitment demand can look different from products exposed to fast model-cycle changes.'],
      ['Supplier concentration','Exclusive, durable supplier relationships can help transferability; single-source dependence can also create risk.']
    ],
    prep:'Prepare recent financials, return and warranty rates, supplier concentration, catalog mix and major acquisition channels.'
  },
  {
    slug:'health-fitness', name:'Health & Fitness', label:'Health & Fitness Brands',
    eyebrow:'For established health and fitness eCommerce owners',
    intro:'Estimate what a health and fitness eCommerce business may be worth and review the factors buyers may separate from headline revenue.',
    scope:'fitness gear, wellness products and related merchandise; use Supplements for ingestible supplement brands.',
    factors:[
      ['Repeat vs. durable products','Replenishable products can support recurring demand while durable equipment may require continued customer acquisition.'],
      ['Claims and compliance','Health-related claims, labeling and documentation can become important diligence items.'],
      ['Community and brand demand','Owned audiences, communities and direct demand may reduce reliance on paid acquisition when they are transferable.'],
      ['Seasonality','New-year, summer and event-driven demand can distort short measurement windows if not normalized.']
    ],
    prep:'Prepare recent financials, product mix, repeat purchase, channel mix, seasonality and any compliance-sensitive product information.'
  },
  {
    slug:'children-toys', name:'Children & Toys', label:'Children & Toys',
    eyebrow:'For established children and toy eCommerce owners',
    intro:'Estimate what a children or toy eCommerce business may be worth and review category-specific buyer considerations.',
    scope:'toys, baby products and children-focused merchandise.',
    factors:[
      ['Safety and compliance','Age ratings, product safety, documentation and recalls can materially affect diligence.'],
      ['Seasonality and gifting','Holiday and gifting demand can create concentrated revenue periods that buyers will want to normalize.'],
      ['Product lifecycle','Children age out of products and toy trends can move quickly, so evergreen demand can be valuable.'],
      ['Hero-product concentration','A flagship product can drive growth while also making results dependent on a single item or trend.']
    ],
    prep:'Prepare recent financials, seasonal revenue mix, product concentration, supplier records, safety documentation and inventory.'
  },
  {
    slug:'outdoors', name:'Outdoors', label:'Outdoor Brands',
    eyebrow:'For established outdoor eCommerce owners',
    intro:'Estimate what a camping or outdoor-recreation eCommerce business may be worth, with extra attention to seasonal demand, enthusiast loyalty and inventory profile.',
    scope:'camping, hiking, fishing and outdoor-recreation products; use Sports for sport-specific gear.',
    factors:[
      ['Seasonality','Weather, travel and seasonal recreation can concentrate revenue into particular months.'],
      ['Community and brand loyalty','Strong direct demand, enthusiast communities and repeat customers can reduce reliance on paid acquisition.'],
      ['Inventory profile','Durable goods can carry different inventory and repeat-purchase economics from consumable accessories.'],
      ['Channel concentration','Marketplace, retail, wholesale and direct-to-consumer mix can materially change transferability.']
    ],
    prep:'Prepare recent financials, seasonal trends, inventory turns, repeat-customer data, channel mix and supplier concentration.'
  },
  {
    slug:'food-beverages', name:'Food & Beverages', label:'Food & Beverage Brands',
    eyebrow:'For established food and beverage eCommerce owners',
    intro:'Estimate what a food or beverage eCommerce business may be worth and review the buyer factors unique to consumable products.',
    scope:'consumable food and beverage brands; use Supplements for vitamins and supplement products.',
    factors:[
      ['Repeat purchase','Consumable products can support recurring customer behavior when reorder rates are healthy.'],
      ['Shelf life and fulfillment','Expiration, storage, shipping and cold-chain requirements can affect inventory risk and margin.'],
      ['Gross margin quality','Ingredient, packaging and fulfillment costs can move quickly and may require careful normalization.'],
      ['Compliance and labeling','Product claims, labeling, supplier documentation and regulatory obligations can affect diligence.']
    ],
    prep:'Prepare recent financials, repeat-purchase data, inventory age, fulfillment requirements, gross margin and supplier documentation.'
  },
  {
    slug:'sports', name:'Sports', label:'Sports Brands',
    eyebrow:'For established sports eCommerce owners',
    intro:'Estimate what a sport-specific eCommerce business may be worth, with extra attention to sport seasons, licensing and community-driven demand.',
    scope:'sport-specific equipment, apparel and accessories; use Outdoors for camping and outdoor-recreation products.',
    factors:[
      ['Seasonality','Sport seasons, events and weather can concentrate demand and complicate short-term comparisons.'],
      ['Licensing and intellectual property','Licensed merchandise or protected brand assets can create value while also creating dependency on agreements.'],
      ['Community demand','Enthusiast audiences, clubs, creators and direct traffic can strengthen acquisition diversity.'],
      ['Product mix','Consumables, apparel, equipment and accessories can have very different repeat-purchase and inventory profiles.']
    ],
    prep:'Prepare recent financials, seasonal trends, licensing arrangements, channel mix, inventory and product-category revenue.'
  },
  {
    slug:'occasions-gifts', name:'Occasions & Gifts', label:'Gift Brands',
    eyebrow:'For established gift and occasion eCommerce owners',
    intro:'Estimate what a gift-focused eCommerce business may be worth and review the factors buyers may normalize before making an offer.',
    scope:'giftable, personalized and occasion-led products where gifting is the primary purchase use case.',
    factors:[
      ['Holiday concentration','Q4, weddings and other occasions can create large revenue spikes that buyers may normalize across years.'],
      ['Personalization workflow','Custom products can support differentiation but may also increase labor, turnaround and operational complexity.'],
      ['Customer acquisition','Gift businesses can be highly event-driven, making repeat behavior and organic/direct demand especially important.'],
      ['Catalog breadth','A wide catalog can diversify occasions while increasing inventory, creative and fulfillment complexity.']
    ],
    prep:'Prepare recent financials, seasonal revenue by month, personalization workflow, channel mix and product concentration.'
  },
  {
    slug:'kitchenware', name:'Kitchenware', label:'Kitchenware Brands',
    eyebrow:'For established kitchenware eCommerce owners',
    intro:'Estimate what a kitchenware eCommerce business may be worth and review the niche-specific factors that can affect buyer confidence.',
    scope:'cookware, utensils, kitchen tools and kitchen-focused products; use Home for broader home-goods brands.',
    factors:[
      ['Durable-product economics','Many kitchen products are bought infrequently, so acquisition efficiency can matter more than reorder behavior.'],
      ['Shipping and breakage','Heavy, fragile or oversized products can create hidden fulfillment and return costs.'],
      ['Hero-product concentration','One breakout appliance or accessory can drive results while increasing concentration risk.'],
      ['Sourcing and inventory','Lead times, minimum order quantities and supplier concentration can affect cash needs and continuity.']
    ],
    prep:'Prepare recent financials, shipping and return economics, inventory turns, supplier concentration and revenue by top product.'
  },
  {
    slug:'hobbies', name:'Hobbies', label:'Hobby Brands',
    eyebrow:'For established hobby eCommerce owners',
    intro:'Estimate what a hobby eCommerce business may be worth and review the factors buyers may examine in enthusiast-driven markets.',
    scope:'craft, collector and hobby-specific products; use Gaming for gaming-led products and accessories.',
    factors:[
      ['Community loyalty','Enthusiast audiences, forums, clubs, creators and email lists can create durable demand when transferable.'],
      ['Repeat catalog behavior','Collectors and hobbyists may make repeated purchases when the catalog supports ongoing participation.'],
      ['Trend and platform risk','Demand can move with games, creators, licensing and changing hobby trends.'],
      ['Catalog depth','A deep assortment can strengthen retention while increasing inventory and supplier complexity.']
    ],
    prep:'Prepare recent financials, repeat-customer data, owned-audience metrics, catalog concentration, inventory and supplier mix.'
  },
  {
    slug:'gaming', name:'Gaming', label:'Gaming Brands',
    eyebrow:'For established gaming eCommerce owners',
    intro:'Estimate what a gaming eCommerce business may be worth and review the factors that can make this niche more or less transferable.',
    scope:'gaming accessories, gaming merchandise and gaming-focused product brands.',
    factors:[
      ['Platform dependence','Demand tied to a specific console, game, marketplace or creator can change quickly.'],
      ['Licensing and IP','Licensed products and proprietary brands can create value while also creating contract dependencies.'],
      ['Community strength','Owned communities, direct demand and repeat buyers may reduce dependence on paid acquisition.'],
      ['Product lifecycle','Hardware and game cycles can make inventory and demand more time-sensitive than in evergreen categories.']
    ],
    prep:'Prepare recent financials, product/platform concentration, licensing arrangements, community metrics, inventory and channel mix.'
  },
  {
    slug:'travel-products', name:'Travel Products', label:'Travel Product Brands',
    eyebrow:'For established travel-product eCommerce owners',
    intro:'Estimate what a travel-product eCommerce business may be worth and review the factors buyers may examine beyond recent sales.',
    scope:'luggage, organizers and travel accessories; not travel agencies, bookings or hospitality businesses.',
    factors:[
      ['Travel-cycle sensitivity','Travel demand can respond to macro conditions and seasonality, so buyers may normalize unusual periods.'],
      ['Product durability','Luggage and accessories can have long replacement cycles, changing repeat-purchase expectations.'],
      ['Geographic exposure','Demand tied heavily to one geography or travel pattern can create concentration risk.'],
      ['Channel mix','Marketplace, retail, wholesale and DTC dependence can shape transferability and margin quality.']
    ],
    prep:'Prepare recent financials, seasonal trends, geographic mix, product concentration, inventory and acquisition channels.'
  },
  {
    slug:'technology-electronics', name:'Technology & Electronics', label:'Technology & Electronics',
    eyebrow:'For established technology and electronics eCommerce owners',
    intro:'Estimate what a consumer-electronics eCommerce business may be worth, with extra attention to obsolescence, warranty costs and fast product cycles.',
    scope:'consumer electronics, tech accessories and technology-product brands.',
    factors:[
      ['Obsolescence','Fast product cycles can shorten inventory life and make historical performance less durable.'],
      ['Warranty and returns','Failure rates, warranty obligations and return costs can materially change normalized profit.'],
      ['Supplier dependence','Exclusive access can be valuable, while dependence on one manufacturer or distributor can increase risk.'],
      ['Channel concentration','Marketplace policy changes or one dominant acquisition channel can materially affect transferability.']
    ],
    prep:'Prepare recent financials, inventory age, warranty and return rates, supplier concentration, channel mix and product lifecycle data.'
  },
  {
    slug:'equipment', name:'Equipment', label:'Equipment Brands',
    eyebrow:'For established equipment eCommerce owners',
    intro:'Estimate what an equipment eCommerce business may be worth and review the factors buyers may examine in higher-ticket product businesses.',
    scope:'higher-ticket specialized equipment sold online; not local equipment service businesses.',
    factors:[
      ['Ticket size and sales cycle','Higher-value products can produce attractive order economics while creating longer and lumpier sales cycles.'],
      ['B2B vs. B2C mix','Repeat commercial accounts can behave differently from one-time consumer purchases and may affect concentration risk.'],
      ['Warranty and support','After-sale obligations, technical support and returns can change owner workload and normalized profit.'],
      ['Logistics and sourcing','Freight, warehousing, lead times and supplier concentration can materially affect working capital.']
    ],
    prep:'Prepare recent financials, average order value, B2B customer concentration, warranty/support costs, inventory and supplier mix.'
  },
  {
    slug:'office-b2b-supply', name:'Office & B2B Supply', label:'Office & B2B Supply',
    eyebrow:'For established office and B2B supply eCommerce owners',
    intro:'Estimate what an office or B2B supply eCommerce business may be worth and review the factors buyers may examine in account-driven commerce.',
    scope:'office, workplace and recurring B2B supply products sold through eCommerce.',
    factors:[
      ['Recurring business accounts','Repeat B2B purchasing can create durable revenue when customer relationships transfer cleanly.'],
      ['Customer concentration','A few large accounts can make revenue predictable while also creating material concentration risk.'],
      ['Commodity margin pressure','Catalog overlap and price competition can make gross margin durability especially important.'],
      ['Supplier and catalog depth','Broad, reliable sourcing can support retention while increasing catalog and working-capital complexity.']
    ],
    prep:'Prepare recent financials, repeat-account revenue, customer concentration, gross margin, supplier mix and inventory or catalog exposure.'
  }
];

const NICHE_MAP = new Map(NICHES.map(n => [n.slug, n]));

function esc(value='') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function pathFor(url) {
  let p = url.pathname || '/';
  if (p === '/') return '/';
  if (!p.endsWith('/') && !p.split('/').pop().includes('.')) p += '/';
  return p;
}

function seo(url, status, routeType, indexingEnabled=false) {
  const production = url.hostname === 'calcinsider.com' && indexingEnabled;
  const path = pathFor(url);
  const indexable = production && status < 400 && (routeType === 'home' || routeType === 'niche');
  return {
    canonical: 'https://calcinsider.com' + path,
    robots: indexable ? 'index,follow' : 'noindex,follow'
  };
}

function head({title, description, canonical, robots}) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=ci-1">
<link rel="stylesheet" href="/assets/styles.css">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">`;
}

function shell({title, description, canonical, robots, body, bodyAttrs=''}) {
  return `<!doctype html>
<html lang="en">
<head>
${head({title, description, canonical, robots})}
</head>
<body ${bodyAttrs}>
<a class="skip" href="#main">Skip to main content</a>
<header><div class="shell header"><a class="brand" href="/">CALC INSIDER</a><nav class="nav" aria-label="Main"><a href="/#niches">Valuation niches</a><a href="/disclosure/">Disclosure</a></nav></div></header>
${body}
<footer><div class="shell footer"><span>Calc Insider</span><nav aria-label="Footer"><a href="/disclosure/">Disclosure</a><a href="/privacy/">Privacy</a></nav></div></footer>
<script src="/assets/app.js" defer></script>
</body></html>`;
}

function homeHtml(url, indexingEnabled) {
  const state = seo(url, 200, 'home', indexingEnabled);
  const cards = NICHES.map(n => `<a class="niche-card" data-niche-link data-niche-name="${esc(n.name.toLowerCase())}" data-niche-slug="${n.slug}" href="/${n.slug}/"><strong>${esc(n.label)}</strong><span aria-hidden="true">→</span></a>`).join('');
  return shell({
    title:'eCommerce Business Valuation by Industry | Calc Insider',
    description:'Choose your eCommerce industry and use Empire Flippers’ official valuation tool. Compare 20 focused valuation experiences with niche-specific buyer context.',
    canonical:state.canonical,
    robots:state.robots,
    body:`<main id="main">
<section class="hero shell">
<p class="eyebrow">eCommerce valuation by industry</p>
<h1>What is your eCommerce business worth?</h1>
<p class="lede">Choose the industry that best matches what you sell. Each experience uses Empire Flippers’ official eCommerce valuation tool, with buyer context specific to that niche.</p>
</section>
<section id="niches" class="chooser shell" aria-labelledby="niche-title">
<div class="chooser-head">
<div><p class="eyebrow">20 focused niches</p><h2 id="niche-title">Find your industry</h2></div>
<label class="search-label" for="niche-search"><span>Filter niches</span><input id="niche-search" type="search" inputmode="search" autocomplete="off" placeholder="Try pet, beauty, automotive…"></label>
</div>
<p class="chooser-help">Not an exact match? Choose the closest product category. Every niche uses Empire Flippers’ eCommerce valuation flow, so choose a page based on what you sell.</p>
<div class="niche-list" id="niche-list">${cards}</div>
<p class="empty-state hidden" id="niche-empty">No matching niche. Try a broader term.</p>
</section>
<section class="section shell compact-section">
<div class="notice"><strong>How this works:</strong> valuation is powered by Empire Flippers. Calc Insider adds niche-specific context around what buyers may examine. We do not create a proprietary industry multiple.</div>
</section>
</main>`
  });
}

function nicheHtml(url, niche, indexingEnabled) {
  const state = seo(url, 200, 'niche', indexingEnabled);
  const factorCards = niche.factors.map(([h,p]) => `<div class="signal"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('');
  const faq1 = niche.factors[0];
  const faq2 = niche.factors[1];
  return shell({
    title:`${niche.name} eCommerce Business Valuation Calculator | Calc Insider`,
    description:`Estimate what an established ${niche.name.toLowerCase()} eCommerce business may be worth using Empire Flippers’ official valuation tool, with niche-specific buyer factors.`,
    canonical:state.canonical,
    robots:state.robots,
    bodyAttrs:`data-niche-id="ci_${niche.slug.replace(/-/g,'_')}" data-niche-slug="${niche.slug}" data-monetization="eCommerce"`,
    body:`<main id="main">
<section class="hero shell">
<p class="eyebrow">${esc(niche.eyebrow)}</p>
<h1>What is your ${esc(niche.name)} eCommerce business worth?</h1>
<p class="lede">${esc(niche.intro)}</p>
<p class="fit-note"><strong>Best fit:</strong> ${esc(niche.scope)}</p><p class="micro">Valuation powered by Empire Flippers. No email gate from Calc Insider.</p>
</section>

<section id="valuation" class="section shell tool-section">
<div class="card">
<p class="eyebrow">Official valuation tool</p>
<h2>Start with the numbers.</h2>
<p>This page uses Empire Flippers’ <strong>eCommerce</strong> valuation flow. If Empire Flippers would classify your business primarily as Amazon FBA, SaaS, content or another model, this niche page may not be the right valuation path.</p>
<div id="valuation-container"><div id="ef-vt-embed"></div><div id="ef-fallback" class="notice hidden">The embed did not load. <a id="ef-fallback-link" href="https://empireflippers.com/vt/?referrer=${REFERRAL_CODE}" rel="sponsored noopener">Open Empire Flippers’ valuation tool directly.</a></div></div>
<p class="micro">Calc Insider may earn a referral fee if an eligible transaction closes. You pay no extra. <a href="/disclosure/">Disclosure</a> · <a href="/privacy/">Privacy</a></p>
</div>
</section>

<section id="drivers" class="section shell">
<p class="eyebrow">What buyers may look at</p>
<h2>${esc(niche.name)} businesses have their own risk profile.</h2>
<div class="grid">${factorCards}</div>
</section>

<section class="section shell">
<p class="eyebrow">Before you value it</p>
<h2>Three useful checks</h2>
<details><summary>Can ${esc(faq1[0].toLowerCase())} affect value?</summary><p>${esc(faq1[1])}</p></details>
<details><summary>Why does ${esc(faq2[0].toLowerCase())} matter to a buyer?</summary><p>${esc(faq2[1])}</p></details>
<details><summary>What should I prepare before valuing a ${esc(niche.name)} business?</summary><p>${esc(niche.prep)}</p></details>
</section>

<section class="section shell compact-section">
<div class="notice"><strong>Preliminary estimate only.</strong> The tool does not guarantee a listing price or sale price. A transaction can depend on additional diligence, deal structure and buyer-specific considerations.</div>
</section>
</main>`
  });
}

function disclosureHtml(url, indexingEnabled) {
  const state = seo(url, 200, 'legal', indexingEnabled);
  return shell({
    title:'Disclosure | Calc Insider',
    description:'Calc Insider affiliate and valuation-tool disclosure.',
    canonical:state.canonical,
    robots:state.robots,
    body:`<main id="main"><section class="section shell legal"><p class="eyebrow">Disclosure</p><h1>How Calc Insider is funded</h1><p>Calc Insider may earn a referral fee if you use an Empire Flippers link or valuation experience and later complete an eligible transaction with Empire Flippers. You pay no extra because of that referral.</p><p>Compensation does not change the valuation inputs you provide to Empire Flippers. The valuation tool is powered by Empire Flippers; Calc Insider does not create a separate proprietary valuation or guarantee a sale price.</p><p>Our goal is to help you choose the closest niche, understand buyer-relevant factors and decide whether further valuation or sale preparation is useful.</p></section></main>`
  });
}

function privacyHtml(url, indexingEnabled) {
  const state = seo(url, 200, 'legal', indexingEnabled);
  return shell({
    title:'Privacy | Calc Insider',
    description:'Calc Insider privacy information.',
    canonical:state.canonical,
    robots:state.robots,
    body:`<main id="main"><section class="section shell legal"><p class="eyebrow">Privacy</p><h1>Minimal data by design</h1><p>Calc Insider does not ask you to enter valuation inputs into our own forms. The embedded valuation experience is provided by Empire Flippers.</p><p>We may collect aggregate site and interaction analytics such as page views, niche selection, valuation interaction, scroll depth and outbound referral clicks. We do not intentionally send names, email addresses, revenue, profit figures or free-text valuation inputs into our analytics events.</p><p>Third-party services may process information under their own privacy terms when you use their tools or links.</p></section></main>`
  });
}

function notFound(url, indexingEnabled) {
  const state = seo(url, 404, '404', indexingEnabled);
  return shell({
    title:'Page Not Found | Calc Insider',
    description:'That Calc Insider page was not found.',
    canonical:state.canonical,
    robots:state.robots,
    body:`<main id="main"><section class="hero shell"><p class="eyebrow">404</p><h1>That page isn’t here.</h1><p class="lede">Choose an eCommerce niche to start a valuation.</p><a class="button visible-button" href="/">See valuation niches</a></section></main>`
  });
}

function sitemap() {
  const urls = ['/', ...NICHES.map(n => '/' + n.slug + '/')];
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(p => '  <url><loc>https://calcinsider.com' + p + '</loc></url>').join('\n') +
    '\n</urlset>\n';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const indexingEnabled = env.PUBLIC_INDEXING === 'true';

    if (url.hostname === 'www.calcinsider.com') {
      return Response.redirect('https://calcinsider.com' + url.pathname + url.search, 301);
    }

    if (url.pathname === '/assets/styles.css') {
      return new Response(CALCINSIDER_STYLES, {
        headers:{'content-type':'text/css; charset=UTF-8','cache-control':'public, max-age=300'}
      });
    }

    if (url.pathname === '/assets/app.js') {
      return new Response(CALCINSIDER_APP, {
        headers:{'content-type':'application/javascript; charset=UTF-8','cache-control':'public, max-age=300'}
      });
    }

    if (url.pathname === '/favicon.svg') {
      return new Response(CALCINSIDER_FAVICON, {
        headers:{'content-type':'image/svg+xml; charset=UTF-8','cache-control':'public, max-age=3600'}
      });
    }

    if (url.pathname === '/robots.txt') {
      const robots = indexingEnabled
        ? 'User-agent: *\\nAllow: /\\nSitemap: https://calcinsider.com/sitemap.xml\\n'
        : 'User-agent: *\\nDisallow: /\\n';
      return new Response(robots, {
        headers:{'content-type':'text/plain; charset=UTF-8','cache-control':'public, max-age=3600'}
      });
    }

    if (url.pathname === '/sitemap.xml') {
      return new Response(sitemap(), {
        headers:{'content-type':'application/xml; charset=UTF-8','cache-control':'public, max-age=3600'}
      });
    }

    const path = pathFor(url);
    let html = '';
    let status = 200;

    if (path === '/') html = homeHtml(url, indexingEnabled);
    else if (path === '/disclosure/') html = disclosureHtml(url, indexingEnabled);
    else if (path === '/privacy/') html = privacyHtml(url, indexingEnabled);
    else {
      const slug = path.split('/').filter(Boolean)[0] || '';
      const niche = path === '/' + slug + '/' ? NICHE_MAP.get(slug) : null;
      if (niche) html = nicheHtml(url, niche, indexingEnabled);
      else {
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) return asset;
        status = 404;
        html = notFound(url, indexingEnabled);
      }
    }

    return new Response(html, {
      status,
      headers:{
        'content-type':'text/html; charset=UTF-8',
        'cache-control':status === 200 ? 'public, max-age=300' : 'no-cache',
        'x-content-type-options':'nosniff',
        'referrer-policy':'strict-origin-when-cross-origin'
      }
    });
  }
};
