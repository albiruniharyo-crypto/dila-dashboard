import { useState } from "react";

const USERS = [
  { id: "master1", username: "koordinator.dila", password: "dila2026", role: "master", nama: "Dr. drh. Made Bagus Auriva Mataram, M.Sc", lab: null },
  { id: "koord_pa", username: "koord.pa", password: "pa2026", role: "koord_lab", nama: "Dr. drh. Ricadonna Raissa, M.Si", lab: "Patologi Anatomi" },
  { id: "koord_mv", username: "koord.mv", password: "mv2026", role: "koord_lab", nama: "drh. Ahmad Fauzi, M.Sc., Ph.D", lab: "Mikrobiologi" },
  { id: "koord_pv", username: "koord.pv", password: "pv2026", role: "koord_lab", nama: "drh. Ajeng Erika, M.Si", lab: "Parasitologi" },
  { id: "koord_pk", username: "koord.pk", password: "pk2026", role: "koord_lab", nama: "Dr. drh. Handayu Untari", lab: "Patologi Klinik" },
  { id: "akademik1", username: "akademik.ppdh", password: "akd2026", role: "akademik", nama: "Staff Akademik PPDH", lab: null },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `mhs${i + 1}`,
    username: `mhs.${235130100 + i + 1}`,
    password: `pass${i + 1}`,
    role: "mahasiswa",
    nama: ["Aditya Pratama","Bella Safitri","Candra Putra","Dina Rahayu","Eko Susanto","Fitri Handayani","Galih Nugroho","Hani Putri","Irfan Maulana","Jasmine Dewi","Kevin Ardian","Laila Nuraini","Muhamad Rizky","Nadhira Sari","Oki Firmansyah","Putri Ayu"][i],
    nim: `23513010${(i + 1).toString().padStart(4, "0")}`,
    nomorUrut: i + 1,
    gelombangId: "G1",
    lab: null,
  })),
];
const LABS = ["Patologi Anatomi", "Mikrobiologi", "Parasitologi", "Patologi Klinik"];
const LAB_SHORT = { "Patologi Anatomi": "PA", "Mikrobiologi": "MV", "Parasitologi": "PV", "Patologi Klinik": "PK" };
const LAB_COLOR = { "Patologi Anatomi": "#e74c3c", "Mikrobiologi": "#2980b9", "Parasitologi": "#27ae60", "Patologi Klinik": "#f39c12" };

const DOSEN_LIST = [
  "drh. Ahmad Fauzi, M.Sc., Ph.D","drh. Ajeng Erika, M.Si","Dr. drh. Ricadonna Raissa, M.Si",
  "Dr. drh. Made Bagus Auriva, M.Sc","Dr. drh. Handayu Untari","drh. Sruti Listra, M.Sc",
  "drh. Shelly Kusumarini, M.Si","Dr. drh. Albiruni Haryo, M.Sc","drh. Budi Santoso, M.Vet",
  "drh. Citra Dewi, Ph.D","drh. Dani Kurniawan, M.Si","drh. Eka Prasetya, M.Sc",
  "Dr. drh. Fajar Nugroho","drh. Gita Permata, M.Si","drh. Hendra Wijaya, M.Sc","drh. Indah Lestari, Ph.D",
];

const HEWAN_GROUPS = [
  { label: "Reptil", color: "#8e44ad", nomor: [1,2,3] },
  { label: "Aves", color: "#2980b9", nomor: [4,5,6] },
  { label: "Herbivora", color: "#27ae60", nomor: [7,8,9] },
  { label: "Ikan", color: "#16a085", nomor: [10,11,12] },
  { label: "Karnivora", color: "#e67e22", nomor: [13,14,15,16] },
];

const MHS_NAMES = ["Aditya Pratama","Bella Safitri","Candra Putra","Dina Rahayu","Eko Susanto","Fitri Handayani","Galih Nugroho","Hani Putri","Irfan Maulana","Jasmine Dewi","Kevin Ardian","Laila Nuraini","Muhamad Rizky","Nadhira Sari","Oki Firmansyah","Putri Ayu"];

function addDays(dateStr, days) {
  const d = new Date(dateStr); d.setDate(d.getDate() + days); return d.toISOString().split("T")[0];
}
function addWeeks(dateStr, weeks) { return addDays(dateStr, weeks * 7); }
function getWeekNum(startDate) {
  const diff = (new Date() - new Date(startDate)) / (7 * 24 * 3600 * 1000);
  return Math.min(Math.max(Math.floor(diff) + 1, 1), 13);
}
function isLocked(deadlineDate, deadlineJam = "23:59") {
  return new Date() > new Date(`${deadlineDate}T${deadlineJam}:00`);
}
function getDeadlines(startDate) {
  return {
    accKasus: { date: addWeeks(startDate, 4), jam: "23:59", label: "Batas ACC Kasus Mandiri" },
    uploadLaporan: { date: addWeeks(startDate, 9), jam: "22:00", label: "Batas Upload Laporan" },
  };
}
function buildGelombang(id, label, startDate) {
  const shuffled = [...DOSEN_LIST].sort(() => Math.random() - 0.5);
  const deadlines = getDeadlines(startDate);
  const mahasiswa = MHS_NAMES.map((nama, i) => {
    const hewan = HEWAN_GROUPS.find(g => g.nomor.includes(i + 1));
    const pembimbing = Object.fromEntries(LABS.map((lab, li) => [lab, shuffled[(i * 2 + li) % DOSEN_LIST.length]]));
    const penguji = Object.fromEntries(LABS.map((lab, li) => [lab, shuffled[(i * 2 + li + 8) % DOSEN_LIST.length]]));
    const hasACC = i < 11;
    const hasLaporan = i < 9;
    const nilaiPembimbing = Object.fromEntries(LABS.map(lab => [lab, hasACC ? Math.floor(70 + Math.random() * 25) : null]));
    const nilaiUjian = Object.fromEntries(LABS.map(lab => [lab, hasLaporan ? Math.floor(68 + Math.random() * 27) : null]));
    const dokumenUpload = hasLaporan ? {
      nama: `Laporan_${nama.replace(" ", "_")}.pdf`,
      tanggal: addWeeks(startDate, 9),
      ukuran: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      plagiasi: Math.floor(Math.random() * 25),
    } : null;
    const statusUjian = hasLaporan ? (Object.values(nilaiUjian).every(n => n >= 70) ? "Lulus" : "Ujian Ulang") : "Belum Ujian";
    return {
      id: `${id}-MHS${i+1}`, nomorUrut: i+1, nama,
      nim: `23513010${(i+1).toString().padStart(4,"0")}`,
      gelombangId: id, hewanGroup: hewan?.label, hewanColor: hewan?.color,
      pembimbing, penguji,
      accKasus: hasACC ? { minggu: i < 6 ? 4 : 5, tanggal: addWeeks(startDate, i < 6 ? 3 : 4) } : null,
      nilaiPembimbing, nilaiUjian, statusUjian,
      jadwalUjian: hasLaporan ? addWeeks(startDate, 10) : null,
      dokumenUpload,
    };
  });
  return { id, label, startDate, deadlines, mahasiswa };
}

