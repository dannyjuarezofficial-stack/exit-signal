const DATASET = 'events.analyticsEngine."exit_signal_events"';

function utcDay(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

function addUtcDays(day, delta) {
  const d = new Date(day + 'T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

async function ensureSchema(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS daily_event_aggregates (
      day TEXT NOT NULL,
      site TEXT NOT NULL,
      event TEXT NOT NULL,
      category_id TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      experience_version TEXT NOT NULL,
      event_count INTEGER NOT NULL,
      archived_at TEXT NOT NULL,
      PRIMARY KEY (day, site, event, category_id, category_slug, experience_version)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS report_runs (
      day TEXT PRIMARY KEY,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      status TEXT NOT NULL,
      rows_archived INTEGER NOT NULL DEFAULT 0,
      error TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS weekly_reports (
      week_end TEXT PRIMARY KEY,
      generated_at TEXT NOT NULL,
      report_json TEXT NOT NULL
    )`)
  ]);
}

async function archiveDay(env, day) {
  if (!env.ANALYTICS_SQL?.query) throw new Error('ANALYTICS_SQL binding missing');
  if (!env.REPORT_DB?.prepare) throw new Error('REPORT_DB binding missing');

  await ensureSchema(env.REPORT_DB);
  const prior = await env.REPORT_DB
    .prepare('SELECT status FROM report_runs WHERE day = ?1')
    .bind(day)
    .first();
  if (prior?.status === 'complete') return { day, skipped: true, rows: 0 };

  const startedAt = new Date().toISOString();
  await env.REPORT_DB
    .prepare(`INSERT INTO report_runs(day, started_at, completed_at, status, rows_archived, error)
              VALUES(?1, ?2, NULL, 'running', 0, NULL)
              ON CONFLICT(day) DO UPDATE SET
                started_at=excluded.started_at,
                completed_at=NULL,
                status='running',
                rows_archived=0,
                error=NULL`)
    .bind(day, startedAt)
    .run();

  const start = day + 'T00:00:00.000Z';
  const end = addUtcDays(day, 1) + 'T00:00:00.000Z';

  try {
    const result = await env.ANALYTICS_SQL.query({
      query: `
        SELECT
          blob1 AS site,
          blob2 AS event,
          blob3 AS category_id,
          blob4 AS category_slug,
          blob5 AS experience_version,
          SUM(_sample_interval * double1) AS event_count
        FROM ${DATASET}
        WHERE timestamp >= $start AND timestamp < $end
        GROUP BY site, event, category_id, category_slug, experience_version
        ORDER BY site, event, category_id
      `,
      params: { start, end }
    });

    const archivedAt = new Date().toISOString();
    const rows = Array.isArray(result?.data) ? result.data : [];
    const writes = rows.map(row =>
      env.REPORT_DB.prepare(`
        INSERT INTO daily_event_aggregates(
          day, site, event, category_id, category_slug, experience_version, event_count, archived_at
        ) VALUES(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
        ON CONFLICT(day, site, event, category_id, category_slug, experience_version)
        DO UPDATE SET event_count=excluded.event_count, archived_at=excluded.archived_at
      `).bind(
        day,
        String(row.site || ''),
        String(row.event || ''),
        String(row.category_id || ''),
        String(row.category_slug || ''),
        String(row.experience_version || ''),
        Number(row.event_count || 0),
        archivedAt
      )
    );

    if (writes.length) await env.REPORT_DB.batch(writes);

    await env.REPORT_DB
      .prepare(`UPDATE report_runs
                SET completed_at=?2, status='complete', rows_archived=?3, error=NULL
                WHERE day=?1`)
      .bind(day, archivedAt, rows.length)
      .run();

    return { day, skipped: false, rows: rows.length };
  } catch (error) {
    const message = String(error?.message || error).slice(0, 500);
    await env.REPORT_DB
      .prepare(`UPDATE report_runs
                SET completed_at=?2, status='error', error=?3
                WHERE day=?1`)
      .bind(day, new Date().toISOString(), message)
      .run();
    throw error;
  }
}

export async function runDailyArchive(env, scheduledTime = Date.now()) {
  const today = utcDay(scheduledTime);
  const results = [];
  for (let daysAgo = 7; daysAgo >= 1; daysAgo--) {
    results.push(await archiveDay(env, addUtcDays(today, -daysAgo)));
  }
  return results;
}

export async function runWeeklyReport(env, scheduledTime = Date.now()) {
  if (!env.REPORT_DB?.prepare) throw new Error('REPORT_DB binding missing');
  await ensureSchema(env.REPORT_DB);

  const today = utcDay(scheduledTime);
  const weekEnd = addUtcDays(today, -1);
  const weekStart = addUtcDays(weekEnd, -6);

  const result = await env.REPORT_DB.prepare(`
    SELECT
      site,
      event,
      category_id,
      category_slug,
      SUM(event_count) AS event_count
    FROM daily_event_aggregates
    WHERE day >= ?1 AND day <= ?2
    GROUP BY site, event, category_id, category_slug
    ORDER BY site, event, event_count DESC
  `).bind(weekStart, weekEnd).all();

  const report = {
    week_start: weekStart,
    week_end: weekEnd,
    generated_at: new Date().toISOString(),
    rows: Array.isArray(result?.results) ? result.results : []
  };

  await env.REPORT_DB.prepare(`
    INSERT INTO weekly_reports(week_end, generated_at, report_json)
    VALUES(?1, ?2, ?3)
    ON CONFLICT(week_end) DO UPDATE SET
      generated_at=excluded.generated_at,
      report_json=excluded.report_json
  `).bind(weekEnd, report.generated_at, JSON.stringify(report)).run();

  return report;
}
