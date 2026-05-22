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
  async getColumns() { const r = await fetch(`${SUPABASE_URL}/rest/v1/columns?select=*&order=position.asc`, { headers }); return r.json(); },
  async getCards() { const r = await fetch(`${SUPABASE_URL}/rest/v1/cards?select=*&order=position.asc`, { headers }); return r.json(); },
  async getMembers() { const r = await fetch(`${SUPABASE_URL}/rest/v1/members?select=*&order=created_at.asc`, { headers }); return r.json(); },
  async getLabels() { const r = await fetch(`${SUPABASE_URL}/rest/v1/labels?select=*&order=created_at.asc`, { headers }); return r.json(); },
  async insertColumn(col) { await fetch(`${SUPABASE_URL}/rest/v1/columns`, { method:"POST", headers, body:JSON.stringify(col) }); },
  async updateColumn(id, data) { await fetch(`${SUPABASE_URL}/rest/v1/columns?id=eq.${id}`, { method:"PATCH", headers, body:JSON.stringify(data) }); },
  async deleteColumn(id) { await fetch(`${SUPABASE_URL}/rest/v1/columns?id=eq.${id}`, { method:"DELETE", headers }); },
  async insertCard(card) { await fetch(`${SUPABASE_URL}/rest/v1/cards`, { method:"POST", headers, body:JSON.stringify(card) }); },
  async updateCard(id, data) { await fetch(`${SUPABASE_URL}/rest/v1/cards?id=eq.${id}`, { method:"PATCH", headers, body:JSON.stringify(data) }); },
  async deleteCard(id) { await fetch(`${SUPABASE_URL}/rest/v1/cards?id=eq.${id}`, { method:"DELETE", headers }); },
  async insertMember(m) { await fetch(`${SUPABASE_URL}/rest/v1/members`, { method:"POST", headers, body:JSON.stringify(m) }); },
  async updateMember(id, data) { await fetch(`${SUPABASE_URL}/rest/v1/members?id=eq.${id}`, { method:"PATCH", headers, body:JSON.stringify(data) }); },
  async deleteMember(id) { await fetch(`${SUPABASE_URL}/rest/v1/members?id=eq.${id}`, { method:"DELETE", headers }); },
  async insertLabel(l) { await fetch(`${SUPABASE_URL}/rest/v1/labels`, { method:"POST", headers, body:JSON.stringify(l) }); },
  async updateLabel(id, data) { await fetch(`${SUPABASE_URL}/rest/v1/labels?id=eq.${id}`, { method:"PATCH", headers, body:JSON.stringify(data) }); },
  async deleteLabel(id) { await fetch(`${SUPABASE_URL}/rest/v1/labels?id=eq.${id}`, { method:"DELETE", headers }); },
};

const PRIORITIES = [
  { label:"Tinggi", color:"#ef4444", bg:"#fef2f2", darkBg:"#3f1a1a" },
  { label:"Sedang", color:"#f59e0b", bg:"#fffbeb", darkBg:"#3f2d00" },
  { label:"Rendah", color:"#22c55e", bg:"#f0fdf4", darkBg:"#0d2e1a" },
];
const COL_COLORS = ["#6366f1","#f59e0b","#3b82f6","#22c55e","#ec4899","#14b8a6"];
const AVATAR_COLORS = ["#6366f1","#ec4899","#0ea5e9","#f97316","#22c55e","#8b5cf6","#14b8a6","#f43f5e"];
const LABEL_COLORS = ["#6366f1","#ec4899","#0ea5e9","#f97316","#ef4444","#8b5cf6","#14b8a6","#22c55e","#f43f5e","#eab308"];
const ROLES = ["Developer","Designer","Manager","QA","DevOps","Marketing","Lainnya"];

function generateId() { return "id-"+Math.random().toString(36).substr(2,9); }
function getInitials(n) { return n ? n.split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2) : "?"; }
function getPriority(l) { return PRIORITIES.find(p=>p.label===l)||PRIORITIES[1]; }
function hexToRgba(hex, a) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

function Avatar({ name, size=26, color="#6366f1", dark }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:hexToRgba(color, dark?0.22:0.12),
      border:`1.5px solid ${color}44`, color,
      fontSize:size*0.38, fontWeight:700,
      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
    }}>{getInitials(name)}</div>
  );
}

function LabelBadge({ label, labels, dark }) {
  const l = labels.find(x=>x.name===label) || { color:"#6366f1", bg:"#eef2ff", name:label };
  const bg = dark ? hexToRgba(l.color, 0.18) : (l.bg || hexToRgba(l.color, 0.1));
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      background:bg, color:l.color,
      border:`1px solid ${l.color}33`, borderRadius:5,
      fontSize:10, fontWeight:700, padding:"2px 7px",
      letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap",
    }}>{label}</span>
  );
}

function PriorityDot({ priority }) {
  const p = getPriority(priority);
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, color:p.color, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:p.color, display:"inline-block", flexShrink:0 }} />
      {priority}
    </span>
  );
}