const GELOMBANG_DATA = [
  buildGelombang("G1", "Gelombang 1", "2026-01-05"),
  buildGelombang("G2", "Gelombang 2", "2026-02-09"),
];
function evaluateStatus(mhs, gelombang) {
  const g = gelombang.find(g => g.id === mhs.gelombangId) || gelombang[0];
  const currentWeek = getWeekNum(g.startDate);
  const deadlineACC = g.deadlines.accKasus;
  const deadlineUpload = g.deadlines.uploadLaporan;
  const accLocked = isLocked(deadlineACC.date, deadlineACC.jam);
  const uploadLocked = isLocked(deadlineUpload.date, deadlineUpload.jam);
  const sudahAccPA = !!mhs.accKasus;
  const accMelanggarBatas = accLocked && !sudahAccPA;
  const terlambatUpload = uploadLocked && !mhs.dokumenUpload;
  const nilaiOtomatis50 = terlambatUpload;
  const bisaUjian = sudahAccPA && !!mhs.dokumenUpload && !terlambatUpload;
  const warnings = [];

  if (!sudahAccPA && currentWeek >= 3) {
    const sisa = Math.max(0, 5 - currentWeek);
    warnings.push({
      type: "danger", gate: 1,
      judul: "⚠️ PERINGATAN: Belum ACC Kasus Mandiri",
      pesan: sisa > 0
        ? `Anda BELUM mendapatkan ACC kasus dari Pembimbing PA. Batas Rabu Minggu ke-5. Tersisa ±${sisa} minggu.`
        : `Batas waktu Minggu ke-5 telah TERLEWAT. Anda TIDAK DAPAT melanjutkan ke pengujian. Segera lapor Koordinator DILA.`,
      aksi: sisa > 0 ? "Hubungi Pembimbing PA Sekarang" : "Lapor Koordinator DILA",
    });
  }

  if (sudahAccPA && !mhs.dokumenUpload && currentWeek >= 8) {
    const d = new Date(`${deadlineUpload.date}T${deadlineUpload.jam}:00`);
    const hariSisa = Math.ceil((d - new Date()) / (1000 * 3600 * 24));
    warnings.push({
      type: hariSisa <= 3 ? "danger" : "warning", gate: 2,
      judul: hariSisa > 0 ? "⚠️ PERINGATAN: Laporan Belum Diupload" : "🔒 BATAS WAKTU HABIS",
      pesan: hariSisa > 0
        ? `Batas upload: Rabu Minggu ke-10, pukul 22.00 WIB (${deadlineUpload.date}). Tersisa ${hariSisa} hari. Terlambat = nilai otomatis 50.`
        : `Batas waktu telah BERAKHIR. Nilai otomatis 50. Hubungi Koordinator DILA.`,
      aksi: hariSisa > 0 ? "Upload Laporan Sekarang" : null,
    });
  }

  if (terlambatUpload) {
    warnings.push({
      type: "danger", gate: 2,
      judul: "🚫 SANKSI OTOMATIS: Nilai 50",
      pesan: "Laporan tidak diupload sebelum batas waktu. Sesuai Buku Saku DILA, nilai otomatis 50. Tidak dapat mengikuti ujian komprehensif.",
      aksi: null,
    });
  }

  return { sudahAccPA, accMelanggarBatas, terlambatUpload, nilaiOtomatis50, bisaUjian, warnings, currentWeek, g };
}

function checkPlagiarism(textA, textB) {
  if (!textA || !textB) return 0;
  const wordsA = new Set(textA.toLowerCase().split(/\s+/).filter(w => w.length > 4));
  const wordsB = new Set(textB.toLowerCase().split(/\s+/).filter(w => w.length > 4));
  let match = 0;
  wordsA.forEach(w => { if (wordsB.has(w)) match++; });
  return Math.round((match / Math.max(wordsA.size, 1)) * 100);
}
const C = {
  bg: "#0d1117", surface: "#161b22",
  border: "#30363d", borderLight: "#21262d",
  primary: "#238636", accent: "#1f6feb",
  danger: "#da3633", warning: "#d29922",
  text: "#e6edf3", textMuted: "#8b949e", textFaint: "#484f58",
};

const roleColor = { master: "#f39c12", koord_lab: "#2980b9", mahasiswa: "#27ae60", akademik: "#8e44ad" };
const roleLabel = { master: "Koordinator DILA", koord_lab: "Koordinator Lab", mahasiswa: "Mahasiswa", akademik: "Akademik PPDH" };

function Badge({ color = C.accent, children }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700,
      whiteSpace: "nowrap", display: "inline-block"
    }}>{children}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "20px 24px", ...style
    }}>{children}</div>
  );
}

function Btn({ children, onClick, color = C.accent, disabled, small, full }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? "6px 14px" : "10px 20px",
      background: disabled ? C.textFaint : color, color: "#fff",
      border: "none", borderRadius: 8, fontSize: small ? 12 : 14,
      fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      width: full ? "100%" : undefined, opacity: disabled ? 0.6 : 1,
    }}>{children}</button>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted }}>{label}</label>}
      <input {...props} style={{
        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
        padding: "10px 14px", color: C.text, fontSize: 14, outline: "none",
        width: "100%", boxSizing: "border-box", ...props.style
      }} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted }}>{label}</label>}
      <select {...props} style={{
        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
        padding: "9px 12px", color: C.text, fontSize: 13, cursor: "pointer", outline: "none",
        ...props.style
      }}>{children}</select>
    </div>
  );
}

function NilaiChip({ nilai }) {
  if (nilai === null || nilai === undefined) return <span style={{ color: C.textFaint }}>—</span>;
  return <span style={{ color: nilai >= 70 ? C.primary : C.danger, fontWeight: 800 }}>{nilai}</span>;
}

function NilaiAkhir({ np, nu }) {
  if (!np && !nu) return <span style={{ color: C.textFaint }}>—</span>;
  const na = np && nu ? (np + nu) / 2 : (np || nu);
  return <span style={{ color: na >= 70 ? C.primary : C.danger, fontWeight: 800 }}>{na.toFixed(0)}</span>;
}

function Alert({ type = "info", children }) {
  const colors = { info: C.accent, warning: C.warning, danger: C.danger, success: C.primary };
  const c = colors[type];
  return (
    <div style={{
      background: c + "18", border: `1px solid ${c}44`,
      borderRadius: 8, padding: "10px 14px", fontSize: 13, color: c, lineHeight: 1.5
    }}>{children}</div>
  );
}

