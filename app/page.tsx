"use client"

import { useState } from "react"

const C = {
  surface: "#111111",
  surfaceHigh: "#1a1a1a",
  border: "#2a2a2a",
  orange: "#f97316",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  blue: "#3b82f6",
  text: "#f5f5f5",
  textSub: "#a3a3a3",
  textMuted: "#525252",
}

type Genre = {
  name: string
  rank: "S" | "A" | "B" | "C"
  demand: "◎" | "○" | "△" | "×"
  competition: "◎" | "○" | "△" | "×"
  profitRate: "◎" | "○" | "△" | "×"
  sourcing: "◎" | "○" | "△" | "×"
  shipping: "◎" | "○" | "△" | "×"
  trouble: "◎" | "○" | "△" | "×"
  repeat: "◎" | "○" | "△" | "×"
  avgProfit: number
  avgCost: number
  keywords: string[]
  memo: string
}

const GENRES: Genre[] = [
  {
    name: "G-SHOCK",
    rank: "S",
    demand: "◎", competition: "○", profitRate: "◎", sourcing: "◎", shipping: "○", trouble: "◎", repeat: "◎",
    avgProfit: 5000, avgCost: 2000,
    keywords: ["G-SHOCK DW-5600", "G-SHOCK DW-6900", "G-SHOCK GA-2100", "G-SHOCK Japan limited", "G-SHOCK vintage"],
    memo: "型番で即査定。電池交換だけで動くジャンクが狙い目。偽物リスクほぼゼロ。",
  },
  {
    name: "レトロゲーム",
    rank: "A",
    demand: "◎", competition: "△", profitRate: "○", sourcing: "◎", shipping: "◎", trouble: "◎", repeat: "○",
    avgProfit: 1500, avgCost: 300,
    keywords: ["Super Famicom game", "Game Boy Japanese", "Pokemon game Japanese", "Nintendo 64 Japanese", "Sega Saturn Japanese"],
    memo: "タイトル名で検索。SFC・GB・GBAが狙い目。日本版は海外コレクターに人気。",
  },
  {
    name: "ダイソー商品",
    rank: "A",
    demand: "○", competition: "○", profitRate: "△", sourcing: "◎", shipping: "◎", trouble: "◎", repeat: "◎",
    avgProfit: 700, avgCost: 110,
    keywords: ["Japanese stationery lot", "Pilot pen Japan", "Uni Jetstream Japan", "Daiso Japan", "Japanese eraser"],
    memo: "仕入れ最安。文房具・和柄・トミカ。利益薄いが数で稼ぐ。",
  },
  {
    name: "トミカ",
    rank: "A",
    demand: "○", competition: "○", profitRate: "○", sourcing: "◎", shipping: "◎", trouble: "◎", repeat: "◎",
    avgProfit: 1200, avgCost: 200,
    keywords: ["Tomica Japan limited", "Tomica car lot Japan", "Tomica vintage", "Tomica premium", "Tomica initial D"],
    memo: "日本限定モデルが海外で人気。ダイソーと同時仕入れ可。軽くて壊れない。",
  },
  {
    name: "フィギュア",
    rank: "B",
    demand: "◎", competition: "△", profitRate: "◎", sourcing: "○", shipping: "△", trouble: "○", repeat: "△",
    avgProfit: 2500, avgCost: 500,
    keywords: ["Dragon Ball figure Japan", "One Piece figure prize", "Anime figure Japan lot", "Gundam figure Japan", "Demon Slayer figure"],
    memo: "利益高いが送料注意。箱なしプライズ品がブックオフで安い。",
  },
  {
    name: "カメラレンズ",
    rank: "B",
    demand: "◎", competition: "△", profitRate: "◎", sourcing: "○", shipping: "△", trouble: "△", repeat: "○",
    avgProfit: 8000, avgCost: 5000,
    keywords: ["Nikon lens vintage Japan", "Canon FD lens", "Pentax lens Japan", "Olympus lens Japan", "Minolta lens Japan"],
    memo: "利益最高だが目利き必要。カビ・クモリの判定スキルが必要。Phase 2で参入。",
  },
]

const rankColor: Record<string, string> = { S: C.orange, A: C.green, B: C.blue, C: C.textMuted }
const evalColor = (v: string) => v === "◎" ? C.green : v === "○" ? C.blue : v === "△" ? C.yellow : C.red

export default function GenreDashboard() {
  const [selected, setSelected] = useState<Genre | null>(null)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>
          ジャンル分析
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: C.textSub }}>
          各ジャンルの需要・競合・利益率を評価。S→Aの順で参入推奨。
        </p>
      </div>

      {/* ジャンルカード一覧 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 24 }}>
        {GENRES.map((g) => (
          <div
            key={g.name}
            onClick={() => setSelected(selected?.name === g.name ? null : g)}
            style={{
              background: selected?.name === g.name ? C.surfaceHigh : C.surface,
              border: `1px solid ${selected?.name === g.name ? rankColor[g.rank] : C.border}`,
              borderRadius: 10,
              padding: 18,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{g.name}</span>
              <span style={{
                padding: "2px 12px", borderRadius: 12,
                background: rankColor[g.rank] + "20",
                color: rankColor[g.rank],
                fontWeight: 800, fontSize: 14,
              }}>
                {g.rank}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {[
                ["需要", g.demand], ["競合", g.competition], ["利益率", g.profitRate],
                ["仕入れ", g.sourcing], ["送料", g.shipping], ["安全性", g.trouble], ["リピート", g.repeat],
              ].map(([label, val]) => (
                <span key={label as string} style={{ fontSize: 11, color: evalColor(val as string) }}>
                  {label}{val}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: C.textMuted }}>平均仕入: ¥{g.avgCost.toLocaleString()}</span>
              <span style={{ color: C.green, fontWeight: 700 }}>平均利益: ¥{g.avgProfit.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 選択したジャンルの詳細 */}
      {selected && (
        <div style={{ background: C.surface, border: `1px solid ${rankColor[selected.rank]}40`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 18 }}>{selected.name}</span>
              <span style={{ marginLeft: 10, padding: "2px 12px", borderRadius: 12, background: rankColor[selected.rank] + "20", color: rankColor[selected.rank], fontWeight: 800, fontSize: 14 }}>
                {selected.rank}ランク
              </span>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              利益率: {Math.round((selected.avgProfit / selected.avgCost) * 100)}%
            </div>
          </div>

          <div style={{ fontSize: 13, color: C.textSub, marginBottom: 16, lineHeight: 1.6 }}>
            {selected.memo}
          </div>

          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>検索キーワード</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {selected.keywords.map((kw) => (
              <a
                key={kw}
                href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(kw)}&_sop=13&LH_Complete=1&LH_Sold=1`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "5px 12px", borderRadius: 6,
                  background: C.surfaceHigh, border: `1px solid ${C.border}`,
                  fontSize: 12, color: C.textSub,
                }}
              >
                {kw} →
              </a>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div style={{ background: C.surfaceHigh, borderRadius: 8, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 6 }}>平均仕入れ</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: C.text }}>¥{selected.avgCost.toLocaleString()}</div>
            </div>
            <div style={{ background: C.surfaceHigh, borderRadius: 8, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 6 }}>平均利益</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: C.green }}>¥{selected.avgProfit.toLocaleString()}</div>
            </div>
            <div style={{ background: C.surfaceHigh, borderRadius: 8, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 6 }}>月100個で</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: C.orange }}>¥{(selected.avgProfit * 100).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
