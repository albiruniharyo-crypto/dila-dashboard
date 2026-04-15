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
