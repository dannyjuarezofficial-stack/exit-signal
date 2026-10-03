# Exit Signal

Static website source for https://getexitsignal.com.

## Release

The `public/` directory contains the unchanged frozen V4.3 website files. Original deployment ZIP SHA-256: `6705e4ea8367cf5595e08feddfe818b451eb8ca41b77494def134459300ed985`.

## Deployment

Existing Cloudflare Worker: `divine-lake-04ab`. Connect this repository in the worker's Settings > Builds, using production branch `main`, no build command, repository root `/`, and deployment command `npx --yes wrangler@4.147.0 deploy`.

Only `public/` is published as static assets. Keep credentials, private analytics and internal business documents outside this repository. Verify the live apex and www domains, page navigation, quiz and valuation link after each release.
