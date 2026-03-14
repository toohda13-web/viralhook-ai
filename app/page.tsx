"use client";

import { useState, useEffect, useRef } from "react";

// ── Palette & theme ──────────────────────────────────────────────────────────
const NEON = "#00FFB2";
const NEON2 = "#FF3DFF";
const BG = "#080B14";
const CARD = "#0E1220";
const BORDER = "#1A2236";
const TEXT = "#E8EDF8";
const MUTED = "#5A6580";

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "gaming", label: "🎮 Gaming", color: "#7C3AED" },
  { id: "storytime", label: "📖 Storytime", color: "#DB2777" },
  { id: "business", label: "💼 Business", color: "#0EA5E9" },
  { id: "lifestyle", label: "✨ Lifestyle", color: "#10B981" },
];

const PLATFORMS = [
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube Shorts" },
  { id: "reels", label: "Reels" },
];

// ── Fonts via @import ────────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${BG};
    color: ${TEXT};
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .syne { font-family: 'Syne', sans-serif; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${BG}; }
  ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 4px; }

  /* noise overlay */
  .noise::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9999; opacity: .6;
  }

  /* nav */
  .nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px;
    background: rgba(8,11,20,.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid ${BORDER};
  }

  /* hero */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
    padding: 120px 24px 80px;
    position: relative; overflow: hidden;
  }

  .hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: .18;
    pointer-events: none;
  }

  .badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px;
    border: 1px solid rgba(0,255,178,.25);
    border-radius: 999px;
    font-size: 13px; font-weight: 500;
    color: ${NEON};
    background: rgba(0,255,178,.06);
    margin-bottom: 28px;
    animation: fadeUp .6s ease both;
  }

  .hero-title {
    font-size: clamp(42px, 8vw, 96px);
    line-height: 1.0;
    font-weight: 800;
    letter-spacing: -2px;
    animation: fadeUp .7s .1s ease both;
  }

  .hero-title span {
    background: linear-gradient(135deg, ${NEON} 0%, ${NEON2} 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .hero-sub {
    max-width: 560px;
    margin: 20px auto 0;
    font-size: 18px;
    line-height: 1.7;
    color: ${MUTED};
    font-weight: 300;
    animation: fadeUp .7s .2s ease both;
  }

  .hero-cta {
    display: flex; gap: 12px; margin-top: 40px; flex-wrap: wrap; justify-content: center;
    animation: fadeUp .7s .3s ease both;
  }

  /* buttons */
  .btn-primary {
    padding: 14px 32px;
    background: linear-gradient(135deg, ${NEON} 0%, #00D4FF 100%);
    color: #000;
    font-weight: 600; font-size: 15px;
    border: none; border-radius: 12px; cursor: pointer;
    transition: transform .15s, box-shadow .15s;
    box-shadow: 0 0 30px rgba(0,255,178,.25);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(0,255,178,.4); }

  .btn-ghost {
    padding: 14px 32px;
    background: transparent;
    color: ${TEXT};
    font-weight: 500; font-size: 15px;
    border: 1px solid ${BORDER}; border-radius: 12px; cursor: pointer;
    transition: border-color .15s, background .15s;
  }
  .btn-ghost:hover { border-color: ${NEON}; background: rgba(0,255,178,.04); }

  .btn-sm {
    padding: 8px 18px; font-size: 13px; font-weight: 500;
    border-radius: 8px; cursor: pointer; border: none;
    transition: all .15s;
  }

  /* features */
  .features { padding: 80px 24px; max-width: 1100px; margin: 0 auto; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-top: 48px; }

  .feat-card {
    background: ${CARD};
    border: 1px solid ${BORDER};
    border-radius: 20px;
    padding: 28px;
    transition: border-color .2s, transform .2s;
  }
  .feat-card:hover { border-color: rgba(0,255,178,.3); transform: translateY(-4px); }

  .feat-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 16px;
  }

  /* dashboard */
  .dash { max-width: 1100px; margin: 0 auto; padding: 100px 24px 60px; }
  .dash-grid { display: grid; grid-template-columns: 340px 1fr; gap: 24px; align-items: start; }

  @media (max-width: 860px) { .dash-grid { grid-template-columns: 1fr; } }

  .panel {
    background: ${CARD};
    border: 1px solid ${BORDER};
    border-radius: 20px;
    padding: 24px;
  }

  .input-label { font-size: 12px; font-weight: 600; color: ${MUTED}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }

  .input-field {
    width: 100%; padding: 12px 16px;
    background: rgba(255,255,255,.04);
    border: 1px solid ${BORDER};
    border-radius: 12px;
    color: ${TEXT};
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color .15s;
    resize: vertical;
  }
  .input-field:focus { border-color: ${NEON}; box-shadow: 0 0 0 3px rgba(0,255,178,.08); }

  .cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .cat-btn {
    padding: 10px 8px; border-radius: 10px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: 1px solid ${BORDER}; background: transparent;
    color: ${TEXT}; transition: all .15s; text-align: center;
  }
  .cat-btn.active { border-color: transparent; color: #fff; }

  .platform-row { display: flex; gap: 8px; }
  .plat-btn {
    flex: 1; padding: 9px 4px; border-radius: 10px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1px solid ${BORDER}; background: transparent;
    color: ${MUTED}; transition: all .15s; text-align: center;
  }
  .plat-btn.active { border-color: ${NEON}; color: ${NEON}; background: rgba(0,255,178,.06); }

  /* hooks list */
  .hooks-list { display: flex; flex-direction: column; gap: 10px; }

  .hook-card {
    background: ${CARD};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 16px 20px;
    display: flex; align-items: flex-start; gap: 14px;
    transition: border-color .15s, transform .15s;
    animation: fadeUp .4s ease both;
  }
  .hook-card:hover { border-color: rgba(0,255,178,.2); transform: translateX(3px); }

  .hook-num {
    min-width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(0,255,178,.08);
    color: ${NEON};
    font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px;
  }

  .hook-text { flex: 1; font-size: 14px; line-height: 1.6; color: ${TEXT}; }

  .hook-actions { display: flex; gap: 6px; align-items: center; }

  /* pricing */
  .pricing { max-width: 900px; margin: 0 auto; padding: 100px 24px 80px; }
  .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 48px; }
  @media (max-width: 640px) { .pricing-grid { grid-template-columns: 1fr; } }

  .price-card {
    background: ${CARD};
    border: 1px solid ${BORDER};
    border-radius: 24px;
    padding: 36px;
    position: relative;
    transition: transform .2s;
  }
  .price-card:hover { transform: translateY(-6px); }
  .price-card.pro { border-color: ${NEON}; box-shadow: 0 0 60px rgba(0,255,178,.1); }

  .pro-badge {
    position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
    background: linear-gradient(135deg, ${NEON}, ${NEON2});
    color: #000; font-size: 11px; font-weight: 800;
    padding: 4px 16px; border-radius: 999px; white-space: nowrap;
    text-transform: uppercase; letter-spacing: 1px;
  }

  .price-amount { font-size: 52px; font-weight: 800; line-height: 1; }
  .price-amount sup { font-size: 22px; vertical-align: super; }
  .price-amount sub { font-size: 16px; color: ${MUTED}; font-weight: 400; }

  .price-feature { display: flex; align-items: center; gap: 10px; font-size: 14px; padding: 8px 0; border-bottom: 1px solid ${BORDER}; }
  .price-feature:last-child { border-bottom: none; }
  .check { color: ${NEON}; font-size: 16px; }
  .cross { color: ${MUTED}; font-size: 16px; }

  /* loader */
  .loader {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 48px;
  }
  .loader-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${NEON};
    animation: bounce 1.2s infinite;
  }
  .loader-dot:nth-child(2) { animation-delay: .2s; background: ${NEON2}; }
  .loader-dot:nth-child(3) { animation-delay: .4s; }

  /* animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30%            { transform: translateY(-10px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .5; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .section-label {
    font-size: 12px; font-weight: 600; color: ${NEON};
    text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;
  }
  .section-title {
    font-size: clamp(30px, 5vw, 48px);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -1px;
  }

  /* toast */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 9998;
    background: ${CARD};
    border: 1px solid ${NEON};
    border-radius: 12px;
    padding: 14px 20px;
    font-size: 14px; font-weight: 500;
    color: ${NEON};
    animation: fadeUp .3s ease;
    box-shadow: 0 0 30px rgba(0,255,178,.15);
  }

  /* tabs */
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab {
    padding: 8px 18px; border-radius: 10px; font-size: 14px; font-weight: 500;
    cursor: pointer; border: none; background: transparent; color: ${MUTED};
    transition: all .15s;
  }
  .nav-tab.active { background: rgba(0,255,178,.1); color: ${NEON}; }
  .nav-tab:hover:not(.active) { color: ${TEXT}; }

  /* saved */
  .saved-empty { text-align: center; padding: 60px 20px; color: ${MUTED}; }
  .saved-empty .icon { font-size: 48px; margin-bottom: 12px; }

  /* scrollable results */
  .results-scroll { max-height: 72vh; overflow-y: auto; padding-right: 4px; }

  /* stats bar */
  .stats-bar {
    display: flex; gap: 24px; flex-wrap: wrap;
    padding: 16px 0; border-top: 1px solid ${BORDER}; margin-top: 16px;
  }
  .stat { display: flex; flex-direction: column; gap: 2px; }
  .stat-val { font-size: 20px; font-weight: 700; color: ${NEON}; }
  .stat-label { font-size: 11px; color: ${MUTED}; text-transform: uppercase; letter-spacing: 1px; }

  /* footer */
  .footer {
    border-top: 1px solid ${BORDER};
    padding: 32px 40px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
    font-size: 13px; color: ${MUTED};
  }
