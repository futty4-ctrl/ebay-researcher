"use client"

import { useState } from "react"

const C = {
  surface: "#111111", surfaceHigh: "#1a1a1a", surfaceHover: "#222222",
  border: "#2a2a2a", orange: "#f97316", green: "#22c55e", greenDim: "rgba(34,197,94,0.1)",
  red: "#ef4444", redDim: "rgba(239,68,68,0.1)", yellow: "#eab308", blue: "#3b82f6",
  text: "#f5f5f5", textSub: "#a3a3a3", textMuted: "#525252",
}

const USD_TO_JPY = 150

type SoldItem = { title: string; price: number; currency: string; url: string; image: string }
type Stats = { count: number; avg: number; trimmedAvg: number; median: number; min: number; max: number }

const fmtUSD = (n: number) => `$${n.toFixed(2)}`
const fmtJPY = (n: number) => `¥${Math.round(n).toLocaleString()}`

const PRESETS = [
  { label: "G-SHOCK", queries: ["G-SHOCK DW-5600", "G-SHOCK DW-6900", "G-SHOCK GA-2100", "G-SHOCK Japan limited", "G-SHOCK vintage"] },
  { label: "レトロゲーム", queries: ["Super Famicom game", "Game Boy Japanese", "Pokemon game Japanese", "Nintendo 64 Japanese", "Sega Saturn Japanese"] },
  { label: "ダイソー・文房具", queries: ["Japanese stationery lot", "Pilot pen Japan", "Uni Jetstream Japan", "Daiso Japan", "Japanese eraser cute"] },
  { label: "トミカ", queries: ["Tomica Japan limited", "Tomica car lot Japan", "Tomica vintage", "Tomica premium", "Tomica initial D"] },
  { label: "フィギュア", queries: ["Dragon Ball figure Japan", "One Piece figure prize", "Anime figure Japan lot", "Gundam figure Japan", "Demon Slayer figure"] },
  { label: "カメラレンズ", queries: ["Nikon lens vintage Japan", "Canon FD lens", "Pentax lens Japan", "Olympus lens Japan", "Minolta lens Japan"] },
  { label: "Zippo", queries: ["Zippo Japan limited", "Zippo Japanese vintage", "Zippo anime Japan"] },
  { label: "ポケモンカード", queries: ["Pokemon card Japanese", "Pokemon card vintage Japanese", "Pokemon card Japanese lot", "Pokemon card Japanese holo"] },
]

