const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

export async function query(sql: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`DB error ${res.status}: ${await res.text()}`)
  return res.json()
}

export async function bridge(fn: string, payload: Record<string, unknown> = {}) {
  const res = await fetch(process.env.BRIDGE_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.BRIDGE_API_KEY!,
    },
    body: JSON.stringify({ fn: 'troy-sql-executor', route: 'sql', ...payload }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Bridge error ${res.status}`)
  return res.json()
}

export async function sql(q: string) {
  const res = await fetch(process.env.BRIDGE_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.BRIDGE_API_KEY!,
    },
    body: JSON.stringify({ fn: 'troy-sql-executor', route: 'sql', sql: q }),
    cache: 'no-store',
  })
  const d = await res.json()
  return d.rows ?? []
}