`;

// ── Main App ─────────────────────────────────────────────────────────────────
export default function ViralHookAI() {
  const [page, setPage] = useState("landing");
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("lifestyle");
  const [platform, setPlatform] = useState("tiktok");
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);
  const [tab, setTab] = useState("generate");
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(null);
  const [genCount, setGenCount] = useState(0);

const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const copyHook = (text, i) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(i);
      setTimeout(() => setCopied(null), 1500);
      showToast("Hook copied to clipboard!");
    });
  };

  const toggleSave = (hook) => {
    setSaved((prev) => {
      const exists = prev.find((h) => h.text === hook.text);
      if (exists) {
        showToast("Removed from favorites");
        return prev.filter((h) => h.text !== hook.text);
      }
      showToast("⭐ Saved to favorites!");
      return [...prev, hook];
    });
  };

  const isSaved = (text) => saved.some((h) => h.text === text);

  const generate = async () => {
    if (!topic.trim()) { showToast("Enter a topic first!"); return; }
    setLoading(true);
    setHooks([]);
    const catLabel = CATEGORIES.find((c) => c.id === category)?.label || category;
    const platLabel = PLATFORMS.find((p) => p.id === platform)?.label || platform;

    const prompt = `You are a viral content strategist. Generate exactly 20 ultra-viral hook scripts for ${platLabel} videos in the ${catLabel} niche about: "${topic}".