function PageTitle({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{icon} {title}</div>
      {sub && <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "16px 0" }} />;
}
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { role: "master", u: "koordinator.dila", p: "dila2026", label: "Koordinator DILA", icon: "🧬" },
    { role: "koord_lab", u: "koord.pa", p: "pa2026", label: "Koordinator PA", icon: "🔬" },
    { role: "mahasiswa", u: "mhs.235130100001", p: "pass1", label: "Mahasiswa", icon: "👤" },
    { role: "akademik", u: "akademik.ppdh", p: "akd2026", label: "Akademik PPDH", icon: "📁" },
  ];

  const handleLogin = () => {
    setLoading(true); setError("");
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) onLogin(user);
      else { setError("Username atau password salah."); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, #1f6feb11 0%, transparent 60%)"
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #1f6feb, #238636)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
            boxShadow: "0 8px 32px #1f6feb44"
          }}>🧬</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>DILA System</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Rotasi Diagnostik Laboratoris · FKH UB</div>
        </div>
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="USERNAME" placeholder="Masukkan username..." value={username}
              onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            <Input label="PASSWORD" type="password" placeholder="Masukkan password..."
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
            {error && <Alert type="danger">⚠️ {error}</Alert>}
            <Btn onClick={handleLogin} disabled={loading || !username || !password} full color={C.accent}>
              {loading ? "Memverifikasi..." : "Masuk →"}
            </Btn>
          </div>
        </Card>
        <div style={{ marginTop: 20 }}>
          <div style={{ textAlign: "center", fontSize: 11, color: C.textFaint, marginBottom: 10 }}>AKUN DEMO</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {demoAccounts.map(acc => (
              <button key={acc.u} onClick={() => { setUsername(acc.u); setPassword(acc.p); }}
                style={{
                  background: C.surface, border: `1px solid ${roleColor[acc.role]}44`,
                  borderRadius: 8, padding: "8px 12px", cursor: "pointer",
                  textAlign: "left", color: C.text,
                }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{acc.icon} {acc.label}</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{acc.u}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function Shell({ user, onLogout, children, activeTab, setActiveTab, tabs }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{
        width: collapsed ? 60 : 220, background: C.surface, borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", transition: "width 0.25s",
        flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto"
      }}>
        <div style={{ padding: "16px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #1f6feb, #238636)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
          }}>🧬</div>
          {!collapsed && <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>DILA System</div>
            <div style={{ fontSize: 10, color: C.textMuted }}>FKH UB · 2026</div>
          </div>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 16 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>
        {!collapsed && (
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{roleLabel[user.role]}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{user.nama}</div>
            {user.lab && <div style={{ fontSize: 11, color: LAB_COLOR[user.lab], marginTop: 2 }}>Lab. {user.lab}</div>}
          </div>
        )}
        <nav style={{ flex: 1, padding: "8px" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: collapsed ? "10px" : "10px 12px",
              background: activeTab === tab.id ? C.accent + "22" : "none",
              border: `1px solid ${activeTab === tab.id ? C.accent + "44" : "transparent"}`,
              borderRadius: 8, color: activeTab === tab.id ? C.accent : C.textMuted,
              fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 2,
              justifyContent: collapsed ? "center" : "flex-start"
            }}>
              <span style={{ fontSize: 16 }}>{tab.icon}</span>
              {!collapsed && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: 8, borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{
            width: "100%", padding: collapsed ? "10px" : "10px 12px",
            background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
            color: C.textMuted, cursor: "pointer", fontSize: 12,
            display: "flex", alignItems: "center", gap: 8,
            justifyContent: collapsed ? "center" : "flex-start"
          }}>
            <span>🚪</span>{!collapsed && "Keluar"}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function MasterDashboard({ gelombang }) {
  const allMhs = gelombang.flatMap(g => g.mahasiswa);
  const sudahACC = allMhs.filter(m => m.accKasus).length;
  const sudahUpload = allMhs.filter(m => m.dokumenUpload).length;
  const lulus = allMhs.filter(m => m.statusUjian === "Lulus").length;
  const ujianUlang = allMhs.filter(m => m.statusUjian === "Ujian Ulang").length;

  return (
    <div>
      <PageTitle icon="🏠" title="Dashboard Utama" sub="Ringkasan seluruh gelombang rotasi DILA" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Mahasiswa", val: allMhs.length, sub: `${gelombang.length} gelombang`, color: C.accent, icon: "👥" },
          { label: "ACC Kasus", val: sudahACC, sub: `${allMhs.length - sudahACC} belum`, color: C.primary, icon: "✅" },
          { label: "Upload Laporan", val: sudahUpload, sub: `${allMhs.length - sudahUpload} belum`, color: C.warning, icon: "📋" },
          { label: "Lulus Ujian", val: lulus, sub: `${ujianUlang} ujian ulang`, color: "#8e44ad", icon: "🎓" },
        ].map(s => (
          <Card key={s.label} style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.val}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{s.label}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.sub}</div>
          </Card>
        ))}
      </div>
      {gelombang.map(g => {
        const week = getWeekNum(g.startDate);
        const steps = [
          { range:[1,2], label:"Kuliah", icon:"📚" },
          { range:[3,5], label:"Kasus", icon:"🔍" },
          { range:[6,9], label:"Uji", icon:"🧪" },
          { range:[10,10], label:"Laporan", icon:"📋" },
          { range:[11,11], label:"Ujian", icon:"🎓" },
          { range:[12,12], label:"Ulang", icon:"🔄" },
          { range:[13,13], label:"Jeda", icon:"⏸️" },
        ];
        const belumAccWarning = g.mahasiswa.filter(m => !m.accKasus && week >= 3 && week <= 5);
        const sanksi = g.mahasiswa.filter(m => {
          const { accMelanggarBatas, terlambatUpload } = evaluateStatus(m, [g]);
          return accMelanggarBatas || terlambatUpload;
        });
        return (
          <Card key={g.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{g.label}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Mulai {g.startDate} · Minggu ke-{week}/13</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Badge color={C.primary}>ACC {g.mahasiswa.filter(m=>m.accKasus).length}/{g.mahasiswa.length}</Badge>
                <Badge color="#8e44ad">Lulus {g.mahasiswa.filter(m=>m.statusUjian==="Lulus").length}/{g.mahasiswa.length}</Badge>
              </div>
            </div>
            <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
              {steps.map((s, i) => {
                const span = s.range[1] - s.range[0] + 1;
                const active = week >= s.range[0] && week <= s.range[1];
                const done = week > s.range[1];
                return (
                  <div key={i} style={{ flex: span, minWidth: 0 }}>
                    <div style={{
                      height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                      background: done ? C.primary : active ? C.accent : C.bg,
                      borderRadius: i===0?"6px 0 0 6px":i===steps.length-1?"0 6px 6px 0":2,
                      fontSize: 11, fontWeight: 700, color: done||active?"#fff":C.textFaint,
                      border: `1px solid ${done?C.primary:active?C.accent:C.border}`, gap: 4,
                    }}>
                      {s.icon}<span style={{ display: span>1?"inline":"none" }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 9, textAlign: "center", color: C.textFaint, marginTop: 3 }}>
                      Mg {s.range[0]}{s.range[1]!==s.range[0]?`–${s.range[1]}`:""}
                    </div>
                  </div>
                );
              })}
            </div>
            {belumAccWarning.length > 0 && (
              <div style={{ marginTop: 10, background: C.warning+"18", border:`1px solid ${C.warning}44`, borderRadius:8, padding:"10px 14px", fontSize:12, color:C.warning }}>
                ⚠️ <strong>{belumAccWarning.length} mahasiswa</strong> belum ACC — batas Rabu Mg-5: {belumAccWarning.map(m=>m.nama.split(" ")[0]).join(", ")}
              </div>
            )}
            {sanksi.length > 0 && (
              <div style={{ marginTop: 8, background: C.danger+"18", border:`2px solid ${C.danger}`, borderRadius:8, padding:"10px 14px", fontSize:12, color:C.danger }}>
                🚫 <strong>{sanksi.length} mahasiswa terkena sanksi otomatis:</strong> {sanksi.map(m=>m.nama.split(" ")[0]).join(", ")}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
function MasterMahasiswa({ gelombang }) {
  const [selG, setSelG] = useState(gelombang[0].id);
  const [search, setSearch] = useState("");
  const [filterHewan, setFilterHewan] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [modal, setModal] = useState(null);

  const g = gelombang.find(x => x.id === selG);
  const filtered = (g?.mahasiswa || []).filter(m => {
    const s = m.nama.toLowerCase().includes(search.toLowerCase()) || m.nim.includes(search);
    const h = filterHewan === "Semua" || m.hewanGroup === filterHewan;
    const st = filterStatus === "Semua" || m.statusUjian === filterStatus;
    return s && h && st;
  });

  return (
    <div>
      <PageTitle icon="👥" title="Data Mahasiswa" />
      <Card style={{ marginBottom: 16, padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Select value={selG} onChange={e => setSelG(e.target.value)}>
            {gelombang.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
          </Select>
          <input placeholder="🔍 Nama / NIM..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 13px", color: C.text, fontSize: 13, flex: 1, minWidth: 160, outline: "none" }} />
          <Select value={filterHewan} onChange={e => setFilterHewan(e.target.value)}>
            <option>Semua</option>
            {HEWAN_GROUPS.map(h => <option key={h.label}>{h.label}</option>)}
          </Select>
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option>Semua</option>
            <option>Lulus</option><option>Ujian Ulang</option><option>Belum Ujian</option>
          </Select>
        </div>
      </Card>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                {["#","Mahasiswa","Hewan","ACC","Laporan","PA","MV","PV","PK","Status",""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 12px", fontWeight: 700, color: C.textMuted, textAlign: "center", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: `1px solid ${C.borderLight}`, background: i%2===0?C.surface:C.bg }}>
                  <td style={{ padding: "10px 12px", color: C.textFaint, fontWeight: 700, textAlign: "center" }}>{m.nomorUrut}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ fontWeight: 700, color: C.text }}>{m.nama}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{m.nim}</div>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}><Badge color={m.hewanColor}>{m.hewanGroup}</Badge></td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    {m.accKasus ? <span style={{ color: C.primary, fontWeight: 700 }}>✓ Mg-{m.accKasus.minggu}</span> : <span style={{ color: C.danger }}>✗</span>}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    {m.dokumenUpload ? <span style={{ color: C.primary, fontSize: 11 }}>✓</span> : <span style={{ color: C.textFaint }}>—</span>}
                  </td>
                  {LABS.map(lab => (
                    <td key={lab} style={{ padding: "10px 12px", textAlign: "center" }}>
                      <NilaiAkhir np={m.nilaiPembimbing[lab]} nu={m.nilaiUjian[lab]} />
                    </td>
                  ))}
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <Badge color={m.statusUjian==="Lulus"?C.primary:m.statusUjian==="Ujian Ulang"?C.danger:C.textFaint}>
                      {m.statusUjian}
                    </Badge>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <Btn small onClick={() => setModal(m)}>Detail</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setModal(null)}>
          <Card style={{ maxWidth: 700, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{modal.nama}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{modal.nim} · <Badge color={modal.hewanColor}>{modal.hewanGroup}</Badge></div>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 22 }}>✕</button>
            </div>
            <Divider />
            <div style={{ fontWeight: 700, marginBottom: 12, color: C.text }}>📊 Nilai per Laboratorium</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  {["Lab","Pembimbing","Penguji","N.Bimbing","N.Ujian","N.Akhir"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", color: C.textMuted, fontWeight: 700, textAlign: "center" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LABS.map(lab => (
                  <tr key={lab} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: LAB_COLOR[lab] }}>{lab}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.textMuted }}>{modal.pembimbing[lab].split(",")[0]}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.textMuted }}>{modal.penguji[lab].split(",")[0]}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}><NilaiChip nilai={modal.nilaiPembimbing[lab]} /></td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}><NilaiChip nilai={modal.nilaiUjian[lab]} /></td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}><NilaiAkhir np={modal.nilaiPembimbing[lab]} nu={modal.nilaiUjian[lab]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}

function MasterLaporan({ gelombang }) {
  const [bulan, setBulan] = useState("2026-04");
  const [jenis, setJenis] = useState("Berita Acara");
  const allMhs = gelombang.flatMap(g => g.mahasiswa);
  const monthLabel = new Date(bulan+"-01").toLocaleDateString("id-ID",{month:"long",year:"numeric"});
  const todayLabel = new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});

  const content = jenis === "Berita Acara" ? `BERITA ACARA PERKULIAHAN
ROTASI DIAGNOSTIK LABORATORIS (DILA)
FKH UNIVERSITAS BRAWIJAYA

Bulan   : ${monthLabel}
Tanggal : ${todayLabel}

GELOMBANG AKTIF:
${gelombang.map(g=>`• ${g.label} (mulai ${g.startDate}) — Minggu ke-${getWeekNum(g.startDate)} dari 13`).join("\n")}

PESERTA: ${allMhs.length} mahasiswa · ${DOSEN_LIST.length} dosen

CAPAIAN:
• ACC Kasus     : ${allMhs.filter(m=>m.accKasus).length}/${allMhs.length}
• Upload Laporan: ${allMhs.filter(m=>m.dokumenUpload).length}/${allMhs.length}
• Lulus Ujian   : ${allMhs.filter(m=>m.statusUjian==="Lulus").length}/${allMhs.length}

Malang, ${todayLabel}
Koordinator Rotasi DILA,


Dr. drh. Made Bagus Auriva Mataram, M.Sc.` : `LAPORAN PENGUJIAN - ${monthLabel}

NO  NAMA                  PA    MV    PV    PK    STATUS
${allMhs.map((m,i)=>{
  const vals = LABS.map(lab=>{
    const na = m.nilaiPembimbing[lab]&&m.nilaiUjian[lab]?((m.nilaiPembimbing[lab]+m.nilaiUjian[lab])/2).toFixed(0):"—";
    return na.padEnd(6);
  }).join(" ");
  return `${(i+1).toString().padStart(3)} ${m.nama.padEnd(22)} ${vals} ${m.statusUjian}`;
}).join("\n")}`;

  return (
    <div>
      <PageTitle icon="📄" title="Generator Laporan Akademik" />
      <Card style={{ marginBottom: 16, padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <Select label="Jenis" value={jenis} onChange={e => setJenis(e.target.value)}>
            <option>Berita Acara</option>
            <option>Laporan Pengujian</option>
          </Select>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>BULAN</div>
            <input type="month" value={bulan} onChange={e => setBulan(e.target.value)}
              style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none" }} />
          </div>
          <Btn onClick={() => {
            const blob = new Blob([content],{type:"text/plain;charset=utf-8"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href=url;
            a.download=`${jenis.replace(/ /g,"_")}_${bulan}.txt`; a.click();
          }} color={C.primary}>⬇️ Unduh</Btn>
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 700, color: C.text, marginBottom: 12 }}>Preview: {jenis}</div>
        <pre style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16,
          fontSize: 11.5, lineHeight: 1.8, overflowX: "auto", whiteSpace: "pre-wrap",
          fontFamily: "'Courier New', monospace", color: C.text, maxHeight: 500, overflowY: "auto"
        }}>{content}</pre>
      </Card>
    </div>
  );
}
function KoordLabDashboard({ user, gelombang }) {
  const lab = user.lab;
  const allMhs = gelombang.flatMap(g => g.mahasiswa);
  const myMhs = allMhs.filter(m => Object.keys(m.pembimbing).includes(lab));
  const sudahACC = myMhs.filter(m => m.accKasus).length;
  const sudahNilai = myMhs.filter(m => m.nilaiPembimbing[lab]).length;
  const sudahUjian = myMhs.filter(m => m.nilaiUjian[lab]).length;

  return (
    <div>
      <PageTitle icon="🔬" title={`Dashboard — Lab. ${lab}`} sub={`Login sebagai: ${user.nama}`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Mahasiswa", val: myMhs.length, color: LAB_COLOR[lab], icon: "👥" },
          { label: "Sudah ACC", val: sudahACC, sub: `${myMhs.length-sudahACC} belum`, color: C.primary, icon: "✅" },
          { label: "Nilai Bimbing", val: sudahNilai, sub: `${myMhs.length-sudahNilai} belum`, color: C.warning, icon: "📝" },
          { label: "Nilai Ujian", val: sudahUjian, sub: `${myMhs.length-sudahUjian} belum`, color: "#8e44ad", icon: "🎓" },
        ].map(s => (
          <Card key={s.label} style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.val}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{s.label}</div>
            {s.sub && <div style={{ fontSize: 11, color: C.textMuted }}>{s.sub}</div>}
          </Card>
        ))}
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: C.text }}>
          📋 Daftar Mahasiswa — Lab. {lab}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                {["#","Nama","Hewan","Pembimbing","Penguji","ACC","N.Bimbing","N.Ujian","N.Akhir","Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", color: C.textMuted, fontWeight: 700, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myMhs.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: `1px solid ${C.borderLight}`, background: i%2===0?C.surface:C.bg }}>
                  <td style={{ padding: "10px 12px", color: C.textFaint, fontWeight: 700 }}>{m.nomorUrut}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ fontWeight: 700, color: C.text }}>{m.nama}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{m.nim}</div>
                  </td>
                  <td style={{ padding: "10px 12px" }}><Badge color={m.hewanColor}>{m.hewanGroup}</Badge></td>
                  <td style={{ padding: "10px 12px", fontSize: 11, color: C.textMuted }}>{m.pembimbing[lab].split(",")[0]}</td>
                  <td style={{ padding: "10px 12px", fontSize: 11, color: C.textMuted }}>{m.penguji[lab].split(",")[0]}</td>
                  <td style={{ padding: "10px 12px" }}>
                    {m.accKasus ? <Badge color={C.primary}>✓ Mg-{m.accKasus.minggu}</Badge> : <Badge color={C.danger}>Belum</Badge>}
                  </td>
                  <td style={{ padding: "10px 12px" }}><NilaiChip nilai={m.nilaiPembimbing[lab]} /></td>
                  <td style={{ padding: "10px 12px" }}><NilaiChip nilai={m.nilaiUjian[lab]} /></td>
                  <td style={{ padding: "10px 12px" }}><NilaiAkhir np={m.nilaiPembimbing[lab]} nu={m.nilaiUjian[lab]} /></td>
                  <td style={{ padding: "10px 12px" }}>
                    <Badge color={m.statusUjian==="Lulus"?C.primary:m.statusUjian==="Ujian Ulang"?C.danger:C.textFaint}>
                      {m.statusUjian}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function KoordLabInputNilai({ user, gelombang }) {
  const lab = user.lab;
  const allMhs = gelombang.flatMap(g => g.mahasiswa);
  const [selMhs, setSelMhs] = useState("");
  const [jenis, setJenis] = useState("Pembimbing");
  const [afektif, setAfektif] = useState("");
  const [kognitif, setKognitif] = useState("");
  const [skill, setSkill] = useState("");
  const [saved, setSaved] = useState(false);

  const bobot = jenis === "Pembimbing"
    ? { afektif: 0.2, kognitif: 0.1, skill: 0.7 }
    : { afektif: 0.2, kognitif: 0.5, skill: 0.3 };
  const total = (parseFloat(afektif)||0)*bobot.afektif + (parseFloat(kognitif)||0)*bobot.kognitif + (parseFloat(skill)||0)*bobot.skill;

  return (
    <div>
      <PageTitle icon="📝" title="Input Nilai & ACC" sub={`Laboratorium ${lab}`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontWeight: 700, color: C.text, marginBottom: 16 }}>Form Input Nilai</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Select label="MAHASISWA" value={selMhs} onChange={e => setSelMhs(e.target.value)}>
              <option value="">-- Pilih mahasiswa --</option>
              {allMhs.map(m => <option key={m.id} value={m.id}>{m.nama} ({m.nim})</option>)}
            </Select>
            <Select label="JENIS NILAI" value={jenis} onChange={e => setJenis(e.target.value)}>
              <option>Pembimbing</option>
              <option>Penguji (Ujian Komprehensif)</option>
            </Select>
            <Divider />
            <div style={{ background: C.bg, borderRadius: 8, padding: 12, fontSize: 12, color: C.textMuted }}>
              <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Bobot {jenis}:</div>
              <div>• Afektif: <strong style={{ color: C.text }}>{(bobot.afektif*100).toFixed(0)}%</strong></div>
              <div>• Kognitif: <strong style={{ color: C.text }}>{(bobot.kognitif*100).toFixed(0)}%</strong></div>
              <div>• Skill: <strong style={{ color: C.text }}>{(bobot.skill*100).toFixed(0)}%</strong></div>
            </div>
            <Input label="AFEKTIF (0–100)" type="number" min="0" max="100" value={afektif} onChange={e => setAfektif(e.target.value)} />
            <Input label="KOGNITIF (0–100)" type="number" min="0" max="100" value={kognitif} onChange={e => setKognitif(e.target.value)} />
            <Input label="SKILL (0–100)" type="number" min="0" max="100" value={skill} onChange={e => setSkill(e.target.value)} />
            {(afektif || kognitif || skill) && (
              <div style={{
                background: total>=70?C.primary+"22":C.danger+"22",
                border: `1px solid ${total>=70?C.primary:C.danger}44`,
                borderRadius: 8, padding: "12px 16px", textAlign: "center"
              }}>
                <div style={{ fontSize: 11, color: C.textMuted }}>NILAI TERKOMPUTASI</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: total>=70?C.primary:C.danger }}>{total.toFixed(1)}</div>
                <div style={{ fontSize: 12, color: total>=70?C.primary:C.danger }}>{total>=70?"✓ LULUS":"✗ Belum Lulus"}</div>
              </div>
            )}
            {saved && <Alert type="success">✅ Nilai berhasil disimpan!</Alert>}
            <Btn onClick={() => { if(!selMhs) return; setSaved(true); setTimeout(()=>setSaved(false),3000); }}
              disabled={!selMhs||!afektif||!kognitif||!skill} color={C.primary} full>
              💾 Simpan Nilai
            </Btn>
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 700, color: C.text, marginBottom: 14 }}>✅ ACC Kasus Mandiri</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14 }}>
            Lab. <strong style={{ color: LAB_COLOR[lab] }}>{lab}</strong> sebagai pintu masuk kasus.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
            {allMhs.filter(m => !m.accKasus).map(m => (
              <div key={m.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: C.bg, borderRadius: 8, border: `1px solid ${C.border}`
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.nama}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{m.nim} · {m.hewanGroup}</div>
                </div>
                <Btn small color={C.primary} onClick={() => alert(`ACC kasus untuk ${m.nama} berhasil dicatat.`)}>✓ ACC</Btn>
              </div>
            ))}
            {allMhs.filter(m => m.accKasus).map(m => (
              <div key={m.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: C.bg, borderRadius: 8,
                border: `1px solid ${C.primary}33`, opacity: 0.7
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.nama}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{m.nim}</div>
                </div>
                <Badge color={C.primary}>✓ ACC Mg-{m.accKasus.minggu}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AkademikPortal({ gelombang }) {
  const [bulan, setBulan] = useState("2026-04");
  const allMhs = gelombang.flatMap(g => g.mahasiswa);
  const monthLabel = new Date(bulan+"-01").toLocaleDateString("id-ID",{month:"long",year:"numeric"});
  const todayLabel = new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});

  const bap = `BERITA ACARA PERKULIAHAN
ROTASI DIAGNOSTIK LABORATORIS (DILA)
FKH UNIVERSITAS BRAWIJAYA

Bulan   : ${monthLabel}
Tanggal : ${todayLabel}

GELOMBANG AKTIF:
${gelombang.map(g=>`• ${g.label} (mulai ${g.startDate}) — Minggu ke-${getWeekNum(g.startDate)} dari 13`).join("\n")}

PESERTA: ${allMhs.length} mahasiswa · ${DOSEN_LIST.length} dosen

CAPAIAN:
• ACC Kasus     : ${allMhs.filter(m=>m.accKasus).length}/${allMhs.length}
• Upload Laporan: ${allMhs.filter(m=>m.dokumenUpload).length}/${allMhs.length}
• Lulus Ujian   : ${allMhs.filter(m=>m.statusUjian==="Lulus").length}/${allMhs.length}

DAFTAR PESERTA:
${allMhs.map((m,i)=>`${(i+1).toString().padStart(3)}. ${m.nama.padEnd(25)} ${m.nim}`).join("\n")}

Malang, ${todayLabel}
Koordinator Rotasi DILA,


Dr. drh. Made Bagus Auriva Mataram, M.Sc.`;

  return (
    <div>
      <PageTitle icon="📁" title="Portal Akademik PPDH" sub="Akses terbatas — unduh BAP bulanan" />
      <Alert type="info" style={{ marginBottom: 20 }}>
        ℹ️ Akun ini hanya dapat mengunduh Berita Acara Perkuliahan (BAP) per bulan.
      </Alert>
      <Card style={{ marginBottom: 16, padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>PILIH BULAN</div>
            <input type="month" value={bulan} onChange={e => setBulan(e.target.value)}
              style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none" }} />
          </div>
          <Btn onClick={() => {
            const blob = new Blob([bap],{type:"text/plain;charset=utf-8"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href=url;
            a.download=`BAP_RotasiDILA_${bulan}.txt`; a.click();
          }} color={C.primary}>⬇️ Unduh BAP {monthLabel}</Btn>
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 700, color: C.text, marginBottom: 12 }}>Preview BAP — {monthLabel}</div>
        <pre style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16,
          fontSize: 11.5, lineHeight: 1.8, whiteSpace: "pre-wrap",
          fontFamily: "'Courier New', monospace", color: C.text, maxHeight: 480, overflowY: "auto"
        }}>{bap}</pre>
      </Card>
    </div>
  );
}
function MahasiswaPortal({ user, gelombang }) {
  const mhsData = gelombang.flatMap(g => g.mahasiswa).find(m => m.nama === user.nama) || gelombang[0].mahasiswa[0];
  const g = gelombang.find(g => g.id === mhsData.gelombangId) || gelombang[0];
  const { sudahAccPA, terlambatUpload, nilaiOtomatis50, bisaUjian, warnings, currentWeek } = evaluateStatus(mhsData, gelombang);
  const [uploadText, setUploadText] = useState("");
  const [plagResult, setPlagResult] = useState(null);
  const uploadLocked = isLocked(g.deadlines.uploadLaporan.date, g.deadlines.uploadLaporan.jam);
  const rataGelombang = {};
  LABS.forEach(lab => {
    const vals = g.mahasiswa.map(m => m.nilaiPembimbing[lab]&&m.nilaiUjian[lab]?(m.nilaiPembimbing[lab]+m.nilaiUjian[lab])/2:null).filter(Boolean);
    rataGelombang[lab] = vals.length?(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):null;
  });

  return (
    <div>
      <style>{`@keyframes pulse-border{0%,100%{box-shadow:0 0 16px #da363355;}50%{box-shadow:0 0 32px #da363399;}}`}</style>
      <PageTitle icon="👤" title={`Halo, ${mhsData.nama.split(" ")[0]}!`}
        sub={`${mhsData.nim} · ${g.label} · ${mhsData.hewanGroup} · Minggu ke-${currentWeek}`} />

      {warnings.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {warnings.map((w, i) => (
            <div key={i} style={{
              background: w.type==="danger"?"#2d0a0a":"#2d1f00",
              border: `2px solid ${w.type==="danger"?C.danger:C.warning}`,
              borderRadius: 12, padding: "16px 20px", animation: "pulse-border 2s infinite"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ background: w.type==="danger"?C.danger:C.warning, color:"#fff", borderRadius:6, padding:"2px 10px", fontSize:11, fontWeight:900 }}>
                  GATE {w.gate} — {w.type==="danger"?"KRITIS":"PERINGATAN"}
                </div>
              </div>
              <div style={{ fontSize:15, fontWeight:800, color:w.type==="danger"?C.danger:C.warning, marginBottom:8 }}>{w.judul}</div>
              <div style={{ fontSize:13, color:"#ccc", lineHeight:1.7, marginBottom: w.aksi?12:0 }}>{w.pesan}</div>
              {w.aksi && <button onClick={() => alert(w.gate===1?"Hubungi Pembimbing PA Anda.":"Upload laporan sekarang.")}
                style={{ background:w.type==="danger"?C.danger:C.warning, color:"#fff", border:"none", borderRadius:8, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                → {w.aksi}
              </button>}
            </div>
          ))}
        </div>
      )}

      {nilaiOtomatis50 && (
        <div style={{ background:"#1a0a0a", border:`3px solid ${C.danger}`, borderRadius:12, padding:"20px 24px", marginBottom:20, textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🚫</div>
          <div style={{ fontSize:20, fontWeight:900, color:C.danger, marginBottom:6 }}>NILAI OTOMATIS: 50</div>
          <div style={{ fontSize:13, color:"#aaa", lineHeight:1.6 }}>
            Sesuai Buku Saku DILA, nilai Anda otomatis <strong style={{color:C.danger}}>50</strong> karena terlambat mengumpulkan laporan.
          </div>
        </div>
      )}

      <Card style={{ marginBottom:16, padding:"14px 20px" }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.textMuted, marginBottom:10 }}>CHECKLIST SYARAT UJIAN KOMPREHENSIF</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            { label:"ACC Pembimbing PA", ok:sudahAccPA },
            { label:"Upload Laporan Tepat Waktu", ok:!!mhsData.dokumenUpload&&!terlambatUpload },
            { label:"Terdaftar Ujian", ok:bisaUjian },
          ].map((item,i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:8,
              background:item.ok?C.primary+"18":C.danger+"18",
              border:`1px solid ${item.ok?C.primary:C.danger}44`,
              borderRadius:8, padding:"8px 14px"
            }}>
              <span style={{fontSize:16}}>{item.ok?"✅":"🚫"}</span>
              <div>
                <div style={{fontSize:12, fontWeight:700, color:item.ok?C.primary:C.danger}}>{item.label}</div>
                {!item.ok && <div style={{fontSize:10, color:C.danger}}>SYARAT WAJIB — belum terpenuhi</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card>
          <div style={{ fontWeight:700, color:C.text, marginBottom:12 }}>📌 Status Kasus Mandiri</div>
          <div style={{ padding:16, borderRadius:10, textAlign:"center", background:sudahAccPA?C.primary+"18":C.danger+"18", border:`2px solid ${sudahAccPA?C.primary:C.danger}` }}>
            <div style={{fontSize:36}}>{sudahAccPA?"✅":"🚫"}</div>
            <div style={{fontWeight:800, fontSize:15, color:sudahAccPA?C.primary:C.danger, marginTop:8}}>
              {sudahAccPA?`ACC Minggu ke-${mhsData.accKasus.minggu}`:"BELUM ACC"}
            </div>
            <div style={{fontSize:12, color:C.textMuted, marginTop:4}}>
              {sudahAccPA?`Tanggal: ${mhsData.accKasus.tanggal}`:"Segera hubungi Pembimbing PA!"}
            </div>
          </div>
          {mhsData.jadwalUjian && bisaUjian && (
            <div style={{marginTop:10, background:C.accent+"18", borderRadius:8, padding:"10px 14px", border:`1px solid ${C.accent}44`}}>
              <div style={{fontSize:11, color:C.textMuted}}>Jadwal Ujian Komprehensif</div>
              <div style={{fontSize:14, fontWeight:700, color:C.accent}}>{mhsData.jadwalUjian}</div>
            </div>
          )}
        </Card>
        <Card>
          <div style={{fontWeight:700, color:C.text, marginBottom:12}}>👨‍🏫 Pembimbing & Penguji</div>
          <div style={{display:"flex", flexDirection:"column", gap:8, maxHeight:280, overflowY:"auto"}}>
            {LABS.map(lab => (
              <div key={lab} style={{ background:C.bg, borderRadius:8, padding:"10px 14px", borderLeft:`3px solid ${LAB_COLOR[lab]}`, opacity:!sudahAccPA&&lab!=="Patologi Anatomi"?0.4:1 }}>
                <div style={{fontSize:11, fontWeight:700, color:LAB_COLOR[lab], marginBottom:4}}>
                  {lab} {!sudahAccPA&&lab!=="Patologi Anatomi"&&<span style={{color:C.danger, fontSize:10}}>· Terkunci</span>}
                </div>
                <div style={{fontSize:12, color:C.text}}>🧑‍🏫 {mhsData.pembimbing[lab].split(",")[0]}</div>
                <div style={{fontSize:12, color:C.textMuted, marginTop:2}}>🎓 {mhsData.penguji[lab].split(",")[0]}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{fontWeight:700, color:C.text, marginBottom:8}}>📤 Upload Laporan</div>
        {!sudahAccPA ? (
          <div style={{background:"#2d0a0a", border:`2px solid ${C.danger}`, borderRadius:10, padding:"14px 18px"}}>
            <div style={{fontSize:14, fontWeight:800, color:C.danger, marginBottom:6}}>🚫 Upload Diblokir — Belum ACC</div>
            <div style={{fontSize:13, color:"#ccc"}}>Dapatkan ACC dari Pembimbing PA terlebih dahulu sebelum Rabu Minggu ke-5.</div>
          </div>
        ) : uploadLocked && !mhsData.dokumenUpload ? (
          <div style={{background:"#2d0a0a", border:`2px solid ${C.danger}`, borderRadius:10, padding:"14px 18px"}}>
            <div style={{fontSize:14, fontWeight:800, color:C.danger, marginBottom:6}}>🔒 Batas Waktu Berakhir — Nilai Otomatis 50</div>
            <div style={{fontSize:13, color:"#ccc"}}>Sistem terkunci sejak {g.deadlines.uploadLaporan.date} pukul {g.deadlines.uploadLaporan.jam} WIB.</div>
          </div>
        ) : (
          <>
            {mhsData.dokumenUpload && <Alert type="success" style={{marginBottom:12}}>✅ {mhsData.dokumenUpload.nama} · {mhsData.dokumenUpload.tanggal}</Alert>}
            <textarea value={uploadText} onChange={e => setUploadText(e.target.value)}
              placeholder="Paste isi laporan untuk cek kemiripan sebelum upload..."
              style={{width:"100%", minHeight:100, background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:12, color:C.text, fontSize:13, resize:"vertical", fontFamily:"inherit", boxSizing:"border-box", outline:"none"}} />
            <div style={{display:"flex", gap:10, marginTop:10, flexWrap:"wrap"}}>
              <Btn small onClick={() => {
                const samples = gelombang.flatMap(g=>g.mahasiswa).filter(m=>m.dokumenUpload&&m.nama!==mhsData.nama).map(m=>`laporan penyakit ${m.hewanGroup} patologi mikrobiologi parasitologi`);
                const scores = samples.map(t => checkPlagiarism(uploadText, t));
                setPlagResult(Math.max(...scores, 0));
              }} disabled={!uploadText} color={C.warning}>🔍 Cek Kemiripan</Btn>
              <Btn small color={C.primary} onClick={() => alert("Upload berhasil!")}>📤 Upload PDF</Btn>
            </div>
            {plagResult !== null && (
              <div style={{marginTop:12, padding:"12px 16px", borderRadius:8, textAlign:"center", background:plagResult>30?C.danger+"22":plagResult>20?C.warning+"22":C.primary+"22", border:`1px solid ${plagResult>30?C.danger:plagResult>20?C.warning:C.primary}44`}}>
                <div style={{fontSize:28, fontWeight:900, color:plagResult>30?C.danger:plagResult>20?C.warning:C.primary}}>{plagResult}% Kemiripan</div>
                <div style={{fontSize:12, color:C.textMuted, marginTop:4}}>
                  {plagResult>30?"⚠️ Kemiripan tinggi — revisi dulu":plagResult>20?"⚠️ Perlu diperhatikan":"✅ Aman untuk diupload"}
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <Card>
        <div style={{fontWeight:700, color:C.text, marginBottom:14}}>📊 Nilai Saya vs Rata-rata Gelombang</div>
        <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
          <thead>
            <tr style={{background:C.bg}}>
              {["Lab","N.Bimbing","N.Ujian","N.Akhir","Rata-rata","Posisi"].map(h=>(
                <th key={h} style={{padding:"10px 12px", color:C.textMuted, fontWeight:700, textAlign:"center"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LABS.map(lab => {
              const nb=mhsData.nilaiPembimbing[lab], nu=mhsData.nilaiUjian[lab];
              const na=nb&&nu?(nb+nu)/2:null;
              const rata=parseFloat(rataGelombang[lab]);
              const diff=na&&rata?(na-rata):null;
              return (
                <tr key={lab} style={{borderBottom:`1px solid ${C.borderLight}`}}>
                  <td style={{padding:"10px 12px", fontWeight:700, color:LAB_COLOR[lab]}}>{lab}</td>
                  <td style={{padding:"10px 12px", textAlign:"center"}}><NilaiChip nilai={nb}/></td>
                  <td style={{padding:"10px 12px", textAlign:"center"}}><NilaiChip nilai={nu}/></td>
                  <td style={{padding:"10px 12px", textAlign:"center"}}>
                    {na?<span style={{fontWeight:900, fontSize:15, color:na>=70?C.primary:C.danger}}>{na.toFixed(0)}</span>:<span style={{color:C.textFaint}}>—</span>}
                  </td>
                  <td style={{padding:"10px 12px", textAlign:"center", color:C.textMuted}}>{rataGelombang[lab]||"—"}</td>
                  <td style={{padding:"10px 12px", textAlign:"center"}}>
                    {diff!==null?<Badge color={diff>=0?C.primary:C.danger}>{diff>=0?"▲":"▼"} {Math.abs(diff).toFixed(1)}</Badge>:<span style={{color:C.textFaint}}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [gelombang] = useState(GELOMBANG_DATA);

  const tabsByRole = {
    master: [
      { id:"dashboard", icon:"🏠", label:"Dashboard" },
      { id:"mahasiswa", icon:"👥", label:"Mahasiswa" },
      { id:"laporan", icon:"📄", label:"Laporan" },
    ],
    koord_lab: [
      { id:"dashboard", icon:"🏠", label:"Dashboard" },
      { id:"input_nilai", icon:"📝", label:"Input Nilai & ACC" },
    ],
    mahasiswa: [{ id:"dashboard", icon:"👤", label:"Portal Saya" }],
    akademik: [{ id:"dashboard", icon:"📁", label:"BAP Bulanan" }],
  };

  if (!user) return <LoginPage onLogin={u => { setUser(u); setActiveTab("dashboard"); }} />;

  const tabs = tabsByRole[user.role] || [];

  const renderContent = () => {
    if (user.role === "master") {
      if (activeTab === "dashboard") return <MasterDashboard gelombang={gelombang} />;
      if (activeTab === "mahasiswa") return <MasterMahasiswa gelombang={gelombang} />;
      if (activeTab === "laporan") return <MasterLaporan gelombang={gelombang} />;
    }
    if (user.role === "koord_lab") {
      if (activeTab === "dashboard") return <KoordLabDashboard user={user} gelombang={gelombang} />;
      if (activeTab === "input_nilai") return <KoordLabInputNilai user={user} gelombang={gelombang} />;
    }
    if (user.role === "mahasiswa") return <MahasiswaPortal user={user} gelombang={gelombang} />;
    if (user.role === "akademik") return <AkademikPortal gelombang={gelombang} />;
    return null;
  };

  return (
    <Shell user={user} onLogout={() => setUser(null)} activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs}>
      {renderContent()}
    </Shell>
  );
}
