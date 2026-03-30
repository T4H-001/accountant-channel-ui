import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const [stats] = await sql(`
    SELECT
      (SELECT COUNT(*) FROM product.accountant_partner WHERE status='ACTIVE') AS partners,
      (SELECT COUNT(*) FROM product.ai_pack_catalog WHERE status='ACTIVE') AS packs,
      (SELECT COUNT(*) FROM product.client_subscription) AS subscriptions,
      (SELECT COUNT(*) FROM audit.generated_artifact) AS artifacts,
      (SELECT COALESCE(SUM(monthly_gross_margin),0) FROM product.v_partner_margin_summary) AS total_margin
  `).catch(() => [{}])

  const partners = await sql(`
    SELECT partner_id, partner_name, white_label_brand,
           monthly_wholesale, monthly_retail, monthly_gross_margin, active_subscriptions
    FROM product.v_partner_margin_summary
    ORDER BY monthly_gross_margin DESC
  `).catch(() => [])

  const recentArtifacts = await sql(`
    SELECT artifact_type, partner_name, white_label_brand, evidence_level, created_at
    FROM audit.v_partner_artifact_feed
    ORDER BY created_at DESC LIMIT 8
  `).catch(() => [])

  return (
    <>
      <h1>Accountant Channel</h1>
      <p className="sub">Wave 6 · Partner intelligence platform</p>

      <div className="grid">
        <div className="card">
          <div className="label">Active Partners</div>
          <div className="value blue">{stats?.partners ?? '—'}</div>
        </div>
        <div className="card">
          <div className="label">AI Packs</div>
          <div className="value purple">{stats?.packs ?? '—'}</div>
        </div>
        <div className="card">
          <div className="label">Subscriptions</div>
          <div className="value">{stats?.subscriptions ?? '—'}</div>
        </div>
        <div className="card">
          <div className="label">Artifacts Generated</div>
          <div className="value green">{stats?.artifacts ?? '—'}</div>
        </div>
        <div className="card">
          <div className="label">Monthly Gross Margin</div>
          <div className="value green">
            ${Number(stats?.total_margin ?? 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="section-title">Partner Performance</div>
      {partners.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Partner</th>
              <th>Brand</th>
              <th>Subscriptions</th>
              <th>Wholesale / mo</th>
              <th>Retail / mo</th>
              <th>Margin / mo</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p: any) => (
              <tr key={p.partner_id}>
                <td><a href={`/partners/${p.partner_id}`} style={{color:'#60a5fa'}}>{p.partner_name}</a></td>
                <td>{p.white_label_brand}</td>
                <td>{p.active_subscriptions}</td>
                <td>${Number(p.monthly_wholesale ?? 0).toLocaleString()}</td>
                <td>${Number(p.monthly_retail ?? 0).toLocaleString()}</td>
                <td style={{color:'#34d399', fontWeight:600}}>${Number(p.monthly_gross_margin ?? 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="err">No partner data</p>}

      <div className="section-title">Recent Artifacts</div>
      {recentArtifacts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Partner</th>
              <th>Brand</th>
              <th>Evidence</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {recentArtifacts.map((a: any, i: number) => (
              <tr key={i}>
                <td><span className="badge system">{a.artifact_type?.replace(/_/g,' ')}</span></td>
                <td>{a.partner_name}</td>
                <td className="mono">{a.white_label_brand}</td>
                <td><span className="badge active">{a.evidence_level}</span></td>
                <td className="mono">{new Date(a.created_at).toLocaleString('en-AU',{hour12:false})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="err">No artifacts yet</p>}
    </>
  )
}
