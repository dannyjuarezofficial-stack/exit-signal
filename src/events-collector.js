const HOSTS = new Set(['getexitsignal.com','www.getexitsignal.com','businessvaluationcheck.com','www.businessvaluationcheck.com','calcinsider.com','www.calcinsider.com']);
const SITE_IDS = new Map([['getexitsignal.com','exit_signal'],['www.getexitsignal.com','exit_signal'],['businessvaluationcheck.com','business_valuation_check'],['www.businessvaluationcheck.com','business_valuation_check'],['calcinsider.com','calcinsider'],['www.calcinsider.com','calcinsider']]);
const EVENTS = new Set(['page_view','quiz_start','quiz_complete','result_type','valuation_open','valuation_result_visible','valuation_impression','valuation_embed_loaded','valuation_embed_error','valuation_interaction','ef_outbound_click','scroll_25','scroll_50','scroll_75','scroll_100','engaged_30s','engaged_60s','engaged_120s','engaged_300s']);
const POSTHOG_KEY = 'phc_m96hVU38JcMp2UACzAwcns6RZB6PHqMZ8kwZKRuQSQry';
const POSTHOG_HOST = 'https://us.i.posthog.com/capture/';

async function forwardPostHog(event, siteId, dimensions={}) {
  const props = {
    distinct_id: siteId,
    $process_person_profile: false,
    $geoip_disable: true,
    site_id: siteId,
    source: 'cloudflare_aggregate'
  };
  for (const [key,value] of Object.entries(dimensions)) {
    if (value) props[key]=value;
  }
  try {
    await fetch(POSTHOG_HOST,{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({api_key:POSTHOG_KEY,event,properties:props})
    });
  } catch {}
}

export async function collect(request, env, ctx) {
  const reply = status => new Response(null,{status,headers:{'cache-control':'no-store'}});
  if(request.method !== 'POST') return reply(405);
  const url = new URL(request.url);
  if(!HOSTS.has(url.hostname)) return reply(403);
  if(request.headers.get('origin') !== url.origin) return reply(403);
  if(request.headers.get('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin') return reply(403);
  if(!request.headers.get('content-type')?.startsWith('application/json')) return reply(415);
  // Stream the body with a hard bound, including requests without Content-Length.
  if(Number(request.headers.get('content-length') || 0)>1024) return reply(413);
  let size=0, chunks=[];
  const reader=request.body?.getReader();
  if(!reader) return reply(400);
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1024){await reader.cancel();return reply(413);}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  let data;try{data=JSON.parse(new TextDecoder().decode(bytes));}catch{return reply(400);}
  if(!data || !EVENTS.has(data.event)) return reply(400);
  const safe = key => typeof data[key]==='string' && /^[a-zA-Z0-9_-]{1,64}$/.test(data[key]) ? data[key] : '';
  // Never store raw URLs, IPs, cookies, referrers, answers, financial inputs or free text.
  if(!env.EVENTS?.writeDataPoint) return reply(503);
  const siteId=SITE_IDS.get(url.hostname)||'business_valuation_check';
  const dimensions={
    category_id:safe('category_id'),
    category_slug:safe('category_slug'),
    experience_version:safe('experience_version'),
    source_channel:safe('source_channel'),
    source_platform:safe('source_platform'),
    campaign_id:safe('campaign_id')
  };
  try {
    env.EVENTS.writeDataPoint({indexes:[url.hostname],blobs:[url.hostname,data.event,dimensions.category_id,dimensions.category_slug,dimensions.experience_version,siteId,'',dimensions.source_channel,dimensions.source_platform,dimensions.campaign_id],doubles:[1]});
  } catch {return reply(503);}
  ctx?.waitUntil(forwardPostHog(data.event,siteId,dimensions));
  return reply(204);
}
