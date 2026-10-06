const HOSTS = new Set([
  'calcinsider.com',
  'www.calcinsider.com',
  'calcinsider-preview.danny-340.workers.dev'
]);
const EVENTS = new Set([
  'page_view','niche_filter_used','niche_select',
  'valuation_impression','valuation_embed_loaded','valuation_embed_error',
  'valuation_interaction','ef_outbound_click',
  'scroll_25','scroll_50','scroll_75','scroll_100',
  'engaged_30s','engaged_60s','engaged_120s','engaged_300s'
]);

export async function collect(request, env) {
  const reply = status => new Response(null,{status,headers:{'cache-control':'no-store'}});
  if(request.method !== 'POST') return reply(405);
  const url = new URL(request.url);
  if(!HOSTS.has(url.hostname)) return reply(403);
  if(request.headers.get('origin') !== url.origin) return reply(403);
  if(request.headers.get('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin') return reply(403);
  if(!request.headers.get('content-type')?.startsWith('application/json')) return reply(415);
  if(Number(request.headers.get('content-length') || 0)>1024) return reply(413);

  let size=0, chunks=[];
  const reader=request.body?.getReader();
  if(!reader) return reply(400);
  while(true){
    const {done,value}=await reader.read();
    if(done) break;
    size+=value.byteLength;
    if(size>1024){ await reader.cancel(); return reply(413); }
    chunks.push(value);
  }

  const bytes=new Uint8Array(size);
  let offset=0;
  for(const chunk of chunks){ bytes.set(chunk,offset); offset+=chunk.length; }

  let data;
  try{ data=JSON.parse(new TextDecoder().decode(bytes)); }catch{ return reply(400); }
  if(!data || !EVENTS.has(data.event)) return reply(400);

  const safe = key => typeof data[key]==='string' && /^[a-zA-Z0-9_-]{1,64}$/.test(data[key]) ? data[key] : '';
  if(!env.EVENTS?.writeDataPoint) return reply(503);

  try {
    env.EVENTS.writeDataPoint({
      indexes:[url.hostname],
      blobs:[
        url.hostname,
        data.event,
        safe('category_id'),
        safe('category_slug'),
        safe('experience_version'),
        'calcinsider'
      ],
      doubles:[1]
    });
  } catch {
    return reply(503);
  }
  return reply(204);
}
