import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "eBay Researcher",
  description: "eBay輸出リサーチ＆仕入れ判定ツール",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <nav style={{
            position: "fixed", top: 0, left: 0, bottom: 0, width: 200,
            background: "#111", borderRight: "1px solid #2a2a2a",
            display: "flex", flexDirection: "column", zIndex: 40,
          }}>
            <div style={{ padding: "20px 16px", borderBottom: "1px solid #2a2a2a" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#f5f5f5" }}>
                eBay<span style={{ color: "#f97316" }}>Researcher</span>
              </div>
              <div style={{ fontSize: 9, color: "#525252", marginTop: 3 }}>JFP EXPORT TOOL</div>
            </div>
            <div style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
              {[
                { href: "/", label: "ジャンル分析", icon: "📊" },
                { href: "/research", label: "eBayリサーチ", icon: "🌍" },
                { href: "/sourcing", label: "仕入れリサーチ", icon: "🔍" },
                { href: "/cart", label: "仕入れカート", icon: "🛒" },
              ].map((item) => (
                <a key={item.href} href={item.href} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px", fontSize: 13, color: "#a3a3a3",
                }}>
                  <span>{item.icon}</span>{item.label}
                </a>
              ))}
            </div>
          </nav>
          <main style={{ flex: 1, marginLeft: 200, padding: "32px 36px", minHeight: "100vh" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
