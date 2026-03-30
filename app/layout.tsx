import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accountant Channel',
  description: 'T4H Accountant Partner Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f1117; color: #e2e8f0; min-height: 100vh; }
          a { color: inherit; text-decoration: none; }
          nav { background: #1a1f2e; border-bottom: 1px solid #2d3748; padding: 0 24px; display: flex; align-items: center; gap: 32px; height: 56px; }
          nav .logo { font-weight: 700; font-size: 15px; color: #fff; letter-spacing: -0.3px; }
          nav .logo span { color: #6366f1; }
          nav a { font-size: 13px; color: #94a3b8; font-weight: 500; padding: 6px 0; border-bottom: 2px solid transparent; transition: color .15s; }
          nav a:hover { color: #e2e8f0; }
          main { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }
          h1 { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
          .sub { font-size: 13px; color: #64748b; margin-bottom: 28px; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
          .card { background: #1a1f2e; border: 1px solid #2d3748; border-radius: 10px; padding: 20px; }
          .card .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .8px; color: #64748b; margin-bottom: 8px; }
          .card .value { font-size: 28px; font-weight: 700; color: #fff; }
          .card .value.green { color: #34d399; }
          .card .value.blue { color: #60a5fa; }
          .card .value.purple { color: #a78bfa; }
          table { width: 100%; border-collapse: collapse; background: #1a1f2e; border: 1px solid #2d3748; border-radius: 10px; overflow: hidden; font-size: 13px; }
          th { background: #161b27; padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .6px; color: #64748b; border-bottom: 1px solid #2d3748; }
          td { padding: 11px 16px; border-bottom: 1px solid #1e2535; color: #cbd5e1; vertical-align: middle; }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: #1e2535; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .4px; }
          .badge.active { background: #064e3b; color: #34d399; }
          .badge.ready { background: #1e3a5f; color: #60a5fa; }
          .badge.system { background: #2d1b69; color: #a78bfa; }
          .badge.generated { background: #1a2e1a; color: #86efac; }
          .section-title { font-size: 14px; font-weight: 600; color: #e2e8f0; margin: 28px 0 14px; }
          .mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px; color: #94a3b8; }
          .err { color: #f87171; font-size: 13px; padding: 20px; }
        `}</style>
      </head>
      <body>
        <nav>
          <div className="logo">Accountant <span>Channel</span></div>
          <a href="/">Dashboard</a>
          <a href="/partners">Partners</a>
          <a href="/packs">Packs</a>
          <a href="/clients">Clients</a>
          <a href="/artifacts">Artifacts</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