// ============================================================
// SETTINGS MODAL
// ============================================================
function SettingsModal({ members, labels, onClose, onAddMember, onEditMember, onDeleteMember, onAddLabel, onEditLabel, onDeleteLabel, dark }) {
  const [tab, setTab] = useState("members");
  const [memberMode, setMemberMode] = useState("list");
  const [labelMode, setLabelMode] = useState("list");
  const [editTarget, setEditTarget] = useState(null);
  const [memberForm, setMemberForm] = useState({ name:"", role:"Developer", color:AVATAR_COLORS[0] });
  const [labelForm, setLabelForm] = useState({ name:"", color:LABEL_COLORS[0] });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [err, setErr] = useState("");

  const bg = dark?"#111827":"#fff";
  const border = dark?"#1e293b":"#e5e7eb";
  const textC = dark?"#f1f5f9":"#1e293b";
  const muted = dark?"#64748b":"#94a3b8";
  const rowBg = dark?"#161d2e":"#f8fafc";
  const inp = {
    width:"100%", background:dark?"#1e293b":"#f8fafc",
    border:`1px solid ${dark?"#334155":"#e2e8f0"}`,
    borderRadius:8, color:textC, fontSize:13, padding:"8px 11px",
    fontFamily:"inherit", outline:"none", boxSizing:"border-box", display:"block",
  };

  const resetMember = () => { setMemberMode("list"); setEditTarget(null); setErr(""); };
  const resetLabel = () => { setLabelMode("list"); setEditTarget(null); setErr(""); };

  const handleSaveMember = () => {
    if (!memberForm.name.trim()) { setErr("Nama tidak boleh kosong!"); return; }
    if (memberMode==="add") onAddMember({ id:generateId(), name:memberForm.name.trim(), role:memberForm.role, color:memberForm.color });
    else onEditMember(editTarget.id, { name:memberForm.name.trim(), role:memberForm.role, color:memberForm.color });
    resetMember();
  };

  const handleSaveLabel = () => {
    if (!labelForm.name.trim()) { setErr("Nama label tidak boleh kosong!"); return; }
    const bg = hexToRgba(labelForm.color, 0.1);
    if (labelMode==="add") onAddLabel({ id:generateId(), name:labelForm.name.trim(), color:labelForm.color, bg });
    else onEditLabel(editTarget.id, { name:labelForm.name.trim(), color:labelForm.color, bg });
    resetLabel();
  };

  const tabBtn = (id, icon, label) => (
    <button onClick={()=>{ setTab(id); resetMember(); resetLabel(); }} style={{
      flex:1, padding:"10px 6px", border:"none", borderRadius:9,
      background: tab===id ? "#6366f1" : "none",
      color: tab===id ? "#fff" : muted,
      fontWeight: tab===id ? 700 : 500,
      fontSize:13, cursor:"pointer", fontFamily:"inherit",
      display:"flex", alignItems:"center", justifyContent:"center", gap:5,
      transition:"all 0.15s",
    }}>{icon} {label}</button>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:bg, borderRadius:16, width:"100%", maxWidth:480,
        maxHeight:"90vh", display:"flex", flexDirection:"column",
        boxShadow:"0 20px 60px rgba(0,0,0,0.25)", border:`1px solid ${border}`,
      }}>
        {/* Header */}
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {(memberMode!=="list"||labelMode!=="list") && (
              <button onClick={()=>{ resetMember(); resetLabel(); }} style={{ background:"none", border:"none", color:muted, cursor:"pointer", fontSize:20, lineHeight:1, padding:"0 4px 0 0" }}>←</button>
            )}
            <h3 style={{ margin:0, color:textC, fontSize:16, fontWeight:700 }}>
              {tab==="members"
                ? (memberMode==="list"?"👥 Kelola Anggota":memberMode==="add"?"➕ Tambah Anggota":"✏️ Edit Anggota")
                : (labelMode==="list"?"🏷 Kelola Label":labelMode==="add"?"➕ Tambah Label":"✏️ Edit Label")
              }
            </h3>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, color:muted, cursor:"pointer", lineHeight:1 }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ padding:"10px 16px", borderBottom:`1px solid ${border}`, display:"flex", gap:6, background:dark?"#0f172a":"#f8fafc", flexShrink:0 }}>
          {tabBtn("members","👥","Anggota")}
          {tabBtn("labels","🏷","Label")}
        </div>

        {/* Content */}
        <div style={{ overflowY:"auto", flex:1, padding:"16px 20px" }}>

          {/* ===== MEMBERS ===== */}
          {tab==="members" && memberMode==="list" && (
            <>
              <button onClick={()=>{ setMemberForm({name:"",role:"Developer",color:AVATAR_COLORS[0]}); setErr(""); setMemberMode("add"); }} style={{
                width:"100%", background:"#6366f1", border:"none", borderRadius:10,
                color:"#fff", fontWeight:700, fontSize:14, padding:"11px",
                cursor:"pointer", marginBottom:14, fontFamily:"inherit",
              }}>+ Tambah Anggota Baru</button>

              {members.length===0 ? (
                <div style={{ textAlign:"center", padding:"30px 0", color:muted, fontSize:13 }}>Belum ada anggota.</div>
              ) : members.map(m => (
                <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 13px", background:rowBg, border:`1px solid ${border}`, borderRadius:10, marginBottom:8 }}>
                  <Avatar name={m.name} size={38} color={m.color} dark={dark} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:textC, fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
                    <div style={{ color:muted, fontSize:11, marginTop:2 }}>{m.role}</div>
                  </div>
                  <div style={{ width:11, height:11, borderRadius:"50%", background:m.color, border:"2px solid white", boxShadow:"0 0 0 1px #e2e8f0", flexShrink:0 }} />
                  <button onClick={()=>{ setEditTarget(m); setMemberForm({name:m.name,role:m.role,color:m.color}); setErr(""); setMemberMode("edit"); }} style={{ background:dark?"#1e293b":"#eef2ff", border:`1px solid ${dark?"#334155":"#c7d2fe"}`, borderRadius:7, color:"#6366f1", fontSize:12, fontWeight:600, padding:"5px 11px", cursor:"pointer", whiteSpace:"nowrap" }}>Edit</button>
                  {confirmDelete===m.id ? (
                    <div style={{ display:"flex", gap:5 }}>
                      <button onClick={()=>{ onDeleteMember(m.id); setConfirmDelete(null); }} style={{ background:"#ef4444", border:"none", borderRadius:7, color:"#fff", fontSize:12, fontWeight:700, padding:"5px 10px", cursor:"pointer" }}>Ya</button>
                      <button onClick={()=>setConfirmDelete(null)} style={{ background:dark?"#1e293b":"#f1f5f9", border:`1px solid ${border}`, borderRadius:7, color:muted, fontSize:12, padding:"5px 10px", cursor:"pointer" }}>Batal</button>
                    </div>
                  ) : (
                    <button onClick={()=>setConfirmDelete(m.id)} style={{ background:dark?"#3f1a1a":"#fef2f2", border:`1px solid ${dark?"#dc2626":"#fca5a5"}`, borderRadius:7, color:"#ef4444", fontSize:12, fontWeight:600, padding:"5px 11px", cursor:"pointer", whiteSpace:"nowrap" }}>Hapus</button>
                  )}
                </div>
              ))}
            </>
          )}

          {tab==="members" && (memberMode==="add"||memberMode==="edit") && (
            <div>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:18 }}>
                <Avatar name={memberForm.name||"?"} size={64} color={memberForm.color} dark={dark} />
              </div>
              {err && <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, color:"#ef4444", fontSize:12, padding:"8px 12px", marginBottom:12 }}>{err}</div>}
              <label style={{ fontSize:12, color:muted, fontWeight:600, display:"block", marginBottom:4 }}>Nama Lengkap *</label>
              <input value={memberForm.name} onChange={e=>setMemberForm({...memberForm,name:e.target.value})} placeholder="Contoh: Budi Santoso" style={{...inp,marginBottom:12}} />
              <label style={{ fontSize:12, color:muted, fontWeight:600, display:"block", marginBottom:4 }}>Jabatan / Role</label>
              <select value={memberForm.role} onChange={e=>setMemberForm({...memberForm,role:e.target.value})} style={{...inp,marginBottom:14}}>
                {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
              <label style={{ fontSize:12, color:muted, fontWeight:600, display:"block", marginBottom:8 }}>Warna Avatar</label>
              <div style={{ display:"flex", gap:9, marginBottom:22, flexWrap:"wrap" }}>
                {AVATAR_COLORS.map(c=>(
                  <button key={c} onClick={()=>setMemberForm({...memberForm,color:c})} style={{
                    width:30, height:30, borderRadius:"50%", background:c, border:"none", cursor:"pointer",
                    boxShadow: memberForm.color===c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
                    transition:"all 0.15s",
                  }} />
                ))}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={resetMember} style={{ flex:1, background:dark?"#1e293b":"#fff", border:`1px solid ${border}`, borderRadius:9, color:muted, fontSize:13, padding:"10px", cursor:"pointer", fontFamily:"inherit" }}>Batal</button>
                <button onClick={handleSaveMember} style={{ flex:2, background:"#6366f1", border:"none", borderRadius:9, color:"#fff", fontWeight:700, fontSize:13, padding:"10px", cursor:"pointer", fontFamily:"inherit" }}>
                  {memberMode==="add"?"Tambah Anggota":"Simpan Perubahan"}
                </button>
              </div>
            </div>
          )}

          {/* ===== LABELS ===== */}
          {tab==="labels" && labelMode==="list" && (
            <>
              <button onClick={()=>{ setLabelForm({name:"",color:LABEL_COLORS[0]}); setErr(""); setLabelMode("add"); }} style={{
                width:"100%", background:"#6366f1", border:"none", borderRadius:10,
                color:"#fff", fontWeight:700, fontSize:14, padding:"11px",
                cursor:"pointer", marginBottom:14, fontFamily:"inherit",
              }}>+ Tambah Label Baru</button>

              {labels.length===0 ? (
                <div style={{ textAlign:"center", padding:"30px 0", color:muted, fontSize:13 }}>Belum ada label.</div>
              ) : labels.map(l => (
                <div key={l.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 13px", background:rowBg, border:`1px solid ${border}`, borderRadius:10, marginBottom:8 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:hexToRgba(l.color,0.15), border:`2px solid ${l.color}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:14, height:14, borderRadius:3, background:l.color }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <span style={{ display:"inline-flex", alignItems:"center", background:hexToRgba(l.color,0.12), color:l.color, border:`1px solid ${l.color}33`, borderRadius:5, fontSize:11, fontWeight:700, padding:"2px 8px", letterSpacing:"0.06em", textTransform:"uppercase" }}>{l.name}</span>
                  </div>
                  <button onClick={()=>{ setEditTarget(l); setLabelForm({name:l.name,color:l.color}); setErr(""); setLabelMode("edit"); }} style={{ background:dark?"#1e293b":"#eef2ff", border:`1px solid ${dark?"#334155":"#c7d2fe"}`, borderRadius:7, color:"#6366f1", fontSize:12, fontWeight:600, padding:"5px 11px", cursor:"pointer", whiteSpace:"nowrap" }}>Edit</button>
                  {confirmDelete===l.id ? (
                    <div style={{ display:"flex", gap:5 }}>
                      <button onClick={()=>{ onDeleteLabel(l.id); setConfirmDelete(null); }} style={{ background:"#ef4444", border:"none", borderRadius:7, color:"#fff", fontSize:12, fontWeight:700, padding:"5px 10px", cursor:"pointer" }}>Ya</button>
                      <button onClick={()=>setConfirmDelete(null)} style={{ background:dark?"#1e293b":"#f1f5f9", border:`1px solid ${border}`, borderRadius:7, color:muted, fontSize:12, padding:"5px 10px", cursor:"pointer" }}>Batal</button>
                    </div>
                  ) : (
                    <button onClick={()=>setConfirmDelete(l.id)} style={{ background:dark?"#3f1a1a":"#fef2f2", border:`1px solid ${dark?"#dc2626":"#fca5a5"}`, borderRadius:7, color:"#ef4444", fontSize:12, fontWeight:600, padding:"5px 11px", cursor:"pointer", whiteSpace:"nowrap" }}>Hapus</button>
                  )}
                </div>
              ))}
            </>
          )}

          {tab==="labels" && (labelMode==="add"||labelMode==="edit") && (
            <div>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:18 }}>
                <span style={{ display:"inline-flex", alignItems:"center", background:hexToRgba(labelForm.color,0.12), color:labelForm.color, border:`1px solid ${labelForm.color}33`, borderRadius:7, fontSize:15, fontWeight:700, padding:"6px 18px", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  {labelForm.name || "Preview"}
                </span>
              </div>
              {err && <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, color:"#ef4444", fontSize:12, padding:"8px 12px", marginBottom:12 }}>{err}</div>}
              <label style={{ fontSize:12, color:muted, fontWeight:600, display:"block", marginBottom:4 }}>Nama Label *</label>
              <input value={labelForm.name} onChange={e=>setLabelForm({...labelForm,name:e.target.value})} placeholder="Contoh: Frontend" style={{...inp,marginBottom:14}} />
              <label style={{ fontSize:12, color:muted, fontWeight:600, display:"block", marginBottom:8 }}>Warna Label</label>
              <div style={{ display:"flex", gap:9, marginBottom:22, flexWrap:"wrap" }}>
                {LABEL_COLORS.map(c=>(
                  <button key={c} onClick={()=>setLabelForm({...labelForm,color:c})} style={{
                    width:30, height:30, borderRadius:7, background:c, border:"none", cursor:"pointer",
                    boxShadow: labelForm.color===c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
                    transition:"all 0.15s",
                  }} />
                ))}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={resetLabel} style={{ flex:1, background:dark?"#1e293b":"#fff", border:`1px solid ${border}`, borderRadius:9, color:muted, fontSize:13, padding:"10px", cursor:"pointer", fontFamily:"inherit" }}>Batal</button>
                <button onClick={handleSaveLabel} style={{ flex:2, background:"#6366f1", border:"none", borderRadius:9, color:"#fff", fontWeight:700, fontSize:13, padding:"10px", cursor:"pointer", fontFamily:"inherit" }}>
                  {labelMode==="add"?"Tambah Label":"Simpan Perubahan"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CARD ITEM
// ============================================================
function CardItem({ card, colId, onDelete, onEdit, onDragStart, dark, members, labels }) {
  const [hover, setHover] = useState(false);
  const member = members.find(m=>m.name===card.assignee);
  return (
    <div draggable onDragStart={e=>onDragStart(e,card.id,colId)}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background: dark?(hover?"#1e2433":"#161d2e"):(hover?"#f8faff":"#fff"),
        border:`1px solid ${dark?(hover?"#334155":"#232b3e"):(hover?"#c7d2fe":"#e5e7eb")}`,
        borderLeft:`3px solid ${getPriority(card.priority).color}`,
        borderRadius:10, padding:"11px 13px", marginBottom:9, cursor:"grab",
        transition:"all 0.15s", boxShadow:hover?"0 2px 12px rgba(99,102,241,0.1)":"0 1px 3px rgba(0,0,0,0.06)",
      }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7, gap:8 }}>
        <LabelBadge label={card.label} labels={labels} dark={dark} />
        <PriorityDot priority={card.priority} />
      </div>
      <div style={{ color:dark?"#e2e8f0":"#1e293b", fontSize:13.5, lineHeight:1.5, fontWeight:500, marginBottom:card.assignee?9:0 }}>{card.text}</div>
      {card.assignee && (
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Avatar name={card.assignee} size={22} color={member?.color||"#6366f1"} dark={dark} />
          <span style={{ fontSize:11, color:dark?"#94a3b8":"#64748b" }}>{card.assignee}</span>
        </div>
      )}
      {hover && (
        <div style={{ display:"flex", gap:6, marginTop:10, paddingTop:9, borderTop:`1px solid ${dark?"#1e293b":"#f1f5f9"}` }}>
          <button onClick={()=>onEdit(card,colId)} style={{ background:dark?"#1e1b4b":"#eef2ff", border:`1px solid ${dark?"#4338ca":"#c7d2fe"}`, borderRadius:6, color:"#6366f1", fontSize:11, fontWeight:600, padding:"4px 11px", cursor:"pointer" }}>✏ Edit</button>
          <button onClick={()=>onDelete(card.id)} style={{ background:dark?"#3f1a1a":"#fef2f2", border:`1px solid ${dark?"#dc2626":"#fca5a5"}`, borderRadius:6, color:"#ef4444", fontSize:11, fontWeight:600, padding:"4px 11px", cursor:"pointer" }}>🗑 Hapus</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COLUMN
// ============================================================
function Column({ col, cards, onAddCard, onDeleteCard, onEditCard, onDragStart, onDrop, onDragOver, onDeleteColumn, onRenameColumn, filterFn, dark, members, labels }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ text:"", label:"", priority:"Sedang", assignee:"" });
  const [dragOver, setDragOver] = useState(false);
  const [editing, setEditing] = useState(false);
  const [titleVal, setTitleVal] = useState(col.title);
  const filtered = cards.filter(filterFn);

  useEffect(()=>{ if(labels.length>0 && !form.label) setForm(f=>({...f, label:labels[0].name})); },[labels]);
  useEffect(()=>{ if(members.length>0 && !form.assignee) setForm(f=>({...f, assignee:members[0].name})); },[members]);

  const inp = {
    width:"100%", background:dark?"#1e293b":"#fff", border:`1px solid ${dark?"#334155":"#e2e8f0"}`,
    borderRadius:7, color:dark?"#e2e8f0":"#1e293b", fontSize:13, padding:"7px 10px",
    fontFamily:"inherit", outline:"none", boxSizing:"border-box",
  };

  return (
    <div onDragOver={e=>{e.preventDefault();setDragOver(true);onDragOver(e);}} onDragLeave={()=>setDragOver(false)}
      onDrop={e=>{setDragOver(false);onDrop(e,col.id);}}
      style={{
        minWidth:270, width:270, flexShrink:0,
        background:dark?(dragOver?"#1a2236":"#111827"):(dragOver?"#f0f4ff":"#f8fafc"),
        border:`1.5px solid ${dragOver?col.color+"66":(dark?"#232b3e":"#e5e7eb")}`,
        borderRadius:14, padding:"13px 11px 11px", display:"flex", flexDirection:"column",
        transition:"all 0.15s", boxShadow:dark?"0 2px 16px rgba(0,0,0,0.3)":"0 1px 4px rgba(0,0,0,0.06)",
        maxHeight:"calc(100vh - 90px)",
      }}>
      <div style={{ display:"flex", alignItems:"center", marginBottom:12, gap:8 }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background:col.color, flexShrink:0 }} />
        {editing ? (
          <input autoFocus value={titleVal} onChange={e=>setTitleVal(e.target.value)}
            onBlur={()=>{onRenameColumn(col.id,titleVal);setEditing(false);}}
            onKeyDown={e=>{if(e.key==="Enter"){onRenameColumn(col.id,titleVal);setEditing(false);}}}
            style={{...inp,fontSize:13,fontWeight:700,flex:1,padding:"2px 7px"}} />
        ) : (
          <span onDoubleClick={()=>setEditing(true)} title="Double-click untuk rename"
            style={{ color:dark?"#f1f5f9":"#1e293b", fontWeight:700, fontSize:13, flex:1, cursor:"default", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {col.title}
          </span>
        )}
        <span style={{ background:col.color+"20", color:col.color, borderRadius:20, fontSize:11, fontWeight:700, padding:"1px 7px", flexShrink:0 }}>{filtered.length}</span>
        <button onClick={()=>onDeleteColumn(col.id)} style={{ background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:16, padding:"0", lineHeight:1, flexShrink:0 }}>×</button>
      </div>

      <div style={{ overflowY:"auto", flex:1 }}>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:"18px 0", color:dark?"#475569":"#cbd5e1", fontSize:12 }}>Tidak ada kartu</div>}
        {filtered.map(card=>(
          <CardItem key={card.id} card={card} colId={col.id}
            onDelete={onDeleteCard} onEdit={onEditCard} onDragStart={onDragStart}
            dark={dark} members={members} labels={labels} />
        ))}
      </div>

      {adding ? (
        <div style={{ marginTop:10, background:dark?"#161d2e":"#fff", border:`1px solid ${dark?"#334155":"#e2e8f0"}`, borderRadius:10, padding:11 }}>
          <textarea autoFocus value={form.text} onChange={e=>setForm({...form,text:e.target.value})}
            placeholder="Deskripsi tugas..." style={{...inp,resize:"vertical",minHeight:65,marginBottom:8}}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();if(form.text.trim()){onAddCard(col.id,form);setForm({text:"",label:labels[0]?.name||"",priority:"Sedang",assignee:members[0]?.name||""});setAdding(false);}}}}
          />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
            <select value={form.label} onChange={e=>setForm({...form,label:e.target.value})} style={{...inp,fontSize:12}}>
              {labels.map(l=><option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
            <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} style={{...inp,fontSize:12}}>
              {PRIORITIES.map(p=><option key={p.label} value={p.label}>{p.label}</option>)}
            </select>
            <select value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})} style={{...inp,fontSize:12,gridColumn:"span 2"}}>
              <option value="">-- Tanpa Assignee --</option>
              {members.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:7 }}>
            <button onClick={()=>{if(form.text.trim()){onAddCard(col.id,form);setForm({text:"",label:labels[0]?.name||"",priority:"Sedang",assignee:members[0]?.name||""});setAdding(false);}}} style={{ background:col.color, border:"none", borderRadius:7, color:"#fff", fontWeight:700, fontSize:13, padding:"7px 16px", cursor:"pointer" }}>Tambah</button>
            <button onClick={()=>setAdding(false)} style={{ background:dark?"#1e293b":"#fff", border:`1px solid ${dark?"#334155":"#e2e8f0"}`, borderRadius:7, color:dark?"#94a3b8":"#64748b", fontSize:13, padding:"7px 12px", cursor:"pointer" }}>Batal</button>
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

