"use client"

import { useState } from "react"

const C = {
  surface: "#111111", surfaceHigh: "#1a1a1a",
  border: "#2a2a2a", orange: "#f97316", green: "#22c55e",
  red: "#ef4444", blue: "#3b82f6", text: "#f5f5f5",
  textSub: "#a3a3a3", textMuted: "#525252",
}

type CartItem = {
  id: string
  name: string
  genre: string
  costPrice: number
  ebayPrice: number
  shipping: number
  memo: string
}

const fmtJPY = (n: number) => `¥${Math.round(n).toLocaleString()}`
const GENRES = ["G-SHOCK", "レトロゲーム", "ダイソー", "トミカ", "フィギュア", "カメラレンズ", "Zippo", "トレカ", "その他"]

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [name, setName] = useState("")
  const [genre, setGenre] = useState("G-SHOCK")
  const [costPrice, setCostPrice] = useState<number>(0)
  const [ebayPrice, setEbayPrice] = useState<number>(0)
  const [shipping, setShipping] = useState<number>(400)
  const [memo, setMemo] = useState("")

  const ebayFeeRate = 0.13
  const payoneerFeeRate = 0.02

  const calcProfit = (item: CartItem) => {
    const fees = item.ebayPrice * (ebayFeeRate + payoneerFeeRate)
    return item.ebayPrice - item.costPrice - item.shipping - fees
  }

  const addToCart = () => {
    if (!name || !costPrice) return
    setCart([...cart, { id: Date.now().toString(), name, genre, costPrice, ebayPrice, shipping, memo }])
    setName("")
    setCostPrice(0)
    setEbayPrice(0)
    setMemo("")
  }

  const totalCost = cart.reduce((s, c) => s + c.costPrice + c.shipping, 0)
  const totalProfit = cart.reduce((s, c) => s + calcProfit(c), 0)

  const inputStyle = {
    background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "10px 12px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" as const, width: "100%",
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>仕入れカート</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: C.textSub }}>今日仕入れる候補をリストアップ→合計仕入れ額・想定利益を管理</p>
      </div>

      {/* 追加フォーム */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 12 }}>仕入れ候補を追加</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>商品名・型番</div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="G-SHOCK DW-5600E" style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>ジャンル</div>
            <select value={genre} onChange={(e) => setGenre(e.target.value)} style={inputStyle}>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>仕入れ値（円）</div>
            <input type="number" value={costPrice || ""} onChange={(e) => setCostPrice(parseInt(e.target.value) || 0)} placeholder="2000" style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>eBay想定売値（円）</div>
            <input type="number" value={ebayPrice || ""} onChange={(e) => setEbayPrice(parseInt(e.target.value) || 0)} placeholder="7500" style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>送料（円）</div>
            <input type="number" value={shipping} onChange={(e) => setShipping(parseInt(e.target.value) || 0)} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>メモ</div>
          <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="ハードオフ門真で発見" style={inputStyle} />
        </div>
        <button onClick={addToCart}
          style={{ width: "100%", padding: 12, background: C.blue, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          カートに追加
        </button>
      </div>

      {/* カート一覧 */}
      {cart.length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.blue}40`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.blue }}>仕入れ候補（{cart.length}個）</span>
            <button onClick={() => { if (confirm("カートをクリアしますか？")) setCart([]) }}
              style={{ padding: "4px 12px", background: "none", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textSub, fontSize: 11, cursor: "pointer" }}>
              クリア
            </button>
          </div>

          {cart.map((item, i) => {
            const profit = calcProfit(item)
            return (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < cart.length - 1 ? `1px solid ${C.border}20` : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{item.genre}{item.memo ? ` / ${item.memo}` : ""}</div>
                </div>
                <div style={{ textAlign: "right", marginRight: 12 }}>
                  <div style={{ fontSize: 10, color: C.textMuted }}>仕入れ</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{fmtJPY(item.costPrice)}</div>
                </div>
                <div style={{ textAlign: "right", marginRight: 12 }}>
                  <div style={{ fontSize: 10, color: C.textMuted }}>売値</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.orange }}>{fmtJPY(item.ebayPrice)}</div>
                </div>
                <div style={{ textAlign: "right", marginRight: 12 }}>
                  <div style={{ fontSize: 10, color: C.textMuted }}>利益</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: profit > 0 ? C.green : C.red }}>{fmtJPY(profit)}</div>
                </div>
                <button onClick={() => setCart(cart.filter((c) => c.id !== item.id))}
                  style={{ padding: "4px 8px", background: "none", border: `1px solid ${C.red}40`, borderRadius: 4, color: C.red, fontSize: 11, cursor: "pointer" }}>
                  ✕
                </button>
              </div>
            )
          })}

          {/* 概算サマリー */}
          <div style={{ marginTop: 12, padding: 14, background: C.surfaceHigh, borderRadius: 8, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>合計仕入れ</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{fmtJPY(totalCost)}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>合計想定利益</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: totalProfit > 0 ? C.green : C.red }}>{fmtJPY(totalProfit)}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>平均利益/個</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: C.orange }}>{fmtJPY(Math.round(totalProfit / cart.length))}</div>
            </div>
          </div>
        </div>
      )}

      {cart.length === 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🛒</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>仕入れ候補を追加してください</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>eBayリサーチで見つけた商品をカートに追加→仕入れの概算を管理</div>
        </div>
      )}
    </div>
  )
}
