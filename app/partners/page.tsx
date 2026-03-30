import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Partners() {
  const partners = await sql(`
    SELECT p.partner_id, p.partner_name, p.white_label_brand, p.status,
           m.active_subscriptions, m.monthly_wholesale, m.monthly_retail, m.monthly_gross_margin, m.tier
    FROM product.accountant_partner p
    LEFT JOIN product.v_partner_margin_summary m USING (partner_id)
    ORDER BY p.partner_name
  `).catch(() => [])

  return (
    <>
      <h1>Partners</h1>
      <p className="sub">{partners.length} accountant partners</p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Tier</th>
            <th>Subs</th>
            <th>Wholesale</th>
            <th>Retail</th>
            <th>Margin</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((p: any) => (
            <tr key={p.partner_id}>
              <td><a href={`/partners/${p.partner_id}`} style={{color:'#60a5fa'}}>{p.partner_name}</a></td>
              <td>{p.white_label_brand}</td>
              <td><span className={`badge ${p.status === 'ACTIVE' ? 'active' : 'ready'}`}>{p.status}</span></td>
              <td className="mono">{p.tier ?? '—'}</td>
              <td>{p.active_subscriptions ?? 0}</td>
              <td>${Number(p.monthly_wholesale ?? 0).toLocaleString()}</td>
              <td>${Number(p.monthly_retail ?? 0).toLocaleString()}</td>
              <td style={{color:'#34d399', fontWeight:600}}>${Number(p.monthly_gross_margin ?? 0).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
