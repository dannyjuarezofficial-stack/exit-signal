# CalcInsider 20-Niche Valuation Experiment — V1 Candidate

Status: **NON-PRODUCTION BUILD CANDIDATE**

This branch intentionally reuses the proven Business Valuation Check visual language and Empire Flippers integration, while changing the experimental variable from broad business model to **eCommerce niche**.

## Experiment

All 20 routes:
- use Empire Flippers' official valuation snippet v2.1;
- lock monetization to `eCommerce`;
- preserve referral code `DBKZ7AVTPGFSXPVM`;
- track a stable `niche_id` / `niche_slug`;
- provide four niche-specific buyer factors;
- provide niche-specific FAQ/preparation copy;
- share one analytics contract.

Primary comparison:
1. valuation interaction rate;
2. EF outbound rate;
3. downstream referral/economic evidence.

Raw traffic is acquisition evidence, not the winner metric.

## 20 routes

supplements, pet-care, beauty, personal-care, home, apparel-accessories, automotive,
health-fitness, children-toys, outdoors, food-beverages, sports, occasions-gifts,
kitchenware, hobbies, gaming, travel-products, technology-electronics, equipment,
office-b2b-supply.

## Deliberate improvements from BVC

- Homepage filter for faster niche selection without changing the overall dark editorial style.
- Production pages are generated from one structured niche matrix, reducing copy drift and maintenance.
- All niche pages hold business model constant at eCommerce to isolate niche demand.
- Explicit statement that Calc Insider does not create a proprietary niche-specific multiple.
- Better focus/focus-visible accessibility.
- Privacy copy explicitly excludes names, email, revenue, profit and free-text valuation inputs from our analytics events.
- No gradients in CalcInsider's cards; the BVC palette and typographic feel remain.

## Deployment boundary

No production deployment is authorized by this branch.
Do not run:
`npx --yes wrangler@4.147.0 deploy -c wrangler.calcinsider.jsonc`
until Danny explicitly approves deployment and domain/DNS state is verified.

Before launch:
- run `node scripts/verify-calcinsider.mjs`;
- render desktop + mobile;
- verify all 20 routes;
- verify EF embed on representative pages;
- verify favicon / 404 / robots / sitemap;
- run overlap/cannibalization audit;
- verify named analytics event receipt where available.
