const CATEGORY_SLUGS = new Set([
  'affiliate','agency','amazon-associates','amazon-fba','amazon-fbm','amazon-kdp',
  'amazon-merch','application','digital-product','display-advertising','dropshipping',
  'ecommerce','info-product','lead-gen','newsletter','saas','service','subscription',
  'subscription-box','youtube'
]);

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
  const isCategory = CATEGORY_SLUGS.has(slug) && path === '/' + slug + '/';
  const indexable = production && status < 400 && (path === '/' || (isCategory && slug !== 'amazon-fba'));
  return {
    path,
    canonical: 'https://businessvaluationcheck.com' + path,
    robots: indexable ? 'index,follow' : 'noindex,follow'
  };
}

function sitemap() {
  const urls = ['/', ...[...CATEGORY_SLUGS].filter(s => s !== 'amazon-fba').map(s => '/' + s + '/')];
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(u => '  <url><loc>https://businessvaluationcheck.com' + u + '</loc></url>').join('\n') +
    '\n</urlset>\n';
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

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const state = seoState(url.pathname, url.hostname, response.status);
    let sawCanonical = false;
    let sawRobots = false;

    return new HTMLRewriter()
      .on('link[rel="canonical"]', {
        element(el) {
          sawCanonical = true;
          el.setAttribute('href', state.canonical);
        }
      })
      .on('meta[name="robots"]', {
        element(el) {
          sawRobots = true;
          el.setAttribute('content', state.robots);
        }
      })
      .on('head', {
        element(el) {
          if (!sawCanonical) el.append('<link rel="canonical" href="' + state.canonical + '">', {html:true});
          if (!sawRobots) el.append('<meta name="robots" content="' + state.robots + '">', {html:true});
        }
      })
      .transform(response);
  }
};
