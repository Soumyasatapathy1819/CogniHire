import { useState, useCallback } from "react";

const API = "http://localhost:5000/api";

/* ─── CSS ──────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f4f3f0;--surface:#fff;--card:#fafaf8;
  --border:#e2e0da;--border2:#cccac2;
  --ink:#1a1916;--ink2:#4a4840;--ink3:#9a9890;
  --accent:#1a3a5c;--accentbg:#eef3f9;
  --green:#1a6644;--greenbg:#e8f4ee;
  --red:#922020;--redbg:#fdf0f0;
  --amber:#7a4f0e;--amberbg:#fdf5e6;
  --blue:#1a4a8a;--bluebg:#eef3fc;
  --fh:'Instrument Serif',Georgia,serif;
  --fb:'Geist',system-ui,sans-serif;
  --s1:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --s2:0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.04);
  --s3:0 12px 32px rgba(0,0,0,.1),0 4px 8px rgba(0,0,0,.06);
}
body{background:var(--bg);color:var(--ink);font-family:var(--fb);font-size:14px}
.app{min-height:100vh}

/* TOPBAR */
.topbar{display:flex;align-items:center;justify-content:space-between;
  padding:0 40px;height:58px;background:var(--surface);
  border-bottom:1px solid var(--border);position:sticky;top:0;z-index:200}
