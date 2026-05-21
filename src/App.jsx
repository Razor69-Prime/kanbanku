import { useState, useEffect } from "react";

const SUPABASE_URL = "https://xnfejzofpktqlifqvdbd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZmVqem9mcGt0cWxpZnF2ZGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDQ3OTAsImV4cCI6MjA5NDg4MDc5MH0.dMY_8xFg9DbvXNzlodDFvHxpHEFfUAEfwiXe7ud5Xao";

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Prefer": "return=representation",
};

const db = {
  async getColumns() {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/columns?select=*&order=position.asc`, { headers });
    return r.json();
  },
  async getCards() {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/cards?select=*&order=position.asc`, { headers });
    return r.json();
  },
  async insertColumn(col) {
    await fetch(`${SUPABASE_URL}/rest/v1/columns`, { method: "POST", headers, body: JSON.stringify(col) });
  },
  async updateColumn(id, data) {
    await fetch(`${SUPABASE_URL}/rest/v1/columns?id=eq.${id}`, { method: "PATCH", headers, body: JSON.stringify(data) });
  },
  async deleteColumn(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/columns?id=eq.${id}`, { method: "DELETE", headers });
  },
  async insertCard(card) {
    await fetch(`${SUPABASE_URL}/rest/v1/cards`, { method: "POST", headers, body: JSON.stringify(card) });
  },
  async updateCard(id, data) {
    await fetch(`${SUPABASE_URL}/rest/v1/cards?id=eq.${id}`, { method: "PATCH", headers, body: JSON.stringify(data) });
  },
  async deleteCard(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/cards?id=eq.${id}`, { method: "DELETE", headers });
  },
};

const MEMBERS = ["Semua","Andi","Budi","Citra","Dian","Eka"];
const PRIORITIES = [
  { label: "Tinggi", color: "#ef4444", bg: "#fef2f2", darkBg: "#3f1a1a" },
  { label: "Sedang", color: "#f59e0b", bg: "#fffbeb", darkBg: "#3f2d00" },
  { label: "Rendah", color: "#22c55e", bg: "#f0fdf4", darkBg: "#0d2e1a" },
];
const LABELS = [
  { name: "Research", color: "#6366f1", bg: "#eef2ff", darkBg: "#1e1b4b" },
  { name: "Design",   color: "#ec4899", bg: "#fdf2f8", darkBg: "#3b0a2a" },
  { name: "Dev",      color: "#0ea5e9", bg: "#f0f9ff", darkBg: "#0c2340" },
  { name: "Meeting",  color: "#f97316", bg: "#fff7ed", darkBg: "#3b1a00" },
  { name: "Bug",      color: "#ef4444", bg: "#fef2f2", darkBg: "#3f1a1a" },
  { name: "Urgent",   color: "#8b5cf6", bg: "#f5f3ff", darkBg: "#2d1b69" },
];
const COL_COLORS = ["#6366f1","#f59e0b","#3b82f6","#22c55e","#ec4899","#14b8a6"];

function generateId() { return "id-" + Math.random().toString(36).substr(2, 9); }
function getInitials(n) { return n ? n.split(" ").map(x => x[0]).join("").toUpperCase().slice(0,2) : "?"; }
function getPriority(l) { return PRIORITIES.find(p => p.label === l) || PRIORITIES[1]; }
function getLabel(n) { return LABELS.find(l => l.name === n) || LABELS[0]; }

function Avatar({ name, size = 26, dark }) {
  const colors = ["#6366f1","#ec4899","#0ea5e9","#f97316","#22c55e","#8b5cf6"];
  const idx = name ? name.charCodeAt(0) % colors.length : 0;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[idx]+(dark?"33":"22"), border: `1.5px solid ${colors[idx]}44`,
      color: colors[idx], fontSize: size*0.38, fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>{getInitials(name)}</div>
  );
}

function Badge({ label, dark }) {
  const l = getLabel(label);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: dark ? l.darkBg : l.bg, color: l.color,
      border: `1px solid ${l.color}33`, borderRadius: 5,
      fontSize: 10, fontWeight: 700, padding: "2px 7px",
      letterSpacing: "0.06em", textTransform: "uppercase",
    }}>{label}</span>
  );
}

