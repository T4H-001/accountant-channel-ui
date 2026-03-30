import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Packs() {
  const packs = await sql(`
    SELECT pack_id, pack_code, pack_name, business_key, description,
           wholesale_price, recommended_retail_price, wave_min, wave_target,
           deployment_stage, status
    FROM product.v_pack_catalog_live
    ORDER BY pack_code
  `).catch(() => [])

  return (
    <>
      <h1>AI Pack Catalog</h1>
      <p className="sub">{packs.length} packs available</p>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Business</th>
            <th>Status</th>
            <th>Stage</th>
            <th>Wholesale</th>
            <th>Retail</th>
            <th>Wave min → target</th>
          </tr>
        </thead>
        <tbody>
          {packs.map((p: any) => (
            <tr key={p.pack_id}>
              <td className="mono" style={{color:'#a78bfa'}}>{p.pack_code}</td>
              <td style={{fontWeight:500}}>{p.pack_name}</td>
              <td className="mono">{p.business_key}</td>
              <td><span className={`badge ${p.status === 'ACTIVE' ? 'active' : 'ready'}`}>{p.status}</span></td>
              <td><span className="badge ready">{p.deployment_stage}</span></td>
              <td>${Number(p.wholesale_price ?? 0)}/mo</td>
              <td style={{color:'#34d399'}}>${Number(p.recommended_retail_price ?? 0)}/mo</td>
              <td className="mono">{p.wave_min} → {p.wave_target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