// ============================================================
// CARD MODAL (Edit)
// ============================================================
function CardModal({ card, colId, columns, onSave, onClose, dark, members, labels }) {
  const [form, setForm] = useState({
    text:card.text, label:card.label||labels[0]?.name||"",
    priority:card.priority||"Sedang", assignee:card.assignee||"",
    targetCol:colId,
  });
  const inp = {
    width:"100%", background:dark?"#1e293b":"#f8fafc", border:`1px solid ${dark?"#334155":"#e2e8f0"}`,
    borderRadius:8, color:dark?"#e2e8f0":"#1e293b", fontSize:13, padding:"8px 11px",
    fontFamily:"inherit", outline:"none", boxSizing:"border-box", display:"block",
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:dark?"#111827":"#fff", borderRadius:16, padding:24, width:"100%", maxWidth:420, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", border:`1px solid ${dark?"#1e293b":"#e5e7eb"}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ margin:0, color:dark?"#f1f5f9":"#1e293b", fontSize:16, fontWeight:700 }}>✏️ Edit Kartu</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, color:"#94a3b8", cursor:"pointer" }}>×</button>
        </div>
        <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:4 }}>Deskripsi</label>
        <textarea value={form.text} onChange={e=>setForm({...form,text:e.target.value})} style={{...inp,resize:"vertical",minHeight:80,marginBottom:12}} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          <div>
            <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:4 }}>Label</label>
            <select value={form.label} onChange={e=>setForm({...form,label:e.target.value})} style={inp}>
              {labels.map(l=><option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:4 }}>Prioritas</label>
            <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} style={inp}>
              {PRIORITIES.map(p=><option key={p.label} value={p.label}>{p.label}</option>)}
            </select>
          </div>
        </div>
        <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:4 }}>Assignee</label>
        <select value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})} style={{...inp,marginBottom:12}}>
          <option value="">-- Tanpa Assignee --</option>
          {members.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}
        </select>
        <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:4 }}>Pindah ke Kolom</label>
        <select value={form.targetCol} onChange={e=>setForm({...form,targetCol:e.target.value})} style={{...inp,marginBottom:20}}>
          {columns.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ background:dark?"#1e293b":"#fff", border:`1px solid ${dark?"#334155":"#e2e8f0"}`, borderRadius:8, color:dark?"#94a3b8":"#64748b", fontSize:13, padding:"8px 16px", cursor:"pointer" }}>Batal</button>
          <button onClick={()=>onSave(card.id,colId,form)} style={{ background:"#6366f1", border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:13, padding:"8px 20px", cursor:"pointer" }}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  const [members, setMembers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dark, setDark] = useState(()=>{ try{return localStorage.getItem("dt-dark")==="true";}catch{return false;} });
  const [search, setSearch] = useState("");
  const [filterLabel, setFilterLabel] = useState("Semua");
  const [filterPriority, setFilterPriority] = useState("Semua");
  const [filterMember, setFilterMember] = useState("Semua");
  const [dragCardId, setDragCardId] = useState(null);
  const [dragFromCol, setDragFromCol] = useState(null);
  const [editCard, setEditCard] = useState(null);
  const [editColId, setEditColId] = useState(null);
  const [addingCol, setAddingCol] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(()=>{ loadData(); },[]);
  useEffect(()=>{ localStorage.setItem("dt-dark",dark); document.body.style.background=dark?"#0a0f1e":"#f1f5f9"; },[dark]);

  async function loadData() {
    try {
      setLoading(true); setError(null);
      const [cols,cds,mbs,lbs] = await Promise.all([db.getColumns(),db.getCards(),db.getMembers(),db.getLabels()]);
      if(cols.error||cds.error) throw new Error(cols.error?.message||cds.error?.message);
      setColumns(cols); setCards(cds);
      setMembers(Array.isArray(mbs)?mbs:[]); setLabels(Array.isArray(lbs)?lbs:[]);
    } catch(e) { setError("Gagal koneksi ke database."); }
    finally { setLoading(false); }
  }

  const sync = async (fn) => { setSyncing(true); try { await fn(); } finally { setSyncing(false); } };

  const filterFn = (card) => {
    const q = search.toLowerCase();
    if(q && !card.text.toLowerCase().includes(q) && !(card.assignee||"").toLowerCase().includes(q)) return false;
    if(filterLabel!=="Semua" && card.label!==filterLabel) return false;
    if(filterPriority!=="Semua" && card.priority!==filterPriority) return false;
    if(filterMember!=="Semua" && card.assignee!==filterMember) return false;
    return true;
  };
  const activeFilters = [filterLabel,filterPriority,filterMember].filter(f=>f!=="Semua").length+(search?1:0);

  // Card handlers
  const handleAddCard = async (colId,form) => {
    const card = { id:generateId(), column_id:colId, position:cards.filter(c=>c.column_id===colId).length, ...form };
    setCards(prev=>[...prev,card]);
    await sync(()=>db.insertCard(card));
  };
  const handleDeleteCard = async (cardId) => { setCards(prev=>prev.filter(c=>c.id!==cardId)); await sync(()=>db.deleteCard(cardId)); };
  const handleSaveEdit = async (cardId,fromColId,form) => {
    const { targetCol,...cardData } = form;
    setCards(prev=>prev.map(c=>c.id===cardId?{...c,...cardData,column_id:targetCol}:c));
    await sync(()=>db.updateCard(cardId,{...cardData,column_id:targetCol}));
    setEditCard(null); setEditColId(null);
  };
  const handleDragStart = (e,cardId,colId) => { setDragCardId(cardId); setDragFromCol(colId); };
  const handleDrop = async (e,targetColId) => {
    if(!dragCardId||dragFromCol===targetColId) return;
    setCards(prev=>prev.map(c=>c.id===dragCardId?{...c,column_id:targetColId}:c));
    await sync(()=>db.updateCard(dragCardId,{column_id:targetColId}));
    setDragCardId(null); setDragFromCol(null);
  };

  // Column handlers
  const handleAddColumn = async () => {
    if(!newColName.trim()) return;
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
  const handleRenameColumn = async (colId,title) => {
    setColumns(prev=>prev.map(c=>c.id===colId?{...c,title}:c));
    await sync(()=>db.updateColumn(colId,{title}));
  };

  // Member handlers
  const handleAddMember = async (m) => { setMembers(prev=>[...prev,m]); await sync(()=>db.insertMember(m)); };
  const handleEditMember = async (id,data) => { setMembers(prev=>prev.map(m=>m.id===id?{...m,...data}:m)); await sync(()=>db.updateMember(id,data)); };
  const handleDeleteMember = async (id) => { setMembers(prev=>prev.filter(m=>m.id!==id)); await sync(()=>db.deleteMember(id)); };

  // Label handlers
  const handleAddLabel = async (l) => { setLabels(prev=>[...prev,l]); await sync(()=>db.insertLabel(l)); };
  const handleEditLabel = async (id,data) => { setLabels(prev=>prev.map(l=>l.id===id?{...l,...data}:l)); await sync(()=>db.updateLabel(id,data)); };
  const handleDeleteLabel = async (id) => { setLabels(prev=>prev.filter(l=>l.id!==id)); await sync(()=>db.deleteLabel(id)); };

  // Export CSV
  const exportCSV = () => {
    const rows = [["Kolom","Tugas","Label","Prioritas","Assignee"]];
    columns.forEach(col=>{ cards.filter(c=>c.column_id===col.id).forEach(c=>{ rows.push([col.title,c.text,c.label,c.priority,c.assignee||"-"]); }); });
    const csv = rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="dailytask.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const bg = dark?"#0a0f1e":"#f1f5f9";
  const headerBg = dark?"rgba(17,24,39,0.97)":"#fff";
  const headerBorder = dark?"#1e293b":"#e5e7eb";
  const textPrimary = dark?"#f1f5f9":"#1e293b";
  const textMuted = dark?"#64748b":"#94a3b8";
  const inputBg = dark?"#1e293b":"#f8fafc";
  const inputBorder = dark?"#334155":"#e2e8f0";
  const selStyle = { background:inputBg, border:`1px solid ${inputBorder}`, borderRadius:7, color:textPrimary, fontSize:12, padding:"6px 10px", fontFamily:"inherit", outline:"none", cursor:"pointer", height:34 };
  const iconBtn = (onClick, icon, title, extra={}) => (
    <button onClick={onClick} title={title} style={{ background:inputBg, border:`1px solid ${inputBorder}`, borderRadius:7, color:textPrimary, fontSize:13, padding:"0 11px", cursor:"pointer", height:34, display:"flex", alignItems:"center", gap:5, fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0, ...extra }}>{icon}</button>
  );

  if(loading) return (
    <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #6366f1", borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }} />
      <span style={{ color:textMuted, fontSize:14 }}>Memuat data...</span>
    </div>
  );

  if(error) return (
    <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:dark?"#111827":"#fff", border:`1px solid ${dark?"#1e293b":"#e5e7eb"}`, borderRadius:16, padding:32, textAlign:"center", maxWidth:360, width:"100%" }}>
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

        /* MOBILE RESPONSIVE */
        @media(max-width:640px){
          .header-filters{ display:none !important; }
          .header-stats{ display:none !important; }
          .mobile-search-bar{ display:flex !important; }
          .board-wrap{ padding:12px 10px 80px !important; }
          .col-wrap{ min-width:82vw !important; width:82vw !important; }
          .bottom-nav{ display:flex !important; }
          .header-wrap{ padding:0 12px !important; }
          .header-right-btns .export-btn{ display:none !important; }
        }
        .mobile-search-bar{ display:none; }
        .bottom-nav{ display:none; }
      `}</style>

      <div style={{ minHeight:"100vh", background:bg, transition:"background 0.3s" }}>

        {/* ===== HEADER ===== */}
        <div className="header-wrap" style={{ background:headerBg, borderBottom:`1px solid ${headerBorder}`, padding:"0 16px", display:"flex", alignItems:"center", gap:8, height:54, position:"sticky", top:0, zIndex:100, boxShadow:dark?"0 1px 8px rgba(0,0,0,0.4)":"0 1px 4px rgba(0,0,0,0.05)" }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✅</div>
            <span style={{ color:textPrimary, fontWeight:700, fontSize:16, letterSpacing:"-0.3px" }}>Daily Task</span>
          </div>

          {/* Desktop filters */}
          <div className="header-filters" style={{ display:"flex", alignItems:"center", gap:6, marginLeft:8 }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:textMuted, fontSize:12 }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari..."
                style={{...selStyle,paddingLeft:26,width:150,fontSize:12}} />
            </div>
            <select value={filterLabel} onChange={e=>setFilterLabel(e.target.value)} style={selStyle}>
              <option value="Semua">🏷 Label</option>
              {labels.map(l=><option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
            <select value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} style={selStyle}>
              <option value="Semua">⚡ Prioritas</option>
              {PRIORITIES.map(p=><option key={p.label} value={p.label}>{p.label}</option>)}
            </select>
            <select value={filterMember} onChange={e=>setFilterMember(e.target.value)} style={selStyle}>
              <option value="Semua">👤 Anggota</option>
              {members.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
            {activeFilters>0 && (
              <button onClick={()=>{setSearch("");setFilterLabel("Semua");setFilterPriority("Semua");setFilterMember("Semua");}}
                style={{...selStyle,background:"#eef2ff",border:"1px solid #c7d2fe",color:"#6366f1",fontWeight:600}}>
                ✕ {activeFilters}
              </button>
            )}
          </div>

          {/* Stats desktop */}
          <div className="header-stats" style={{ display:"flex", alignItems:"center", gap:10, marginLeft:4 }}>
            <span style={{ color:"#6366f1", fontWeight:700, fontSize:13 }}>{cards.length}</span>
            <span style={{ color:textMuted, fontSize:12 }}>kartu</span>
            <span style={{ color:textMuted }}>·</span>
            <span style={{ color:"#22c55e", fontWeight:700, fontSize:13 }}>{columns.length}</span>
            <span style={{ color:textMuted, fontSize:12 }}>kolom</span>
          </div>

          <div className="header-right-btns" style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            {/* Sync */}
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              {syncing
                ? <div style={{ width:8,height:8,borderRadius:"50%",border:"1.5px solid #6366f1",borderTopColor:"transparent",animation:"spin 0.8s linear infinite" }}/>
                : <div style={{ width:7,height:7,borderRadius:"50%",background:"#22c55e" }}/>
              }
              <span style={{ fontSize:11, color:syncing?"#6366f1":"#22c55e", display:"block" }}>{syncing?"...":"✓"}</span>
            </div>
            {/* Mobile search toggle */}
            <button className="mobile-only" onClick={()=>setShowSearch(!showSearch)} style={{ ...selStyle, display:"none", padding:"0 10px" }}>🔍</button>
            <button className="export-btn" onClick={exportCSV} style={{...selStyle,display:"flex",alignItems:"center",gap:4}}>📤 <span style={{display:"block"}}>Export</span></button>
            {iconBtn(()=>setShowSettings(true),"⚙️ Pengaturan","Pengaturan")}
            {iconBtn(loadData,"🔄","Refresh")}
            {iconBtn(()=>setDark(!dark),dark?"☀️":"🌙",dark?"Light Mode":"Dark Mode")}
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mobile-search-bar" style={{ background:headerBg, borderBottom:`1px solid ${headerBorder}`, padding:"8px 12px", gap:6, flexDirection:"column" }}>
          <div style={{ display:"flex", gap:6 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Cari kartu..."
              style={{ flex:1, background:inputBg, border:`1px solid ${inputBorder}`, borderRadius:8, color:textPrimary, fontSize:13, padding:"7px 11px", fontFamily:"inherit", outline:"none" }} />
            {activeFilters>0 && (
              <button onClick={()=>{setSearch("");setFilterLabel("Semua");setFilterPriority("Semua");setFilterMember("Semua");}}
                style={{ background:"#eef2ff", border:"1px solid #c7d2fe", borderRadius:8, color:"#6366f1", fontWeight:700, fontSize:12, padding:"0 12px", cursor:"pointer" }}>
                ✕ Reset
              </button>
            )}
          </div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
            <select value={filterLabel} onChange={e=>setFilterLabel(e.target.value)} style={{...selStyle,fontSize:11,height:30,flexShrink:0}}>
              <option value="Semua">🏷 Label</option>
              {labels.map(l=><option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
            <select value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} style={{...selStyle,fontSize:11,height:30,flexShrink:0}}>
              <option value="Semua">⚡ Prioritas</option>
              {PRIORITIES.map(p=><option key={p.label} value={p.label}>{p.label}</option>)}
            </select>
            <select value={filterMember} onChange={e=>setFilterMember(e.target.value)} style={{...selStyle,fontSize:11,height:30,flexShrink:0}}>
              <option value="Semua">👤 Anggota</option>
              {members.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </div>
        </div>

        {/* ===== BOARD ===== */}
        <div className="board-wrap" style={{ display:"flex", gap:12, padding:"16px 16px 40px", overflowX:"auto", alignItems:"flex-start", minHeight:"calc(100vh - 54px)" }}>
          {columns.map(col=>(
            <Column key={col.id} col={col}
              cards={cards.filter(c=>c.column_id===col.id)}
              filterFn={filterFn}
              onAddCard={handleAddCard} onDeleteCard={handleDeleteCard}
              onEditCard={(card,colId)=>{setEditCard(card);setEditColId(colId);}}
              onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={e=>e.preventDefault()}
              onDeleteColumn={handleDeleteColumn} onRenameColumn={handleRenameColumn}
              dark={dark} members={members} labels={labels}
            />
          ))}

          {/* Add Column */}
          <div style={{ minWidth:240, flexShrink:0 }}>
            {addingCol ? (
              <div style={{ background:dark?"#111827":"#fff", border:`1px solid ${dark?"#1e293b":"#e5e7eb"}`, borderRadius:14, padding:13 }}>
                <input autoFocus value={newColName} onChange={e=>setNewColName(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter")handleAddColumn();if(e.key==="Escape")setAddingCol(false);}}
                  placeholder="Nama kolom..."
                  style={{ width:"100%",background:dark?"#1e293b":"#f8fafc",border:`1px solid ${dark?"#334155":"#e2e8f0"}`,borderRadius:8,color:dark?"#e2e8f0":"#1e293b",fontSize:13,padding:"8px 11px",fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10 }}
                />
                <div style={{ display:"flex",gap:8 }}>
                  <button onClick={handleAddColumn} style={{ background:"#6366f1",border:"none",borderRadius:7,color:"#fff",fontWeight:700,fontSize:13,padding:"6px 16px",cursor:"pointer" }}>Tambah</button>
                  <button onClick={()=>{setAddingCol(false);setNewColName("");}} style={{ background:dark?"#1e293b":"#fff",border:`1px solid ${dark?"#334155":"#e2e8f0"}`,borderRadius:7,color:dark?"#94a3b8":"#64748b",fontSize:13,padding:"6px 12px",cursor:"pointer" }}>Batal</button>
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

        {/* ===== MOBILE BOTTOM NAV ===== */}
        <div className="bottom-nav" style={{ position:"fixed", bottom:0, left:0, right:0, background:headerBg, borderTop:`1px solid ${headerBorder}`, padding:"8px 16px 16px", zIndex:100, alignItems:"center", justifyContent:"space-around", gap:8 }}>
          {[
            { icon:"🔄", label:"Refresh", action:loadData },
            { icon:"📤", label:"Export", action:exportCSV },
            { icon:"⚙️", label:"Setting", action:()=>setShowSettings(true) },
            { icon:dark?"☀️":"🌙", label:dark?"Light":"Dark", action:()=>setDark(!dark) },
          ].map(btn=>(
            <button key={btn.label} onClick={btn.action} style={{ background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", color:textMuted, fontSize:11, fontFamily:"inherit", padding:"4px 8px" }}>
              <span style={{ fontSize:20 }}>{btn.icon}</span>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {editCard && <CardModal card={editCard} colId={editColId} columns={columns} onSave={handleSaveEdit} onClose={()=>{setEditCard(null);setEditColId(null);}} dark={dark} members={members} labels={labels}/>}
      {showSettings && <SettingsModal members={members} labels={labels} onClose={()=>setShowSettings(false)} onAddMember={handleAddMember} onEditMember={handleEditMember} onDeleteMember={handleDeleteMember} onAddLabel={handleAddLabel} onEditLabel={handleEditLabel} onDeleteLabel={handleDeleteLabel} dark={dark}/>}
    </>
  );
}
