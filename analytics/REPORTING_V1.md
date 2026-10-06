# Analytics reporting/export V1

Status: PREPARED ON NON-PRODUCTION BRANCH. DO NOT DEPLOY UNTIL REPORT_DB has a real D1 database ID.

## Architecture

- Existing client events continue writing to Workers Analytics Engine dataset `exit_signal_events`.
- Cloudflare Analytics SQL binding (`ANALYTICS_SQL`) queries aggregates without an API token.
- A daily Cron Trigger archives completed UTC-day aggregates into D1.
- Daily runs automatically repair up to seven missed days.
- A weekly Cron Trigger generates a seven-day report snapshot in D1.
- No raw URLs, IPs, cookies, referrers, form answers, names, emails or financial inputs are introduced.
- No report endpoint is exposed publicly in V1.

## Durable tables

- `daily_event_aggregates`
- `report_runs`
- `weekly_reports`

## Schedules

- Daily archive: 00:20 UTC
- Weekly report snapshot: Monday 00:35 UTC

## One-time prerequisite

Create a D1 database named `exit-signal-analytics-archive` on the same Cloudflare account and replace `REPLACE_WITH_D1_DATABASE_ID` in `wrangler.valuation-reporting.jsonc`.

D1 Free plan limits are far above the expected V1 write/read volume. No paid analytics vendor is required.

## Deployment gate

After the D1 ID is inserted:
1. Run static syntax/config checks.
2. Deploy with `wrangler.valuation-reporting.jsonc`.
3. Verify the cron bindings.
4. Manually invoke/test one archive run.
5. Verify D1 contains at least one `report_runs` row and aggregate rows.
6. Only then treat durable export/report generation as live.

Automatic email/report delivery is intentionally not enabled in V1 because that requires an outbound delivery channel or exposing report data. Keep the archive private by default.
