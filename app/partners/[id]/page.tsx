import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function PartnerDetail({ params }: { params: { id: string } }) {
  const id = params.id
  const [partner] = await sql(`
    SELECT * FROM product.v_partner_margin_summary WHERE partner_id='${id}'
  `).catch(() => [null])

  const clients = await sql(`
    SELECT s.subscription_id, s.pack_id, s.status, s.created_at,
           p.pack_name, p.pack_code, p.recommended_retail_price
    FROM product.client_subscription s
    LEFT JOIN product.ai_pack_catalog p USING (pack_id)
    WHERE s.partner_id='${id}'
    ORDER BY s.created_at DESC
  `).catch(() => [])

  const artifacts = await sql(`
    SELECT artifact_id, artifact_type, artifact_title, evidence_level, created_at
    FROM audit.generated_artifact
    WHERE partner_id='${id}'
    ORDER BY created_at DESC LIMIT 20
  `).catch(() => [])

  if (!partner) return <p className="err">Partner not found</p>

  return (
    <>
      <h1>{partner.partner_name}</h1>
      <p className="sub">{partner.white_label_brand} · {partner.tier}</p>

      <div className="grid">
        <div className="card"><div className="label">Subscriptions</div><div className="value">{partner.active_subscriptions}</div></div>
        <div className="card"><div className="label">Monthly Wholesale</div><div className="value blue">${Number(partner.monthly_wholesale ?? 0).toLocaleString()}</div></div>
        <div className="card"><div className="label">Monthly Retail</div><div className="value">${Number(partner.monthly_retail ?? 0).toLocaleString()}</div></div>
        <div className="card"><div className="label">Monthly Margin</div><div className="value green">${Number(partner.monthly_gross_margin ?? 0).toLocaleString()}</div></div>
      </div>

      <div className="section-title">Clients ({clients.length})</div>
      {clients.length > 0 ? (
        <table>
          <thead><tr><th>Pack</th><th>Code</th><th>Status</th><th>Retail</th><th>Since</th></tr></thead>
          <tbody>
            {clients.map((c: any) => (
              <tr key={c.subscription_id}>
                <td>{c.pack_name ?? '—'}</td>
                <td className="mono">{c.pack_code}</td>
                <td><span className={`badge ${c.status === 'ACTIVE' ? 'active' : 'ready'}`}>{c.status}</span></td>
                <td>${Number(c.recommended_retail_price ?? 0).toLocaleString()}</td>
                <td className="mono">{c.created_at ? new Date(c.created_at).toLocaleDateString('en-AU') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="err">No clients</p>}

      <div className="section-title">Recent Artifacts ({artifacts.length})</div>
      {artifacts.length > 0 ? (
        <table>
          <thead><tr><th>Type</th><th>Title</th><th>Evidence</th><th>Created</th></tr></thead>
          <tbody>
            {artifacts.map((a: any) => (
              <tr key={a.artifact_id}>
                <td><span className="badge system">{a.artifact_type?.replace(/_/g,' ')}</span></td>
                <td>{a.artifact_title}</td>
                <td><span className="badge active">{a.evidence_level}</span></td>
                <td className="mono">{new Date(a.created_at).toLocaleString('en-AU',{hour12:false})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="err">No artifacts</p>}
    </>
  )
}
