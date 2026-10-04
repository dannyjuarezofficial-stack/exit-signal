const CATEGORY_SLUGS = [
  'affiliate','agency','amazon-associates','amazon-fba','amazon-fbm','amazon-kdp',
  'amazon-merch','application','digital-product','display-advertising','dropshipping',
  'ecommerce','info-product','lead-gen','newsletter','saas','service','subscription',
  'subscription-box','youtube'
];
const CATEGORY_SET = new Set(CATEGORY_SLUGS);

function normalizedPath(pathname) {
  if (pathname === '/') return '/';
  if (pathname.endsWith('/')) return pathname;
  const last = pathname.split('/').pop() || '';
  return last.includes('.') ? pathname : pathname + '/';
}

function seoState(pathname, hostname, status) {
  const path = normalizedPath(pathname);
  const production = hostname === 'businessvaluationcheck.com';
  const slug = path.split('/').filter(Boolean)[0] || '';
  const isCategory = CATEGORY_SET.has(slug) && path === '/' + slug + '/';
  const indexable = production && status < 400 && (path === '/' || (isCategory && slug !== 'amazon-fba'));
  return {
    path,
    canonical: 'https://businessvaluationcheck.com' + path,
    robots: indexable ? 'index,follow' : 'noindex,follow'
  };
}

function sitemap() {
  const urls = ['/', ...CATEGORY_SLUGS.filter(s => s !== 'amazon-fba').map(s => '/' + s + '/')];
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(u => '  <url><loc>https://businessvaluationcheck.com' + u + '</loc></url>').join('\n') +
    '\n</urlset>\n';
}

function branded404() {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Page Not Found | Business Valuation Check</title>' +
    '<meta name="robots" content="noindex,follow">' +
    '<link rel="stylesheet" href="/assets/styles.css"></head><body>' +
    '<a class="skip" href="#main">Skip to main content</a>' +
    '<header><div class="shell header"><a class="brand" href="/">BUSINESS VALUATION CHECK</a></div></header>' +
    '<main id="main"><section class="hero shell"><p class="eyebrow">404</p>' +
    '<h1>That page isn’t here.</h1><p class="lede">Choose your business model to start a valuation.</p>' +
    '<a class="button" href="/">Go to Business Valuation Check</a></section></main></body></html>';
}

function rewriteHtml(html, state) {
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="' + state.robots + '">');
  } else {
    html = html.replace(/<\/head>/i, '<meta name="robots" content="' + state.robots + '"></head>');
  }
  return html.replace(/<\/head>/i, '<link rel="canonical" href="' + state.canonical + '"></head>');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.businessvaluationcheck.com') {
      return Response.redirect('https://businessvaluationcheck.com' + url.pathname + url.search, 301);
    }

    if (url.pathname === '/robots.txt') {
      return new Response(
        'User-agent: *\nAllow: /\nSitemap: https://businessvaluationcheck.com/sitemap.xml\n',
        {headers:{'content-type':'text/plain; charset=UTF-8','cache-control':'public, max-age=3600'}}
      );
    }

    if (url.pathname === '/sitemap.xml') {
      return new Response(sitemap(), {
        headers:{'content-type':'application/xml; charset=UTF-8','cache-control':'public, max-age=3600'}
      });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const contentType = assetResponse.headers.get('content-type') || '';
    const state = seoState(url.pathname, url.hostname, assetResponse.status);

    if (assetResponse.status === 404) {
      const html = rewriteHtml(branded404(), state);
      return new Response(html, {
        status:404,
        headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-cache'}
      });
    }

    if (!contentType.includes('text/html')) return assetResponse;

    const html = rewriteHtml(await assetResponse.text(), state);
    const headers = new Headers(assetResponse.headers);
    headers.delete('content-length');
    headers.set('content-type','text/html; charset=UTF-8');
    return new Response(html, {status:assetResponse.status, headers});
  }
};