function PriorityDot({ priority }) {
  const p = getPriority(priority);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: p.color, fontSize: 11, fontWeight: 600 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, display: "inline-block" }} />
      {priority}
    </span>
  );
}

function CardItem({ card, colId, onDelete, onEdit, onDragStart, dark }) {
  const [hover, setHover] = useState(false);
  return (
    <div draggable onDragStart={e => onDragStart(e, card.id, colId)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: dark ? (hover?"#1e2433":"#161d2e") : (hover?"#f8faff":"#fff"),
        border: `1px solid ${dark?(hover?"#334155":"#232b3e"):(hover?"#c7d2fe":"#e5e7eb")}`,
        borderLeft: `3px solid ${getPriority(card.priority).color}`,
        borderRadius: 10, padding: "11px 13px", marginBottom: 9, cursor: "grab",
        transition: "all 0.15s", boxShadow: hover?"0 2px 12px rgba(99,102,241,0.1)":"0 1px 3px rgba(0,0,0,0.06)",
      }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7, gap:8 }}>
        <Badge label={card.label} dark={dark} />
        <PriorityDot priority={card.priority} />
      </div>
      <div style={{ color: dark?"#e2e8f0":"#1e293b", fontSize:13.5, lineHeight:1.5, fontWeight:500, marginBottom: card.assignee ? 9 : 0 }}>
        {card.text}
      </div>
      {card.assignee && (
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Avatar name={card.assignee} size={22} dark={dark} />
          <span style={{ fontSize:11, color:dark?"#94a3b8":"#64748b" }}>{card.assignee}</span>
        </div>
      )}
      {hover && (
        <div style={{ display:"flex", gap:6, marginTop:10, paddingTop:9, borderTop:`1px solid ${dark?"#1e293b":"#f1f5f9"}` }}>
          <button onClick={() => onEdit(card, colId)} style={{ background:dark?"#1e1b4b":"#eef2ff", border:`1px solid ${dark?"#4338ca":"#c7d2fe"}`, borderRadius:6, color:"#6366f1", fontSize:11, fontWeight:600, padding:"3px 10px", cursor:"pointer" }}>✏ Edit</button>
          <button onClick={() => onDelete(card.id)} style={{ background:dark?"#3f1a1a":"#fef2f2", border:`1px solid ${dark?"#dc2626":"#fca5a5"}`, borderRadius:6, color:"#ef4444", fontSize:11, fontWeight:600, padding:"3px 10px", cursor:"pointer" }}>🗑 Hapus</button>
        </div>
      )}
    </div>
  );
}

