"use client"

import { useState } from "react"

const C = {
  surface: "#111111", surfaceHigh: "#1a1a1a", surfaceHover: "#222222",
  border: "#2a2a2a", orange: "#f97316", green: "#22c55e",
  red: "#ef4444", yellow: "#eab308", blue: "#3b82f6",
  text: "#f5f5f5", textSub: "#a3a3a3", textMuted: "#525252",
}

type Result = { title: string; price: number; bids: number; endDate: string; url: string }
type Stats = { count: number; avg: number; trimmedAvg: number; median: number; min: number; max: number }

const fmtJPY = (n: number) => `¥${Math.round(n).toLocaleString()}`

const SOURCES = [
  { label: "ヤフオク", value: "yahoo" },
  { label: "メルカリ（手動）", value: "mercari" },
  { label: "ハードオフ オフモール（手動）", value: "offmall" },
]

const MERCARI_URL = (q: string) => `https://jp.mercari.com/search?keyword=${encodeURIComponent(q)}&status=on_sale`
const MERCARI_SOLD_URL = (q: string) => `https://jp.mercari.com/search?keyword=${encodeURIComponent(q)}&status=sold_out`
const OFFMALL_URL = (q: string) => `https://netmall.hardoff.co.jp/search/?q=${encodeURIComponent(q)}`

export default function SourcingPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [error, setError] = useState("")
  const [searched, setSearched] = useState("")

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError("")
    setStats(null)
    setResults([])
    setSearched(query)
    try {
      const params = new URLSearchParams({ q: query, limit: "50", cat: "", exclude: "ジャンク品" })
      const res = await fetch(`/api/yahoo-sold?${params}`)
      const data = await res.json()
      if (data.error) setError(data.error)
      else { setStats(data.stats); setResults(data.results ?? []) }
    } catch { setError("検索に失敗しました") }
    setLoading(false)
  }

  const inputStyle = {
    background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "12px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" as const,
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>仕入れリサーチ</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: C.textSub }}>日本国内の仕入れ先で商品がいくらで買えるか調べる</p>
      </div>

      {/* 検索 */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="日本語で検索: G-SHOCK ジャンク まとめ, スーパーファミコン ソフト..."
          style={{ ...inputStyle, flex: 1 }} />
        <button onClick={handleSearch} disabled={loading}
          style={{ padding: "12px 28px", background: loading ? C.surfaceHigh : C.blue, border: "none", borderRadius: 8, color: loading ? C.textMuted : "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "検索中..." : "ヤフオク検索"}
        </button>
      </div>

      {/* 他の仕入れ先リンク */}
      {query && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: C.textMuted, alignSelf: "center" }}>他の仕入れ先で検索:</span>
          <a href={MERCARI_URL(query)} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 12px", background: C.red + "20", border: `1px solid ${C.red}40`, borderRadius: 6, color: C.red, fontSize: 11 }}>メルカリ（出品中）</a>
          <a href={MERCARI_SOLD_URL(query)} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 12px", background: C.orange + "20", border: `1px solid ${C.orange}40`, borderRadius: 6, color: C.orange, fontSize: 11 }}>メルカリ（売切れ）</a>
          <a href={OFFMALL_URL(query)} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 12px", background: C.green + "20", border: `1px solid ${C.green}40`, borderRadius: 6, color: C.green, fontSize: 11 }}>オフモール</a>
        </div>
      )}

      {error && <div style={{ padding: 14, background: C.red + "15", border: `1px solid ${C.red}40`, borderRadius: 8, color: C.red, fontSize: 13, marginBottom: 20 }}>{error}</div>}

      {stats && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "平均落札価格", value: fmtJPY(stats.trimmedAvg), color: C.blue },
              { label: "中央値", value: fmtJPY(stats.median), color: C.yellow },
              { label: "件数", value: `${stats.count}件`, sub: `${fmtJPY(stats.min)} 〜 ${fmtJPY(stats.max)}`, color: C.textSub },
            ].map((s) => (
              <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: s.color }}>{s.value}</div>
                {"sub" in s && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{s.sub}</div>}
              </div>
            ))}
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: C.surfaceHigh, fontSize: 13, fontWeight: 600 }}>
              ヤフオク落札結果（{results.length}件）「{searched}」
            </div>
            {results.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${C.border}20`, color: C.text, alignItems: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ flex: 1, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 12 }}>{item.title}</div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.blue }}>{fmtJPY(item.price)}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{item.bids}入札 / {item.endDate}</div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {!stats && !loading && !error && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🔍</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>仕入れ先の相場を検索</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>ヤフオクの落札相場を自動取得。メルカリ・オフモールはリンクで飛べます</div>
        </div>
      )}
    </div>
  )
}