.logo{display:flex;align-items:center;gap:10px}
.logo-mark{width:30px;height:30px;border-radius:6px;background:var(--accent);
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:13px;font-weight:700;font-family:var(--fb)}
.logo-text{font-size:15px;font-weight:600;color:var(--ink);letter-spacing:-.3px}
.tb-div{width:1px;height:20px;background:var(--border)}
.tb-bc{font-size:13px;color:var(--ink3)}
.tb-badge{font-size:11px;font-weight:500;padding:4px 10px;border-radius:4px;
  background:var(--accentbg);color:var(--accent);border:1px solid #c8d8ec}

/* PAGE */
.page{max-width:1160px;margin:0 auto;padding:36px 24px 80px}
.ph{margin-bottom:32px;animation:fadeUp .5s ease both}
.pt{font-family:var(--fh);font-size:36px;font-weight:400;letter-spacing:-.5px;
  line-height:1.15;margin-bottom:8px}
.pt em{font-style:italic;color:var(--accent)}
.pd{font-size:14px;color:var(--ink2);line-height:1.7;max-width:560px;font-weight:300}

/* SECTION LABEL */
.sl{font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;
  color:var(--ink3);display:flex;align-items:center;gap:8px;margin-bottom:12px}
.sl::after{content:'';flex:1;height:1px;background:var(--border)}

/* PANEL */
.panel{background:var(--surface);border:1px solid var(--border);
  border-radius:10px;box-shadow:var(--s1);overflow:hidden}
.ph2{padding:16px 20px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;background:var(--card)}
.pt2{font-size:13px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:8px}
.ps{font-size:12px;color:var(--ink3);margin-top:2px}
.pb{padding:20px}

/* GRID */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
@media(max-width:780px){.g2{grid-template-columns:1fr}}

/* INPUTS */
textarea,input[type=text]{
  width:100%;background:var(--bg);border:1px solid var(--border);
  border-radius:7px;color:var(--ink);font-family:var(--fb);
  font-size:13.5px;padding:12px 14px;outline:none;resize:none;
  transition:border-color .15s,box-shadow .15s;line-height:1.65}
textarea:focus,input[type=text]:focus{
  border-color:var(--accent);box-shadow:0 0 0 3px rgba(26,58,92,.08);background:#fff}
textarea::placeholder,input::placeholder{color:var(--ink3)}

/* SLOT */
.slot{border:1px solid var(--border);border-radius:8px;
  background:var(--card);margin-bottom:12px;overflow:hidden;
  transition:border-color .2s,box-shadow .2s}
.slot:hover{border-color:var(--border2);box-shadow:var(--s1)}
.slot-hd{display:flex;align-items:center;gap:10px;
  padding:11px 14px;border-bottom:1px solid var(--border);background:var(--surface)}
.slot-num{width:22px;height:22px;border-radius:5px;background:var(--accentbg);
  color:var(--accent);font-size:11px;font-weight:700;
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.slot-name{flex:1;background:transparent;border:none;font-size:13px;
  font-weight:500;color:var(--ink);padding:0;outline:none;font-family:var(--fb)}
.slot-name::placeholder{color:var(--ink3);font-weight:400}
.slot-rm{width:24px;height:24px;border-radius:5px;background:transparent;
  border:1px solid transparent;color:var(--ink3);font-size:15px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all .15s}
.slot-rm:hover{background:var(--redbg);border-color:#e8c0c0;color:var(--red)}
.slot-bd{padding:12px 14px}

/* UPLOAD ZONE */
.upload-label{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  border:2px dashed var(--border2);border-radius:8px;
  padding:24px 20px;cursor:pointer;transition:all .2s;
  background:var(--bg);text-align:center;user-select:none}
.upload-label:hover{border-color:var(--accent);background:var(--accentbg)}
.upload-label.drag{border-color:var(--accent);background:var(--accentbg)}
.upload-label input{display:none}
.ul-icon{font-size:28px;margin-bottom:8px}
.ul-title{font-size:13px;font-weight:600;color:var(--ink2);margin-bottom:3px}
.ul-title span{color:var(--accent);text-decoration:underline}
.ul-sub{font-size:11.5px;color:var(--ink3)}

/* FILE CHIP */
.fc{display:flex;align-items:center;gap:8px;padding:8px 12px;
  border-radius:6px;background:var(--greenbg);border:1px solid #b8ddc8;margin-top:8px}
.fc-icon{font-size:16px}
.fc-name{font-size:12.5px;font-weight:500;color:var(--green);flex:1;
  min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fc-size{font-size:11px;color:var(--green);opacity:.7;white-space:nowrap}
.fc-rm{width:18px;height:18px;border-radius:4px;border:none;background:transparent;
  color:var(--green);cursor:pointer;font-size:14px;
  display:flex;align-items:center;justify-content:center;opacity:.6;transition:opacity .15s}
.fc-rm:hover{opacity:1}

/* PARSING */
.parsing{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--accent);
  margin-top:8px;padding:7px 11px;background:var(--accentbg);
  border-radius:6px;border:1px solid #c8d8ec}
.ps2{width:12px;height:12px;border:1.5px solid rgba(26,58,92,.2);
  border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
.ext-badge{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;
  font-weight:600;padding:3px 8px;border-radius:3px;background:var(--greenbg);
  color:var(--green);border:1px solid #b8ddc8;margin-top:6px;letter-spacing:.3px}
.ext-preview{margin-top:6px;padding:10px 12px;background:var(--bg);
  border:1px solid var(--border);border-radius:6px;font-size:12px;
  color:var(--ink2);line-height:1.6;max-height:68px;overflow:hidden;position:relative}
.ext-preview::after{content:'';position:absolute;bottom:0;left:0;right:0;
  height:26px;background:linear-gradient(transparent,var(--bg))}

/* ADD BTN */
.add-btn{display:flex;align-items:center;gap:6px;justify-content:center;
  padding:9px 14px;border-radius:7px;width:100%;background:transparent;
  border:1px dashed var(--border2);color:var(--ink2);font-family:var(--fb);
  font-size:13px;cursor:pointer;transition:all .15s;font-weight:500}
.add-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accentbg)}

/* ACTION BAR */
.abar{display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px;background:var(--surface);border:1px solid var(--border);
  border-radius:10px;margin-top:20px;box-shadow:var(--s1)}
.abar-l{font-size:13px;color:var(--ink2)}
.abar-l strong{color:var(--ink)}
.run-btn{display:flex;align-items:center;gap:8px;padding:10px 24px;
  border-radius:7px;background:var(--accent);border:none;color:#fff;
  font-family:var(--fb);font-size:14px;font-weight:600;cursor:pointer;
  letter-spacing:-.2px;box-shadow:0 2px 8px rgba(26,58,92,.25);transition:all .2s}
.run-btn:hover:not(:disabled){background:#142f4d;
  box-shadow:0 4px 14px rgba(26,58,92,.35);transform:translateY(-1px)}
.run-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.rspin{width:15px;height:15px;border:2px solid rgba(255,255,255,.3);
  border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}

/* ERROR */
.err{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;
  border-radius:7px;background:var(--redbg);border:1px solid #e8c0c0;
  color:var(--red);font-size:13px;margin-bottom:16px}

/* OVERLAY */
.overlay{position:fixed;inset:0;background:rgba(244,243,240,.88);
  backdrop-filter:blur(8px);z-index:500;display:flex;align-items:center;justify-content:center}
.ov-card{background:var(--surface);border:1px solid var(--border);
  border-radius:14px;padding:40px 44px;text-align:center;
  box-shadow:var(--s3);min-width:380px;animation:fadeUp .3s ease both}
.ov-icon{font-size:44px;margin-bottom:18px}
.ov-title{font-family:var(--fh);font-size:24px;color:var(--ink);margin-bottom:6px}
.ov-sub{font-size:13px;color:var(--ink2);margin-bottom:28px;font-weight:300}
.ov-bar{height:3px;background:var(--border);border-radius:2px;overflow:hidden;margin-bottom:14px}
.ov-fill{height:100%;background:var(--accent);border-radius:2px;
  animation:prog 4s ease forwards}
@keyframes prog{0%{width:4%}25%{width:38%}60%{width:72%}100%{width:90%}}
.ov-step{font-size:12px;color:var(--ink3)}

/* RESULTS */
.rw{animation:fadeUp .4s ease both}
.rtop{display:flex;align-items:center;justify-content:space-between;
  margin-bottom:24px;flex-wrap:wrap;gap:12px}
.rh{font-family:var(--fh);font-size:30px;font-weight:400;letter-spacing:-.3px}
.rh em{font-style:italic;color:var(--accent)}
.rm2{font-size:13px;color:var(--ink3);margin-top:4px}
.btn-out{padding:8px 16px;border-radius:7px;background:transparent;
  border:1px solid var(--border2);color:var(--ink2);font-family:var(--fb);
  font-size:13px;cursor:pointer;transition:all .15s;font-weight:500}
.btn-out:hover{border-color:var(--ink2);color:var(--ink)}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
@media(max-width:640px){.stats{grid-template-columns:repeat(2,1fr)}}
.sc{background:var(--surface);border:1px solid var(--border);
  border-radius:9px;padding:16px 18px;box-shadow:var(--s1)}
.sc-n{font-family:var(--fh);font-size:30px;color:var(--ink);line-height:1;margin-bottom:4px}
.sc-l{font-size:12px;color:var(--ink3);font-weight:500}

.jd-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;
  border-radius:4px;font-size:12px;background:var(--accentbg);color:var(--accent);
  border:1px solid #c8d8ec;font-weight:500;margin-bottom:20px}

/* RANKED */
.rl{display:flex;flex-direction:column;gap:14px}
.rc{background:var(--surface);border:1px solid var(--border);
  border-radius:10px;overflow:hidden;box-shadow:var(--s1);
  transition:box-shadow .2s,border-color .2s;animation:fadeUp .4s ease both}
.rc:hover{box-shadow:var(--s2);border-color:var(--border2)}
.rc.rc-top{border-left:3px solid var(--accent)}
.rc-hd{display:flex;align-items:center;gap:14px;padding:16px 20px;
  cursor:pointer;user-select:none}
.rr{width:36px;height:36px;border-radius:8px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:14px;font-weight:700;font-family:var(--fb)}
.rr1{background:#fef9ec;color:#a67c00;border:1px solid #f0d67a;font-size:20px}
.rr2{background:#f4f4f5;color:#71717a;border:1px solid #d4d4d8;font-size:20px}
.rr3{background:#fff5ec;color:#8a4a10;border:1px solid #f0c090;font-size:20px}
.rrn{background:var(--bg);color:var(--ink3);border:1px solid var(--border);font-size:12px}
.ri{flex:1;min-width:0}
.rn{font-size:15px;font-weight:600;color:var(--ink);letter-spacing:-.2px}
.rs2{font-size:12.5px;color:var(--ink2);margin-top:3px;font-weight:300;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rsw{display:flex;align-items:center;gap:10px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end}
.dial{width:50px;height:50px;border-radius:50%;border:2.5px solid;
  display:flex;flex-direction:column;align-items:center;justify-content:center}
.dn{font-size:14px;font-weight:700;line-height:1}
.dm{font-size:9px;opacity:.6;font-weight:500}
.sh{border-color:var(--green);color:var(--green)}
.sm{border-color:#c08010;color:var(--amber)}
.sl2{border-color:var(--red);color:var(--red)}
.vt{padding:4px 10px;border-radius:4px;font-size:11px;font-weight:600;
  letter-spacing:.3px;white-space:nowrap}
.vts{background:var(--greenbg);color:var(--green);border:1px solid #b8ddc8}
.vtg{background:var(--bluebg);color:var(--blue);border:1px solid #b8cce8}
.vta{background:var(--amberbg);color:var(--amber);border:1px solid #e8d0a0}
.vtw{background:var(--redbg);color:var(--red);border:1px solid #e8c0c0}
.xbtn{background:none;border:none;color:var(--ink3);font-size:11px;
  cursor:pointer;padding:4px;transition:color .15s}
.xbtn:hover{color:var(--accent)}
.chev{display:inline-block;transition:transform .25s}
.chev.open{transform:rotate(180deg)}
.rc-bd{border-top:1px solid var(--border);padding:18px 20px;background:var(--card)}
.dg{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));
  gap:12px;margin-bottom:14px}
.db{background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:13px 15px}
.dbt{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
  color:var(--ink3);margin-bottom:8px}
.dbb{font-size:13px;color:var(--ink2);line-height:1.65}
.dbb ul{padding-left:14px}
.dbb li{margin-bottom:3px}
.br{margin-bottom:8px}
.bl{display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;color:var(--ink2)}
.bl strong{font-weight:600}
.bbg{height:5px;background:var(--border);border-radius:3px;overflow:hidden}
.bf{height:100%;border-radius:3px;transition:width .9s cubic-bezier(.4,0,.2,1)}
.cr{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.chip{padding:3px 9px;border-radius:4px;font-size:11px;font-weight:500;
  background:var(--accentbg);color:var(--accent);border:1px solid #c8d8ec}
.chip.miss{background:var(--redbg);color:var(--red);border-color:#e8c0c0}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
`;

/* ─── HELPERS ──────────────────────────────────────────────────────────────── */
const sc = s => s >= 75 ? "sh" : s >= 50 ? "sm" : "sl2";
const vc = v => {
  const l = (v || "").toLowerCase();
  if (l.includes("strong")) return "vts";
  if (l.includes("good"))   return "vtg";
  if (l.includes("avg") || l.includes("average")) return "vta";
  return "vtw";
};
const bc = s => s >= 75 ? "var(--green)" : s >= 50 ? "#c08010" : "var(--red)";
const fmtSize = b => b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(1)}MB`;

function RankBadge({ i }) {
  if (i === 0) return <div className="rr rr1">🥇</div>;
  if (i === 1) return <div className="rr rr2">🥈</div>;
  if (i === 2) return <div className="rr rr3">🥉</div>;
  return <div className="rr rrn">#{i + 1}</div>;
}

/* ─── CANDIDATE SLOT ───────────────────────────────────────────────────────── */
function CandidateSlot({ c, idx, onChange, onRemove, total }) {
  const [drag, setDrag] = useState(false);
  const [parsing, setParsing] = useState(false);
  const inputId = `fu-${idx}`;

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setParsing(true);
    onChange(idx, "file", file);
    onChange(idx, "resume", "");
    onChange(idx, "fileName", file.name);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/extract`, { method: "POST", body: form });
      const data = await res.json();
      if (data.text) {
        onChange(idx, "resume", data.text);
        onChange(idx, "wordCount", data.wordCount);
        // Auto-fill name from filename
        if (!c.name.trim()) {
          const n = file.name
            .replace(/\.(pdf|docx?|txt|md)$/i, "")
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase());
          onChange(idx, "name", n);
        }
      } else {
        onChange(idx, "error", data.error || "Extraction failed");
      }
    } catch {
      onChange(idx, "error", "Could not connect to server. Is Flask running?");
    } finally {
      setParsing(false);
    }
  }, [idx, c.name, onChange]);

  const fileIcon = name => /\.pdf$/i.test(name) ? "📕" : /\.docx?$/i.test(name) ? "📘" : "📄";

  return (
    <div className="slot">
      <div className="slot-hd">
        <div className="slot-num">{idx + 1}</div>
        <input
          className="slot-name"
          type="text"
          placeholder={`Candidate ${idx + 1} — Full Name`}
          value={c.name}
          onChange={e => onChange(idx, "name", e.target.value)}
        />
        {total > 1 && <button className="slot-rm" onClick={() => onRemove(idx)}>×</button>}
      </div>
      <div className="slot-bd">
        {/* Upload label — native HTML, works everywhere */}
        <label
          htmlFor={inputId}
          className={`upload-label${drag ? " drag" : ""}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => {
            e.preventDefault(); setDrag(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
        >
          <input
            id={inputId}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ""; }}
          />
          <div className="ul-icon">📄</div>
          <div className="ul-title">Drop file or <span>click to upload</span></div>
          <div className="ul-sub">PDF · DOCX · DOC · TXT</div>
        </label>

        {/* File chip */}
        {c.fileName && !parsing && (
          <div className="fc">
            <span className="fc-icon">{fileIcon(c.fileName)}</span>
            <span className="fc-name">{c.fileName}</span>
            {c.file && <span className="fc-size">{fmtSize(c.file.size)}</span>}
            <button className="fc-rm" onClick={() => {
              onChange(idx, "file", null);
              onChange(idx, "fileName", "");
              onChange(idx, "resume", "");
              onChange(idx, "wordCount", 0);
            }}>×</button>
          </div>
        )}

        {parsing && (
          <div className="parsing">
            <div className="ps2" />
            Extracting text from resume…
          </div>
        )}

        {c.resume && !parsing && (
          <>
            <div className="ext-badge">✓ {c.wordCount || c.resume.split(/\s+/).filter(Boolean).length} words extracted</div>
            <div className="ext-preview">{c.resume.slice(0, 300)}</div>
          </>
        )}

        {c.error && (
          <div style={{ fontSize: 12, color: "var(--red)", marginTop: 8, padding: "6px 10px", background: "var(--redbg)", borderRadius: 6 }}>
            ⚠ {c.error}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── RANKED CARD ──────────────────────────────────────────────────────────── */
function RankedCard({ r, idx }) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className={`rc${idx === 0 ? " rc-top" : ""}`} style={{ animationDelay: `${idx * 0.07}s` }}>
      <div className="rc-hd" onClick={() => setOpen(o => !o)}>
        <RankBadge i={idx} />
        <div className="ri">
          <div className="rn">{r.name}</div>
          <div className="rs2">{r.summary}</div>
        </div>
        <div className="rsw">
          <div className={`dial ${sc(r.score)}`}>
            <span className="dn">{r.score}</span>
            <span className="dm">/100</span>
          </div>
          <span className={`vt ${vc(r.verdict)}`}>{r.verdict}</span>
          <button className="xbtn"><span className={`chev${open ? " open" : ""}`}>▼</span></button>
        </div>
      </div>

      {open && (
        <div className="rc-bd">
          <div style={{ marginBottom: 16 }}>
            <div className="dbt" style={{ marginBottom: 10 }}>Score Breakdown</div>
            {Object.entries(r.scores || {}).map(([k, v]) => (
              <div key={k} className="br">
                <div className="bl">
                  <span style={{ textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, " $1")}</span>
                  <strong style={{ color: bc(v) }}>{v}</strong>
                </div>
                <div className="bbg"><div className="bf" style={{ width: `${v}%`, background: bc(v) }} /></div>
              </div>
            ))}
          </div>
          <div className="dg">
            <div className="db">
              <div className="dbt">✓ Strengths</div>
              <div className="dbb"><ul>{(r.strengths || []).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
            </div>
            <div className="db">
              <div className="dbt">△ Gaps</div>
              <div className="dbb"><ul>{(r.weaknesses || []).map((w, i) => <li key={i}>{w}</li>)}</ul></div>
            </div>
            <div className="db">
              <div className="dbt">◈ Background</div>
              <div className="dbb">
                <div style={{ marginBottom: 5 }}><strong style={{ color: "var(--ink)" }}>Experience:</strong> {r.experience}</div>
                <div><strong style={{ color: "var(--ink)" }}>Education:</strong> {r.education}</div>
              </div>
            </div>
            <div className="db">
              <div className="dbt">→ Recommendation</div>
              <div className="dbb">{r.recommendation}</div>
            </div>
          </div>
          <div className="db">
            <div className="dbt">Skills Assessment</div>
            <div className="cr">
              {(r.matchedSkills || []).map((s, i) => <span key={i} className="chip">✓ {s}</span>)}
              {(r.missingSkills || []).map((s, i) => <span key={i} className="chip miss">✗ {s}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN APP ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [jd, setJd] = useState("");
  const [candidates, setCandidates] = useState([
    { name: "", resume: "", file: null, fileName: "", wordCount: 0, error: "" },
    { name: "", resume: "", file: null, fileName: "", wordCount: 0, error: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const update = (i, f, v) => setCandidates(p => p.map((c, idx) => idx === i ? { ...c, [f]: v } : c));
  const remove = i => setCandidates(p => p.filter((_, idx) => idx !== i));
  const add = () => { if (candidates.length < 8) setCandidates(p => [...p, { name: "", resume: "", file: null, fileName: "", wordCount: 0, error: "" }]); };

  const handleRun = async () => {
    if (!jd.trim()) { setError("Job description is required."); return; }
    const filled = candidates.filter(c => c.resume.trim() && c.name.trim());
    if (!filled.length) { setError("Upload at least one resume with a candidate name."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jd,
          candidates: filled.map(c => ({ name: c.name, resume: c.resume })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResults(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filled = candidates.filter(c => c.resume.trim() && c.name.trim());
  // Sort candidates by score descending (don't rely on AI to sort correctly)
  const sortedCandidates = results
    ? [...results.candidates].sort((a, b) => b.score - a.score)
    : [];
  const avgScore = sortedCandidates.length
    ? Math.round(sortedCandidates.reduce((a, c) => a + c.score, 0) / sortedCandidates.length)
    : 0;
  const strong = sortedCandidates.filter(c => c.score >= 75).length;
  const topScore = sortedCandidates.length ? sortedCandidates[0].score : 0;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div className="logo">
              <div className="logo-mark">TA</div>
              <span className="logo-text">CogniHire</span>
            </div>
            <div className="tb-div" />
            <span className="tb-bc">Candidate Intelligence</span>
          </div>
          <span className="tb-badge">Enterprise</span>
        </header>

        <div className="page">
          {!results && (
            <div className="ph">
              <h1 className="pt">Intelligent Resume<br /><em>Screening & Ranking</em></h1>
              <p className="pd">Upload candidate resumes — PDF, DOCX, or TXT. AI evaluates each against your job requirements and delivers ranked, detailed assessments instantly.</p>
            </div>
          )}

          {error && <div className="err"><span>⚠</span>{error}</div>}

          {!results && (
            <div style={{ animation: "fadeUp .45s ease both" }}>
              <div className="g2">
                {/* JD */}
                <div>
                  <div className="sl">Job Description</div>
                  <div className="panel">
                    <div className="ph2">
                      <div>
                        <div className="pt2">📋 Position Requirements</div>
                        <div className="ps">Paste the full job posting</div>
                      </div>
                      <span style={{ fontSize: 11, color: "var(--ink3)" }}>{jd.length} chars</span>
                    </div>
                    <div className="pb">
                      <textarea
                        rows={17}
                        placeholder={"Job Title: Senior Software Engineer\n\nRequirements:\n• 5+ years experience\n• Python / Node.js proficiency\n• Strong system design skills\n• Team leadership experience"}
                        value={jd}
                        onChange={e => setJd(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Candidates */}
                <div>
                  <div className="sl">Candidates — {candidates.length} / 8</div>
                  <div className="panel">
                    <div className="ph2">
                      <div>
                        <div className="pt2">👤 Resume Upload</div>
                        <div className="ps">Upload PDF, DOCX, or TXT files</div>
                      </div>
                      <span style={{ fontSize: 11, color: "var(--ink3)" }}>{filled.length} ready</span>
                    </div>
                    <div className="pb" style={{ maxHeight: 580, overflowY: "auto" }}>
                      {candidates.map((c, i) => (
                        <CandidateSlot key={i} c={c} idx={i} onChange={update} onRemove={remove} total={candidates.length} />
                      ))}
                      {candidates.length < 8 && (
                        <button className="add-btn" onClick={add}>+ Add Another Candidate</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="abar">
                <div className="abar-l">
                  <strong>{filled.length}</strong> candidate{filled.length !== 1 ? "s" : ""} ready
                  {!filled.length && <span style={{ color: "var(--ink3)", marginLeft: 6 }}>— upload at least one resume</span>}
                </div>
                <button className="run-btn" onClick={handleRun} disabled={loading || !filled.length || !jd.trim()}>
                  {loading ? <><div className="rspin" />Analysing…</> : <>▶ Run Screening</>}
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="overlay">
              <div className="ov-card">
                <div className="ov-icon">🔍</div>
                <div className="ov-title">Screening Candidates</div>
                <div className="ov-sub">Evaluating {filled.length} resume{filled.length !== 1 ? "s" : ""} against your requirements</div>
                <div className="ov-bar"><div className="ov-fill" /></div>
                <div className="ov-step">Analysing skills, experience and cultural fit…</div>
              </div>
            </div>
          )}

          {results && !loading && (
            <div className="rw">
              <div className="rtop">
                <div>
                  <div className="rh">Screening <em>Results</em></div>
                  <div className="rm2">{results.candidates.length} candidates evaluated · Ranked by match score</div>
                </div>
                <button className="btn-out" onClick={() => { setResults(null); setError(""); }}>← New Screening</button>
              </div>

              <div className="jd-tag">📋 {results.jobTitle}</div>

              <div className="stats">
                <div className="sc"><div className="sc-n" style={{ color: "var(--accent)" }}>{sortedCandidates.length}</div><div className="sc-l">Screened</div></div>
                <div className="sc"><div className="sc-n" style={{ color: "var(--green)" }}>{strong}</div><div className="sc-l">Strong Matches</div></div>
                <div className="sc"><div className="sc-n">{avgScore}</div><div className="sc-l">Average Score</div></div>
                <div className="sc"><div className="sc-n" style={{ color: "var(--accent)" }}>{topScore}</div><div className="sc-l">Top Score</div></div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <div className="sl">Key Required Skills</div>
                <div className="cr">{(results.topSkills || []).map((s, i) => <span key={i} className="chip">{s}</span>)}</div>
              </div>

              <div className="sl">Ranked Candidates</div>
              <div className="rl">
                {sortedCandidates.map((r, i) => <RankedCard key={i} r={r} idx={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