function Column({ col, cards, onAddCard, onDeleteCard, onEditCard, onDragStart, onDrop, onDragOver, onDeleteColumn, onRenameColumn, filterFn, dark }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ text:"", label:"Dev", priority:"Sedang", assignee:"Andi" });
  const [dragOver, setDragOver] = useState(false);
  const [editing, setEditing] = useState(false);
  const [titleVal, setTitleVal] = useState(col.title);
  const filtered = cards.filter(filterFn);

  const inp = {
    width:"100%", background:dark?"#1e293b":"#fff", border:`1px solid ${dark?"#334155":"#e2e8f0"}`,
    borderRadius:7, color:dark?"#e2e8f0":"#1e293b", fontSize:13, padding:"7px 10px",
    fontFamily:"inherit", outline:"none", boxSizing:"border-box",
  };

  return (
    <div onDragOver={e=>{e.preventDefault();setDragOver(true);onDragOver(e);}} onDragLeave={()=>setDragOver(false)}
      onDrop={e=>{setDragOver(false);onDrop(e,col.id);}}
      style={{
        minWidth:285, maxWidth:285,
        background:dark?(dragOver?"#1a2236":"#111827"):(dragOver?"#f0f4ff":"#f8fafc"),
        border:`1.5px solid ${dragOver?col.color+"66":(dark?"#232b3e":"#e5e7eb")}`,
        borderRadius:14, padding:"14px 12px 12px", display:"flex", flexDirection:"column",
        transition:"all 0.15s", boxShadow:dark?"0 2px 16px rgba(0,0,0,0.3)":"0 1px 4px rgba(0,0,0,0.06)",
        maxHeight:"82vh",
      }}>
      <div style={{ display:"flex", alignItems:"center", marginBottom:13, gap:8 }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background:col.color, flexShrink:0 }} />
        {editing ? (
          <input autoFocus value={titleVal} onChange={e=>setTitleVal(e.target.value)}
            onBlur={()=>{onRenameColumn(col.id,titleVal);setEditing(false);}}
            onKeyDown={e=>{if(e.key==="Enter"){onRenameColumn(col.id,titleVal);setEditing(false);}}}
            style={{...inp,fontSize:13,fontWeight:700,flex:1,padding:"2px 7px"}} />
        ) : (
          <span onDoubleClick={()=>setEditing(true)} title="Double-click untuk rename"
            style={{ color:dark?"#f1f5f9":"#1e293b", fontWeight:700, fontSize:13, flex:1, cursor:"default" }}>
            {col.title}
          </span>
        )}
        <span style={{ background:col.color+"20", color:col.color, borderRadius:20, fontSize:11, fontWeight:700, padding:"1px 8px" }}>{filtered.length}</span>
        <button onClick={()=>onDeleteColumn(col.id)} style={{ background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:16, padding:"0 2px" }}>×</button>
      </div>

      <div style={{ overflowY:"auto", flex:1 }}>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:"20px 0", color:dark?"#475569":"#cbd5e1", fontSize:13 }}>Tidak ada kartu</div>}
        {filtered.map(card => (
          <CardItem key={card.id} card={card} colId={col.id}
            onDelete={onDeleteCard} onEdit={onEditCard} onDragStart={onDragStart} dark={dark} />
        ))}
      </div>

      {adding ? (
        <div style={{ marginTop:10, background:dark?"#161d2e":"#fff", border:`1px solid ${dark?"#334155":"#e2e8f0"}`, borderRadius:10, padding:12 }}>
          <textarea autoFocus value={form.text} onChange={e=>setForm({...form,text:e.target.value})}
            placeholder="Deskripsi tugas..." style={{...inp,resize:"vertical",minHeight:70,marginBottom:8}}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();if(form.text.trim()){onAddCard(col.id,form);setForm({text:"",label:"Dev",priority:"Sedang",assignee:"Andi"});setAdding(false);}}}}
          />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
            <select value={form.label} onChange={e=>setForm({...form,label:e.target.value})} style={{...inp,fontSize:12}}>
              {LABELS.map(l=><option key={l.name} value={l.name}>{l.name}</option>)}
            </select>
            <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} style={{...inp,fontSize:12}}>
              {PRIORITIES.map(p=><option key={p.label} value={p.label}>{p.label}</option>)}
            </select>
            <select value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})} style={{...inp,fontSize:12,gridColumn:"span 2"}}>
              {MEMBERS.filter(m=>m!=="Semua").map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:7 }}>
            <button onClick={()=>{if(form.text.trim()){onAddCard(col.id,form);setForm({text:"",label:"Dev",priority:"Sedang",assignee:"Andi"});setAdding(false);}}} style={{ background:col.color, border:"none", borderRadius:7, color:"#fff", fontWeight:700, fontSize:13, padding:"7px 18px", cursor:"pointer" }}>Tambah</button>
            <button onClick={()=>setAdding(false)} style={{ background:dark?"#1e293b":"#fff", border:`1px solid ${dark?"#334155":"#e2e8f0"}`, borderRadius:7, color:dark?"#94a3b8":"#64748b", fontSize:13, padding:"7px 14px", cursor:"pointer" }}>Batal</button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setAdding(true)} style={{
          marginTop:10, background:"none", border:`1.5px dashed ${dark?"#334155":"#cbd5e1"}`,
          borderRadius:8, color:dark?"#475569":"#94a3b8", fontSize:13, padding:"8px",
          cursor:"pointer", width:"100%", fontFamily:"inherit", transition:"all 0.15s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=col.color;e.currentTarget.style.color=col.color;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?"#334155":"#cbd5e1";e.currentTarget.style.color=dark?"#475569":"#94a3b8";}}
        >+ Tambah Kartu</button>
      )}
    </div>
  );
}