Each hook must:
- Be 1–2 punchy sentences MAX
- Open with a pattern-interrupt (question, shocking stat, bold claim, or cliffhanger)
- Create immediate curiosity or emotional tension
- Be optimized for the ${platLabel} algorithm and audience

Return ONLY a JSON array of 20 strings, no extra text, no markdown. Example format:
["Hook one here","Hook two here","Hook three here"]`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.map((b) => b.text || "").join("") || "[]";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setHooks(parsed.map((text, i) => ({ text, id: Date.now() + i, category, platform })));
      setGenCount((c) => c + 1);
    } catch (e) {
      showToast("Error generating hooks. Try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="noise">
        {/* NAV */}
        <nav className="nav">
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("landing")}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${NEON}, ${NEON2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <span className="syne" style={{ fontSize: 18, fontWeight: 800 }}>ViralHook <span style={{ color: NEON }}>AI</span></span>
          </div>

          <div className="nav-tabs">
            {[["landing","Home"],["dashboard","Generator"],["pricing","Pricing"]].map(([p, l]) => (
              <button key={p} className={`nav-tab ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{l}</button>
            ))}
          </div>

          <button className="btn-primary btn-sm" onClick={() => setPage("dashboard")}>
            Start Free →
          </button>
        </nav>

        {/* ── LANDING ── */}
        {page === "landing" && (
          <>
            <section className="hero">
              <div className="hero-orb" style={{ width: 600, height: 600, background: NEON, top: -200, left: "10%" }} />
              <div className="hero-orb" style={{ width: 500, height: 500, background: NEON2, bottom: -100, right: "5%" }} />

              <div className="badge">
                <span>✦</span> AI-Powered Hook Generator
              </div>

              <h1 className="hero-title syne">
                Stop Losing<br />
                <span>Viewers in 3s</span>
              </h1>

              <p className="hero-sub">
                Generate 20 scroll-stopping hooks for TikTok, YouTube Shorts & Reels in seconds. Trained on viral patterns that actually work.
              </p>

              <div className="hero-cta">
                <button className="btn-primary" onClick={() => setPage("dashboard")}>
                  Generate Hooks Free →
                </button>
                <button className="btn-ghost" onClick={() => setPage("pricing")}>
                  View Pricing
                </button>
              </div>

              {/* floating hook preview */}
              <div style={{ marginTop: 64, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 800, animation: "fadeUp .8s .4s ease both", opacity: 0 }}>
                {["Stop scrolling — this changed my life 🔥","Nobody talks about this $0 business strategy","I lost everything. Here's what I learned.","POV: You just found the algorithm hack"].map((h, i) => (
                  <div key={i} style={{
                    background: CARD, border: `1px solid ${BORDER}`,
                    borderRadius: 12, padding: "10px 16px",
                    fontSize: 13, color: TEXT, maxWidth: 220,
                    lineHeight: 1.5, textAlign: "left",
                    transform: i % 2 === 0 ? "rotate(-1deg)" : "rotate(.8deg)",
                  }}>
                    <span style={{ color: NEON, marginRight: 6 }}>⚡</span>{h}
                  </div>
                ))}
              </div>
            </section>

            {/* FEATURES */}
            <section className="features">
              <div style={{ textAlign: "center", marginBottom: 0 }}>
                <p className="section-label">Why ViralHook AI</p>
                <h2 className="section-title syne">Built for creators<br />who hate wasting time</h2>
              </div>
              <div className="features-grid">
                {[
                  { icon: "⚡", color: "#FFB800", title: "20 Hooks in Seconds", desc: "Stop staring at a blank page. Our AI generates 20 scroll-stopping hooks instantly, trained on millions of viral videos." },
                  { icon: "🎯", color: "#00FFB2", title: "Platform-Optimized", desc: "Hooks are tailored for TikTok, YouTube Shorts, or Reels — each platform has different patterns that work." },
                  { icon: "🗂️", color: "#FF3DFF", title: "Niche Categories", desc: "Gaming, Storytime, Business, Lifestyle — hooks crafted for your specific audience and content style." },
                  { icon: "⭐", color: "#0EA5E9", title: "Save Favorites", desc: "Star your best hooks and build a personal library of high-converting openers you can reuse anytime." },
                  { icon: "📋", color: "#10B981", title: "One-Click Copy", desc: "Copy any hook instantly to your clipboard. No fuss, no friction — just click and paste." },
                  { icon: "🔥", color: "#F97316", title: "Proven Frameworks", desc: "Every hook uses proven copywriting patterns: open loops, curiosity gaps, pattern interrupts, and power words." },
                ].map((f, i) => (
                  <div key={i} className="feat-card" style={{ animationDelay: `${i * .08}s` }}>
                    <div className="feat-icon" style={{ background: `${f.color}18` }}>
                      <span>{f.icon}</span>
                    </div>
                    <h3 className="syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA BANNER */}
            <section style={{ padding: "40px 24px 80px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
              <div style={{ background: `linear-gradient(135deg, rgba(0,255,178,.08), rgba(255,61,255,.08))`, border: `1px solid rgba(0,255,178,.2)`, borderRadius: 28, padding: "56px 40px" }}>
                <p className="section-label">Ready?</p>
                <h2 className="syne" style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, lineHeight: 1.1 }}>Your next viral video<br />starts with one hook</h2>
                <p style={{ color: MUTED, marginBottom: 32, fontSize: 16 }}>Free forever. No credit card. No catch.</p>
                <button className="btn-primary" onClick={() => setPage("dashboard")} style={{ fontSize: 16, padding: "16px 40px" }}>
                  Generate My Hooks →
                </button>
              </div>
            </section>

            <footer className="footer">
              <span>⚡ ViralHook AI — Built for creators</span>
              <span>© 2025 ViralHook AI. All rights reserved.</span>
            </footer>
          </>
        )}

        {/* ── DASHBOARD ── */}
        {page === "dashboard" && (
          <div className="dash">
            <div style={{ marginBottom: 32 }}>
              <p className="section-label">Hook Generator</p>
              <h1 className="syne" style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>
                Create <span style={{ color: NEON }}>Viral Hooks</span>
              </h1>
            </div>

            {/* sub-tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {[["generate","✦ Generate"],["saved",`⭐ Saved (${saved.length})`]].map(([t, l]) => (
                <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ fontSize: 14 }}>{l}</button>
              ))}
            </div>

            {tab === "generate" && (
              <div className="dash-grid">
                {/* LEFT PANEL */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div className="panel">
                    <p className="input-label">Video Topic</p>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="e.g. How I made $10k with dropshipping in 30 days..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div className="panel">
                    <p className="input-label" style={{ marginBottom: 12 }}>Category</p>
                    <div className="cat-grid">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.id}
                          className={`cat-btn ${category === c.id ? "active" : ""}`}
                          style={category === c.id ? { background: c.color } : {}}
                          onClick={() => setCategory(c.id)}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="panel">
                    <p className="input-label" style={{ marginBottom: 12 }}>Platform</p>
                    <div className="platform-row">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          className={`plat-btn ${platform === p.id ? "active" : ""}`}
                          onClick={() => setPlatform(p.id)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary" onClick={generate} disabled={loading} style={{ width: "100%", fontSize: 15, opacity: loading ? .7 : 1 }}>
                    {loading ? "Generating..." : "⚡ Generate 20 Hooks"}
                  </button>

                  {genCount > 0 && (
                    <div className="stats-bar">
                      <div className="stat"><span className="stat-val">{hooks.length}</span><span className="stat-label">hooks generated</span></div>
                      <div className="stat"><span className="stat-val">{saved.length}</span><span className="stat-label">saved</span></div>
                      <div className="stat"><span className="stat-val">{genCount}</span><span className="stat-label">batches</span></div>
                    </div>
                  )}
                </div>

                {/* RIGHT PANEL */}
                <div>
                  {loading && (
                    <div className="panel">
                      <div className="loader">
                        <div className="loader-dot" />
                        <div className="loader-dot" />
                        <div className="loader-dot" />
                      </div>
                      <p style={{ textAlign: "center", color: MUTED, fontSize: 14, paddingBottom: 24 }}>Crafting viral hooks for you...</p>
                    </div>
                  )}

                  {!loading && hooks.length === 0 && (
                    <div className="panel" style={{ textAlign: "center", padding: "64px 32px" }}>
                      <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
                      <h3 className="syne" style={{ fontSize: 22, marginBottom: 8 }}>Ready to go viral?</h3>
                      <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6 }}>Enter your topic and hit Generate to get 20 scroll-stopping hooks tailored to your niche.</p>
                    </div>
                  )}

                  {!loading && hooks.length > 0 && (
                    <div className="panel" style={{ padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "0 4px" }}>
                        <span className="syne" style={{ fontSize: 15, fontWeight: 700 }}>
                          {hooks.length} Hooks Generated
                        </span>
                        <span style={{ fontSize: 12, color: MUTED }}>
                          {PLATFORMS.find(p => p.id === platform)?.label} · {CATEGORIES.find(c => c.id === category)?.label}
                        </span>
                      </div>
                      <div className="results-scroll">
                        <div className="hooks-list">
                          {hooks.map((hook, i) => (
                            <div key={hook.id} className="hook-card" style={{ animationDelay: `${i * .04}s` }}>
                              <div className="hook-num">{i + 1}</div>
                              <p className="hook-text">{hook.text}</p>
                              <div className="hook-actions">
                                <button
                                  className="btn-sm"
                                  onClick={() => toggleSave(hook)}
                                  style={{
                                    background: isSaved(hook.text) ? "rgba(255,191,0,.12)" : "rgba(255,255,255,.05)",
                                    color: isSaved(hook.text) ? "#FFB800" : MUTED,
                                    border: `1px solid ${isSaved(hook.text) ? "rgba(255,191,0,.3)" : BORDER}`,
                                  }}
                                  title="Save hook"
                                >
                                  {isSaved(hook.text) ? "⭐" : "☆"}
                                </button>
                                <button
                                  className="btn-sm"
                                  onClick={() => copyHook(hook.text, i)}
                                  style={{
                                    background: copied === i ? "rgba(0,255,178,.15)" : "rgba(255,255,255,.05)",
                                    color: copied === i ? NEON : MUTED,
                                    border: `1px solid ${copied === i ? "rgba(0,255,178,.3)" : BORDER}`,
                                    minWidth: 64,
                                  }}
                                >
                                  {copied === i ? "✓ Done" : "Copy"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "saved" && (
              <div>
                {saved.length === 0 ? (
                  <div className="saved-empty">
                    <div className="icon">⭐</div>
                    <h3 className="syne" style={{ fontSize: 22, marginBottom: 8 }}>No saved hooks yet</h3>
                    <p style={{ fontSize: 14 }}>Star hooks from your generated results to save them here.</p>
                  </div>
                ) : (
                  <div className="hooks-list" style={{ maxWidth: 720 }}>
                    {saved.map((hook, i) => (
                      <div key={i} className="hook-card">
                        <div className="hook-num" style={{ background: "rgba(255,191,0,.1)", color: "#FFB800" }}>⭐</div>
                        <p className="hook-text">{hook.text}</p>
                        <div className="hook-actions">
                          <button className="btn-sm" onClick={() => toggleSave(hook)} style={{ background: "rgba(255,61,61,.1)", color: "#FF5555", border: `1px solid rgba(255,61,61,.2)` }}>Remove</button>
                          <button className="btn-sm" onClick={() => copyHook(hook.text, `s${i}`)} style={{ background: copied === `s${i}` ? "rgba(0,255,178,.15)" : "rgba(255,255,255,.05)", color: copied === `s${i}` ? NEON : MUTED, border: `1px solid ${copied === `s${i}` ? "rgba(0,255,178,.3)" : BORDER}`, minWidth: 64 }}>
                            {copied === `s${i}` ? "✓ Done" : "Copy"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PRICING ── */}
        {page === "pricing" && (
          <div className="pricing">
            <div style={{ textAlign: "center" }}>
              <p className="section-label">Simple Pricing</p>
              <h1 className="syne section-title">Start free.<br /><span style={{ color: NEON }}>Scale when ready.</span></h1>
              <p style={{ color: MUTED, marginTop: 16, fontSize: 16 }}>No credit card required to start.</p>
            </div>

            <div className="pricing-grid">
              {/* FREE */}
              <div className="price-card">
                <p style={{ color: MUTED, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Free</p>
                <div className="price-amount syne">
                  <sup>$</sup>0<sub>/mo</sub>
                </div>
                <p style={{ color: MUTED, fontSize: 14, margin: "12px 0 24px" }}>Perfect for getting started</p>

                <div style={{ marginBottom: 28 }}>
                  {[
                    [true, "5 generations per day"],
                    [true, "20 hooks per generation"],
                    [true, "All 4 categories"],
                    [true, "All 3 platforms"],
                    [false, "Save unlimited favorites"],
                    [false, "Hook history"],
                    [false, "Priority AI generation"],
                    [false, "Team workspace"],
                  ].map(([ok, feat], i) => (
                    <div key={i} className="price-feature">
                      <span className={ok ? "check" : "cross"}>{ok ? "✓" : "✕"}</span>
                      <span style={{ color: ok ? TEXT : MUTED, fontSize: 14 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <button className="btn-ghost" style={{ width: "100%", padding: "14px" }} onClick={() => setPage("dashboard")}>
                  Get Started Free
                </button>
              </div>

              {/* PRO */}
              <div className="price-card pro">
                <div className="pro-badge">Most Popular</div>
                <p style={{ color: NEON, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Pro</p>
                <div className="price-amount syne">
                  <sup>$</sup>9<sub>/mo</sub>
                </div>
                <p style={{ color: MUTED, fontSize: 14, margin: "12px 0 24px" }}>For serious creators</p>

                <div style={{ marginBottom: 28 }}>
                  {[
                    [true, "Unlimited generations"],
                    [true, "20 hooks per generation"],
                    [true, "All 4 categories"],
                    [true, "All 3 platforms"],
                    [true, "Save unlimited favorites"],
                    [true, "Full hook history"],
                    [true, "Priority AI generation"],
                    [true, "Team workspace (coming soon)"],
                  ].map(([ok, feat], i) => (
                    <div key={i} className="price-feature">
                      <span className="check">✓</span>
                      <span style={{ fontSize: 14 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
                  Start Pro — $9/mo
                </button>
                <p style={{ textAlign: "center", fontSize: 12, color: MUTED, marginTop: 12 }}>Cancel anytime. Powered by Stripe.</p>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ marginTop: 64 }}>
              <h2 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, textAlign: "center" }}>Common questions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640, margin: "0 auto" }}>
                {[
                  ["Do I need a credit card to start?", "Nope! The free plan is genuinely free with no card required."],
                  ["How does the AI generate hooks?", "Our AI is trained on viral content patterns and uses advanced language models to craft hooks using proven frameworks like curiosity gaps, pattern interrupts, and open loops."],
                  ["Can I cancel my Pro subscription?", "Yes, cancel anytime from your account settings. No questions asked."],
                  ["What counts as a 'generation'?", "One generation = one batch of 20 hooks for your topic. Free users get 5 per day."],
                ].map(([q, a], i) => (
                  <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 22px" }}>
                    <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>{q}</p>
                    <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6 }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>

            <footer className="footer" style={{ marginTop: 64 }}>
              <span>⚡ ViralHook AI</span>
              <span>© 2025 ViralHook AI. All rights reserved.</span>
            </footer>
          </div>
        )}

        {/* TOAST */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}