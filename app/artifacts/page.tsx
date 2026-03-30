import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Artifacts() {
  const artifacts = await sql(`
    SELECT artifact_id, artifact_type, artifact_title,
           partner_name, white_label_brand, evidence_level, created_at
    FROM audit.v_partner_artifact_feed
    ORDER BY created_at DESC
    LIMIT 100
  `).catch(() => [])

  const counts = await sql(`
    SELECT artifact_type, COUNT(*) as n
    FROM audit.generated_artifact
    GROUP BY artifact_type ORDER BY n DESC
  `).catch(() => [])

  return (
    <>
      <h1>Artifact Feed</h1>
      <p className="sub">{artifacts.length} artifacts shown · ordered by recency</p>

      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))'}}>
        {counts.map((c: any) => (
          <div key={c.artifact_type} className="card">
            <div className="label">{c.artifact_type?.replace(/_/g,' ')}</div>
            <div className="value purple">{c.n}</div>
          </div>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Partner</th>
            <th>Evidence</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {artifacts.map((a: any) => (
            <tr key={a.artifact_id}>
              <td><span className="badge system">{a.artifact_type?.replace(/_/g,' ')}</span></td>
              <td style={{maxWidth:'280px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{a.artifact_title ?? '—'}</td>
              <td>{a.partner_name ?? '—'}</td>
              <td><span className="badge active">{a.evidence_level}</span></td>
              <td className="mono">{new Date(a.created_at).toLocaleString('en-AU',{hour12:false})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