function CardModal({ card, colId, columns, onSave, onClose, dark }) {
  const [form, setForm] = useState({
    text:card.text, label:card.label||"Dev",
    priority:card.priority||"Sedang", assignee:card.assignee||"Andi",
    targetCol:colId,
  });
  const inp = {
    width:"100%", background:dark?"#1e293b":"#f8fafc", border:`1px solid ${dark?"#334155":"#e2e8f0"}`,
    borderRadius:8, color:dark?"#e2e8f0":"#1e293b", fontSize:13, padding:"8px 11px",
    fontFamily:"inherit", outline:"none", boxSizing:"border-box", display:"block",
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:dark?"#111827":"#fff", borderRadius:16, padding:28, width:420, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", border:`1px solid ${dark?"#1e293b":"#e5e7eb"}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h3 style={{ margin:0, color:dark?"#f1f5f9":"#1e293b", fontSize:17, fontWeight:700 }}>✏️ Edit Kartu</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, color:"#94a3b8", cursor:"pointer" }}>×</button>
        </div>
        <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:4 }}>Deskripsi</label>
        <textarea value={form.text} onChange={e=>setForm({...form,text:e.target.value})} style={{...inp,resize:"vertical",minHeight:80,marginBottom:14}} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
          {[["Label","label",LABELS.map(l=>l.name)],["Prioritas","priority",PRIORITIES.map(p=>p.label)],["Assignee","assignee",MEMBERS.filter(m=>m!=="Semua")]].map(([lbl,key,opts])=>(
            <div key={key} style={{ gridColumn: key==="assignee" ? "span 2" : "span 1" }}>
              <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:4 }}>{lbl}</label>
              <select value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={inp}>
                {opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:4 }}>Pindah ke Kolom</label>
        <select value={form.targetCol} onChange={e=>setForm({...form,targetCol:e.target.value})} style={{...inp,marginBottom:20}}>
          {columns.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ background:dark?"#1e293b":"#fff", border:`1px solid ${dark?"#334155":"#e2e8f0"}`, borderRadius:8, color:dark?"#94a3b8":"#64748b", fontSize:13, padding:"8px 18px", cursor:"pointer" }}>Batal</button>
          <button onClick={()=>onSave(card.id,colId,form)} style={{ background:"#6366f1", border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:13, padding:"8px 22px", cursor:"pointer" }}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dark, setDark] = useState(()=>{ try{return localStorage.getItem("dt-dark")==="true";}catch{return false;} });
  const [search, setSearch] = useState("");
  const [filterLabel, setFilterLabel] = useState("Semua");
  const [filterPriority, setFilterPriority] = useState("Semua");
  const [filterAssignee, setFilterAssignee] = useState("Semua");
  const [dragCardId, setDragCardId] = useState(null);
  const [dragFromCol, setDragFromCol] = useState(null);
  const [editCard, setEditCard] = useState(null);
  const [editColId, setEditColId] = useState(null);
  const [addingCol, setAddingCol] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    localStorage.setItem("dt-dark", dark);
    document.body.style.background = dark ? "#0a0f1e" : "#f1f5f9";
  }, [dark]);

  async function loadData() {
    try {
      setLoading(true); setError(null);
      const [cols, cds] = await Promise.all([db.getColumns(), db.getCards()]);
      if (cols.error || cds.error) throw new Error(cols.error?.message || cds.error?.message);
      setColumns(cols); setCards(cds);
    } catch(e) {
      setError("Gagal koneksi ke database. Cek koneksi internet kamu.");
    } finally { setLoading(false); }
  }

  const sync = async (fn) => { setSyncing(true); await fn(); setSyncing(false); };

  const filterFn = (card) => {
    const q = search.toLowerCase();
    if (q && !card.text.toLowerCase().includes(q) && !(card.assignee||"").toLowerCase().includes(q)) return false;
    if (filterLabel!=="Semua" && card.label!==filterLabel) return false;
    if (filterPriority!=="Semua" && card.priority!==filterPriority) return false;
    if (filterAssignee!=="Semua" && card.assignee!==filterAssignee) return false;
    return true;
  };
  const activeFilters = [filterLabel,filterPriority,filterAssignee].filter(f=>f!=="Semua").length+(search?1:0);
  const totalCards = cards.length;
  const doneCards = cards.filter(c => columns.find(col=>col.id===c.column_id)?.title.includes("Done"))?.length || 0;

  const handleAddCard = async (colId, form) => {
    const card = { id:generateId(), column_id:colId, position:cards.filter(c=>c.column_id===colId).length, ...form };
    setCards(prev=>[...prev,card]);
    await sync(()=>db.insertCard(card));
  };
  const handleDeleteCard = async (cardId) => {
    setCards(prev=>prev.filter(c=>c.id!==cardId));
    await sync(()=>db.deleteCard(cardId));
  };
  const handleSaveEdit = async (cardId, fromColId, form) => {
    const { targetCol, ...cardData } = form;
    setCards(prev=>prev.map(c=>c.id===cardId?{...c,...cardData,column_id:targetCol}:c));
    await sync(()=>db.updateCard(cardId,{...cardData,column_id:targetCol}));
    setEditCard(null); setEditColId(null);
  };
  const handleDragStart = (e, cardId, colId) => { setDragCardId(cardId); setDragFromCol(colId); };
  const handleDrop = async (e, targetColId) => {
    if (!dragCardId||dragFromCol===targetColId) return;
    setCards(prev=>prev.map(c=>c.id===dragCardId?{...c,column_id:targetColId}:c));
    await sync(()=>db.updateCard(dragCardId,{column_id:targetColId}));
    setDragCardId(null); setDragFromCol(null);
  };
  const handleAddColumn = async () => {
    if (!newColName.trim()) return;
    const col = { id:generateId(), title:newColName.trim(), color:COL_COLORS[columns.length%COL_COLORS.length], position:columns.length };
    setColumns(prev=>[...prev,col]);
    await sync(()=>db.insertColumn(col));
    setNewColName(""); setAddingCol(false);
  };
  const handleDeleteColumn = async (colId) => {
    setColumns(prev=>prev.filter(c=>c.id!==colId));
    setCards(prev=>prev.filter(c=>c.column_id!==colId));
    await sync(()=>db.deleteColumn(colId));
  };
  const handleRenameColumn = async (colId, title) => {
    setColumns(prev=>prev.map(c=>c.id===colId?{...c,title}:c));
    await sync(()=>db.updateColumn(colId,{title}));
  };

  const exportCSV = () => {
    const rows = [["Kolom","Tugas","Label","Prioritas","Assignee"]];
    columns.forEach(col => {
      cards.filter(c=>c.column_id===col.id).forEach(c => {
        rows.push([col.title, c.text, c.label, c.priority, c.assignee||"-"]);
      });
    });
    const csv = rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="dailytask.csv"; a.click();
    URL.revokeObjectURL(url); setShowExport(false);
  };

  const bg = dark?"#0a0f1e":"#f1f5f9";
  const headerBg = dark?"rgba(17,24,39,0.97)":"#fff";
  const headerBorder = dark?"#1e293b":"#e5e7eb";
  const textPrimary = dark?"#f1f5f9":"#1e293b";
  const textMuted = dark?"#64748b":"#94a3b8";
  const inputBg = dark?"#1e293b":"#f8fafc";
  const inputBorder = dark?"#334155":"#e2e8f0";
  const selStyle = { background:inputBg, border:`1px solid ${inputBorder}`, borderRadius:7, color:textPrimary, fontSize:12, padding:"6px 10px", fontFamily:"inherit", outline:"none", cursor:"pointer", height:34 };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #6366f1", borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }} />
      <span style={{ color:textMuted, fontSize:14 }}>Memuat data dari database...</span>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:dark?"#111827":"#fff", border:`1px solid ${dark?"#1e293b":"#e5e7eb"}`, borderRadius:16, padding:32, textAlign:"center", maxWidth:380 }}>
        <div style={{ fontSize:40, marginBottom:12 }}>❌</div>
        <div style={{ color:textPrimary, fontWeight:700, fontSize:16, marginBottom:8 }}>Koneksi Gagal</div>
        <div style={{ color:textMuted, fontSize:13, marginBottom:20 }}>{error}</div>
        <button onClick={loadData} style={{ background:"#6366f1", border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:14, padding:"10px 24px", cursor:"pointer" }}>Coba Lagi</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{margin:0;font-family:'Inter',sans-serif;transition:background 0.3s;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:8px;}
        select,input,textarea,button{font-family:'Inter',sans-serif;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div style={{ minHeight:"100vh", background:bg, transition:"background 0.3s" }}>
        {/* HEADER */}
        <div style={{ background:headerBg, borderBottom:`1px solid ${headerBorder}`, padding:"0 20px", display:"flex", alignItems:"center", gap:10, height:58, position:"sticky", top:0, zIndex:100, boxShadow:dark?"0 1px 8px rgba(0,0,0,0.4)":"0 1px 4px rgba(0,0,0,0.05)" }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>✅</div>
            <span style={{ color:textPrimary, fontWeight:700, fontSize:17, letterSpacing:"-0.3px" }}>Daily Task</span>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0, marginLeft:8 }}>
            <span style={{ color:"#6366f1", fontWeight:700, fontSize:13 }}>{totalCards}</span>
            <span style={{ color:textMuted, fontSize:12 }}>kartu</span>
            <span style={{ color:textMuted, fontSize:12 }}>·</span>
            <span style={{ color:"#22c55e", fontWeight:700, fontSize:13 }}>{columns.length}</span>
            <span style={{ color:textMuted, fontSize:12 }}>kolom</span>
          </div>

          {/* Search */}
          <div style={{ position:"relative", flex:"0 1 180px" }}>
            <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color:textMuted, fontSize:13 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari kartu..."
              style={{...selStyle,paddingLeft:30,width:"100%",fontSize:13}} />
          </div>

          {/* Filters */}
          <select value={filterLabel} onChange={e=>setFilterLabel(e.target.value)} style={selStyle}>
            <option value="Semua">🏷 Label</option>
            {LABELS.map(l=><option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
          <select value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} style={selStyle}>
            <option value="Semua">⚡ Prioritas</option>
            {PRIORITIES.map(p=><option key={p.label} value={p.label}>{p.label}</option>)}
          </select>
          <select value={filterAssignee} onChange={e=>setFilterAssignee(e.target.value)} style={selStyle}>
            <option value="Semua">👤 Anggota</option>
            {MEMBERS.filter(m=>m!=="Semua").map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          {activeFilters>0 && (
            <button onClick={()=>{setSearch("");setFilterLabel("Semua");setFilterPriority("Semua");setFilterAssignee("Semua");}}
              style={{...selStyle,background:"#eef2ff",border:"1px solid #c7d2fe",color:"#6366f1",fontWeight:600,whiteSpace:"nowrap"}}>
              ✕ Reset ({activeFilters})
            </button>
          )}

          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            {/* Sync */}
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              {syncing ? (
                <div style={{ width:8, height:8, borderRadius:"50%", border:"1.5px solid #6366f1", borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }} />
              ) : (
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e" }} />
              )}
              <span style={{ fontSize:11, color:syncing?"#6366f1":"#22c55e" }}>{syncing?"Menyimpan...":"Tersimpan"}</span>
            </div>

            {/* Export */}
            <div style={{ position:"relative" }}>
              <button onClick={()=>setShowExport(!showExport)} style={{...selStyle,display:"flex",alignItems:"center",gap:5}}>📤 Export</button>
              {showExport && (
                <div onClick={()=>setShowExport(false)} style={{ position:"fixed",inset:0,zIndex:200 }}>
                  <div onClick={e=>e.stopPropagation()} style={{ position:"absolute",right:0,top:36,background:headerBg,border:`1px solid ${headerBorder}`,borderRadius:10,padding:6,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",minWidth:180,zIndex:201 }}>
                    <button onClick={exportCSV} style={{ display:"block",width:"100%",padding:"8px 14px",background:"none",border:"none",color:textPrimary,fontSize:13,cursor:"pointer",textAlign:"left",borderRadius:7 }}
                      onMouseEnter={e=>e.target.style.background=dark?"#1e293b":"#f1f5f9"}
                      onMouseLeave={e=>e.target.style.background="none"}>📊 Export CSV (Excel)</button>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh */}
            <button onClick={loadData} title="Refresh data" style={{...selStyle,display:"flex",alignItems:"center"}}>🔄</button>

            {/* Dark mode */}
            <button onClick={()=>setDark(!dark)} style={{...selStyle,display:"flex",alignItems:"center",gap:5}}>
              {dark?"☀️ Light":"🌙 Dark"}
            </button>
          </div>
        </div>

        {/* BOARD */}
        <div style={{ display:"flex", gap:14, padding:"20px 20px 40px", overflowX:"auto", alignItems:"flex-start", minHeight:"calc(100vh - 58px)" }}>
          {columns.map(col => (
            <Column key={col.id} col={col}
              cards={cards.filter(c=>c.column_id===col.id)}
              filterFn={filterFn}
              onAddCard={handleAddCard} onDeleteCard={handleDeleteCard}
              onEditCard={(card,colId)=>{setEditCard(card);setEditColId(colId);}}
              onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={e=>e.preventDefault()}
              onDeleteColumn={handleDeleteColumn} onRenameColumn={handleRenameColumn}
              dark={dark}
            />
          ))}

          <div style={{ minWidth:260 }}>
            {addingCol ? (
              <div style={{ background:dark?"#111827":"#fff", border:`1px solid ${dark?"#1e293b":"#e5e7eb"}`, borderRadius:14, padding:14 }}>
                <input autoFocus value={newColName} onChange={e=>setNewColName(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter")handleAddColumn();if(e.key==="Escape")setAddingCol(false);}}
                  placeholder="Nama kolom..."
                  style={{ width:"100%",background:dark?"#1e293b":"#f8fafc",border:`1px solid ${dark?"#334155":"#e2e8f0"}`,borderRadius:8,color:dark?"#e2e8f0":"#1e293b",fontSize:13,padding:"8px 11px",fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10 }}
                />
                <div style={{ display:"flex",gap:8 }}>
                  <button onClick={handleAddColumn} style={{ background:"#6366f1",border:"none",borderRadius:7,color:"#fff",fontWeight:700,fontSize:13,padding:"6px 16px",cursor:"pointer" }}>Tambah</button>
                  <button onClick={()=>{setAddingCol(false);setNewColName("");}} style={{ background:dark?"#1e293b":"#fff",border:`1px solid ${dark?"#334155":"#e2e8f0"}`,borderRadius:7,color:dark?"#94a3b8":"#64748b",fontSize:13,padding:"6px 14px",cursor:"pointer" }}>Batal</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>setAddingCol(true)} style={{ background:dark?"rgba(17,24,39,0.7)":"rgba(255,255,255,0.8)",border:`2px dashed ${dark?"#334155":"#cbd5e1"}`,borderRadius:14,color:dark?"#475569":"#94a3b8",fontSize:13,padding:"18px",cursor:"pointer",width:"100%",fontFamily:"inherit",transition:"all 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.color="#6366f1";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?"#334155":"#cbd5e1";e.currentTarget.style.color=dark?"#475569":"#94a3b8";}}
              >+ Tambah Kolom</button>
            )}
          </div>
        </div>
      </div>

      {editCard && <CardModal card={editCard} colId={editColId} columns={columns} onSave={handleSaveEdit} onClose={()=>{setEditCard(null);setEditColId(null);}} dark={dark}/>}
    </>
  );
}
