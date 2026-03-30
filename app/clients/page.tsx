import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Clients() {
  const clients = await sql(`
    SELECT s.subscription_id, s.status, s.created_at,
           p.partner_name, p.white_label_brand,
           pk.pack_name, pk.pack_code, pk.wholesale_price, pk.recommended_retail_price
    FROM product.client_subscription s
    LEFT JOIN product.accountant_partner p USING (partner_id)
    LEFT JOIN product.ai_pack_catalog pk USING (pack_id)
    ORDER BY s.created_at DESC
    LIMIT 100
  `).catch(() => [])

  return (
    <>
      <h1>Client Subscriptions</h1>
      <p className="sub">{clients.length} subscriptions</p>
      <table>
        <thead>
          <tr>
            <th>Pack</th>
            <th>Partner</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Wholesale</th>
            <th>Retail</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c: any) => (
            <tr key={c.subscription_id}>
              <td><span style={{color:'#a78bfa', fontFamily:'monospace', fontSize:'12px'}}>{c.pack_code}</span> {c.pack_name}</td>
              <td>{c.partner_name}</td>
              <td className="mono">{c.white_label_brand}</td>
              <td><span className={`badge ${c.status === 'ACTIVE' ? 'active' : 'ready'}`}>{c.status}</span></td>
              <td>${Number(c.wholesale_price ?? 0)}/mo</td>
              <td style={{color:'#34d399'}}>${Number(c.recommended_retail_price ?? 0)}/mo</td>
              <td className="mono">{c.created_at ? new Date(c.created_at).toLocaleDateString('en-AU') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
