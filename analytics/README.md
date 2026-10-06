# Aggregate event collection
Status: tested locally; not deployed. Base: valuation-portfolio-v1 b6ece3a.
Deploy BVC with: npx wrangler deploy --config wrangler.valuation-events.jsonc
Requires existing authorized Cloudflare access. This config creates the EVENTS Analytics Engine binding.
No new paid subscription is configured.

The wrapper preserves the existing website and injects a dataLayer consumer. It records aggregate page views, valuation interactions, outbound clicks, scroll and visible-time milestones. Page views are not unique visitors. No session identifiers are collected. GPC and DNT suppress collection.
Raw request URLs, IPs, cookies, referrers, form inputs, emails and financial amounts are not persisted by this code. Cloudflare infrastructure processing is separate.
This is diagnostic client telemetry, not proof of a referral, close or payment. Same-origin checks do not authenticate visitors or prevent determined spoofing. Client sends are bounded to 40 per page. Configure edge rate limiting if abuse occurs.
Missing bindings return 503 instead of a false success. A 204 means the Analytics Engine write was queued, not independently verified. Verify live data with an aggregate query after deployment.
Analytics Engine retention is three months; export aggregates before expiry for long-term comparisons.
SQL column mapping: blob1 hostname; blob2 event; blob3 category_id; blob4 category_slug; blob5 experience_version; double1 count.
Example SQL:
SELECT blob1 AS site, blob2 AS event, blob3 AS category_id, SUM(_sample_interval * double1) AS events
FROM exit_signal_events WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY site, event, category_id

Exit Signal's current V4.3 source/deploy mapping remains unresolved. Do not deploy old main to getexitsignal.com.
CalcInsider is being published in another chat; no changes to that branch.
Google Search Console authorization, scheduled reporting and long-term exports are not implemented here.
Local checks passed: valid ingestion, privacy filtering, cross-origin rejection, invalid event rejection, size limits, missing binding and HTML integration. A live receipt is still required.