export default function ResearchPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [results, setResults] = useState<SoldItem[]>([])
  const [error, setError] = useState("")
  const [searched, setSearched] = useState("")
  const [costPrice, setCostPrice] = useState<number>(0)
  const [shippingCost, setShippingCost] = useState<number>(400)

  const ebayFeeRate = 0.13
  const payoneerFeeRate = 0.02

  const calcProfit = (sellUSD: number) => {
    const sellJPY = sellUSD * USD_TO_JPY
    return sellJPY - costPrice - shippingCost - (sellJPY * ebayFeeRate) - (sellJPY * payoneerFeeRate)
  }

  const handleSearch = async (q?: string) => {
    const keyword = q ?? query
    if (!keyword.trim()) return
    setQuery(keyword)
    setLoading(true)
    setError("")
    setStats(null)
    setResults([])
    setSearched(keyword)
    try {
      const res = await fetch(`/api/ebay-sold?q=${encodeURIComponent(keyword)}&limit=60`)
      const data = await res.json()
      if (data.error) setError(data.error)
      else { setStats(data.stats); setResults(data.results ?? []) }
    } catch { setError("検索に失敗しました") }
    setLoading(false)
  }

  const ebayURL = (q: string, sold: boolean) =>
    `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}&_sop=${sold ? 13 : 10}${sold ? "&LH_Complete=1&LH_Sold=1" : ""}&rt=nc`

  const inputStyle = {
    background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "12px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" as const,
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>eBayリサーチ</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: C.textSub }}>eBayの売り切れ相場を検索→仕入れ値入力→利益を即計算</p>
      </div>

      {/* 検索 */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="英語で検索: G-SHOCK DW-5600, Pokemon card Japanese..."
          style={{ ...inputStyle, flex: 1 }} />
        <button onClick={() => handleSearch()} disabled={loading}
          style={{ padding: "12px 28px", background: loading ? C.surfaceHigh : C.orange, border: "none", borderRadius: 8, color: loading ? C.textMuted : "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "検索中..." : "検索"}
        </button>
      </div>

      {/* プリセット */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.1em", marginBottom: 12 }}>ジャンル別クイック検索</div>
        {PRESETS.map((p) => (
          <div key={p.label} style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: C.orange, marginBottom: 6 }}>{p.label}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {p.queries.map((q) => (
                <div key={q} style={{ display: "flex", gap: 2 }}>
                  <button onClick={() => handleSearch(q)}
                    style={{ padding: "4px 10px", background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: "6px 0 0 6px", color: C.textSub, fontSize: 11, cursor: "pointer" }}>
                    {q}
                  </button>
                  <a href={ebayURL(q, true)} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "4px 8px", background: C.green + "20", border: `1px solid ${C.green}40`, color: C.green, fontSize: 9, display: "flex", alignItems: "center" }}>Sold</a>
                  <a href={ebayURL(q, false)} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "4px 8px", background: C.blue + "20", border: `1px solid ${C.blue}40`, borderRadius: "0 6px 6px 0", color: C.blue, fontSize: 9, display: "flex", alignItems: "center" }}>New</a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <div style={{ padding: 14, background: C.redDim, border: `1px solid ${C.red}40`, borderRadius: 8, color: C.red, fontSize: 13, marginBottom: 20 }}>{error}</div>}

      {stats && (
        <>
          {/* 統計 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "平均（上下10%カット）", value: fmtUSD(stats.trimmedAvg), sub: fmtJPY(stats.trimmedAvg * USD_TO_JPY), color: C.orange },
              { label: "中央値", value: fmtUSD(stats.median), sub: fmtJPY(stats.median * USD_TO_JPY), color: C.yellow },
              { label: "件数", value: `${stats.count}件`, sub: `${fmtUSD(stats.min)} 〜 ${fmtUSD(stats.max)}`, color: C.textSub },
            ].map((s) => (
              <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* 利益計算 */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 14 }}>利益計算</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 6 }}>仕入れ値（円）</div>
                <input type="number" value={costPrice || ""} onChange={(e) => setCostPrice(parseInt(e.target.value) || 0)} placeholder="例: 3000" style={{ ...inputStyle, width: "100%" }} />
              </div>
              <div>
                <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 6 }}>送料（円）</div>
                <input type="number" value={shippingCost} onChange={(e) => setShippingCost(parseInt(e.target.value) || 0)} style={{ ...inputStyle, width: "100%" }} />
              </div>
            </div>
            {costPrice > 0 && (
              <div style={{ padding: 16, background: calcProfit(stats.trimmedAvg) > 0 ? C.greenDim : C.redDim, border: `1px solid ${calcProfit(stats.trimmedAvg) > 0 ? C.green : C.red}40`, borderRadius: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>想定利益（平均）</div>
                    <div style={{ fontWeight: 800, fontSize: 24, color: calcProfit(stats.trimmedAvg) > 0 ? C.green : C.red }}>{fmtJPY(calcProfit(stats.trimmedAvg))}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>想定利益（中央値）</div>
                    <div style={{ fontWeight: 800, fontSize: 24, color: calcProfit(stats.median) > 0 ? C.green : C.red }}>{fmtJPY(calcProfit(stats.median))}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>利益率</div>
                    <div style={{ fontWeight: 800, fontSize: 24, color: C.orange }}>{Math.round((calcProfit(stats.trimmedAvg) / costPrice) * 100)}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 売り切れ一覧 */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: C.surfaceHigh, fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>売り切れ商品（{results.length}件）「{searched}」</span>
              <span style={{ display: "flex", gap: 8 }}>
                <a href={ebayURL(searched, true)} target="_blank" rel="noopener noreferrer" style={{ padding: "3px 10px", background: C.green + "20", border: `1px solid ${C.green}40`, borderRadius: 4, color: C.green, fontSize: 10 }}>Sold一覧</a>
                <a href={ebayURL(searched, false)} target="_blank" rel="noopener noreferrer" style={{ padding: "3px 10px", background: C.blue + "20", border: `1px solid ${C.blue}40`, borderRadius: 4, color: C.blue, fontSize: 10 }}>New一覧</a>
              </span>
            </div>
            {results.map((item, i) => {
              const profit = costPrice > 0 ? calcProfit(item.price) : null
              return (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", gap: 12, padding: "12px 20px", borderBottom: `1px solid ${C.border}20`, alignItems: "center", color: C.text }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  {item.image && <img src={item.image} alt="" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.orange }}>{fmtUSD(item.price)}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{fmtJPY(item.price * USD_TO_JPY)}</div>
                  </div>
                  {profit !== null && (
                    <div style={{ textAlign: "right", flexShrink: 0, minWidth: 80 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: profit > 0 ? C.green : C.red }}>{fmtJPY(profit)}</div>
                      <div style={{ fontSize: 9, color: C.textMuted }}>利益</div>
                    </div>
                  )}
                </a>
              )
            })}
          </div>
        </>
      )}

      {!stats && !loading && !error && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🌍</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>eBayで売れた商品の相場を検索</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>商品名・型番を英語で入力 or プリセットから選択</div>
        </div>
      )}
    </div>
  )
}
