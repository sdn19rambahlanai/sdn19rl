/* =========================================================
   script.js - Website SDN 19 Rambah Lanai
   Memasang foto asli ke menggantikan emoji di index.html.
   - Jika file foto ADA     -> foto tampil.
   - Jika file foto BELUM ada -> emoji lama tetap tampil (web tidak rusak).
   Cara pakai: taruh foto di folder "images", lalu edit daftar di bawah.
   ========================================================= */

// ---------------------------------------------------------
// 1. DAFTAR FOTO  -->  EDIT BAGIAN INI SAJA
// ---------------------------------------------------------
const FOTO = {

  // Logo sekolah (navbar, kartu hero, footer). Kosongkan "" jika belum ada.
  logo: "images/logo.png",

  // Foto Kepala Sekolah (bagian Sambutan + kartu Pimpinan Sekolah)
  kepsek: "images/kepala-sekolah.jpg",

  // GALERI KEGIATAN
  // 5 foto pertama menggantikan 5 kotak berwarna yang sudah ada (urut dari atas).
  // Foto ke-6 dan seterusnya akan ditambahkan sebagai kotak baru.
  // "caption" boleh dihapus untuk 5 foto pertama (akan memakai tulisan yang sudah ada).
  galeri: [
    { src: "images/galeri-1.jpg" },                                  // Upacara Bendera Hari Senin (kotak besar)
    { src: "images/galeri-2.jpg" },                                  // Senam Pagi Bersama
    { src: "images/galeri-3.jpg" },                                  // Latihan Pramuka
    { src: "images/galeri-4.jpg" },                                  // Kegiatan Kultum Ramadan
    { src: "images/galeri-5.jpg" },                                  // Penampilan Drumband
    { src: "images/galeri-6.jpg", caption: "Kegiatan Belajar" },     // tambahan
    { src: "images/galeri-7.jpg", caption: "Kegiatan Olahraga" }     // tambahan
    // tambah foto lain di sini, contoh:
    // { src: "images/galeri-8.jpg", caption: "Perpisahan Kelas VI" },
  ],

  // EKSTRAKURIKULER
  ekskul: {
    pramuka:  "images/ekskul-pramuka.jpg",
    drumband: "images/ekskul-drumband.jpg",
    english:  "images/ekskul-english.jpg"
  },

  // BERITA
  berita: {
    utama:  "images/berita-1.jpg",
    samping: [
      "images/berita-2.jpg",
      "images/berita-3.jpg",
      "images/berita-4.jpg"
    ]
  },

  // GURU & STAF  (kata kunci nama : lokasi foto)
  guru: {
    "Helmi Hotnida":      "images/guru/helmi-hotnida.jpg",
    "Oten Saputra":       "images/guru/oten-saputra.jpg",
    "Ali Umar":           "images/guru/ali-umar.jpg",
    "Siti Suharni":       "images/guru/siti-suharni.jpg",
    "Latifah Hannum":     "images/guru/latifah-hannum.jpg",
    "Halimatus Saddiah":  "images/guru/halimatus-saddiah.jpg",
    "Rohana Siregar":     "images/guru/rohana-siregar.jpg",
    "Erri Sumita":        "images/guru/erri-sumita.jpg",
    "Resmita":            "images/guru/resmita.jpg",
    "Paisal Ikhlas":      "images/guru/paisal-ikhlas.jpg",
    "Ade Zaini":          "images/guru/ade-zaini.jpg",
    "Muhammad Darwis":    "images/guru/darwis-setiawan.jpg"
  }
};

// ---------------------------------------------------------
// 2. FUNGSI BANTU
// ---------------------------------------------------------

// Cek apakah file foto bisa dimuat
function cekFoto(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

// Hapus teks emoji langsung di dalam elemen (elemen anak seperti label tetap aman)
function hapusEmoji(el) {
  Array.from(el.childNodes).forEach((n) => {
    if (n.nodeType === 3 && n.textContent.trim() !== "") n.remove();
  });
}

// Pasang foto sebagai latar elemen. Return true jika berhasil.
async function pasangFoto(el, src, mode) {
  if (!el || !src) return false;
  const ada = await cekFoto(src);
  if (!ada) return false; // foto belum ada -> biarkan emoji
  hapusEmoji(el);
  el.style.backgroundImage = 'url("' + src + '")';
  el.style.backgroundSize = mode || "cover";
  el.style.backgroundPosition = "center";
  el.style.backgroundRepeat = "no-repeat";
  return true;
}

// ---------------------------------------------------------
// 3. LIGHTBOX (foto galeri diperbesar saat diklik)
// ---------------------------------------------------------
let lbList = [];
let lbIndex = 0;
let lbEl, lbImg, lbCap;

function buatLightbox() {
  const style = document.createElement("style");
  style.textContent = `
    .sdn-lb { position: fixed; inset: 0; background: rgba(10,20,50,.92);
      display: none; align-items: center; justify-content: center;
      flex-direction: column; z-index: 9999; padding: 20px; }
    .sdn-lb.aktif { display: flex; }
    .sdn-lb img { max-width: 94%; max-height: 78vh; border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,.5); }
    .sdn-lb-cap { color: #fff; margin-top: 14px; font-size: 15px;
      font-weight: 700; text-align: center; font-family: 'Nunito', sans-serif; }
    .sdn-lb button { position: absolute; background: rgba(255,255,255,.15);
      color: #fff; border: none; font-size: 26px; cursor: pointer;
      border-radius: 50%; width: 46px; height: 46px; line-height: 1;
      transition: background .2s; }
    .sdn-lb button:hover { background: rgba(250,204,21,.6); }
    .sdn-lb-x { top: 20px; right: 20px; }
    .sdn-lb-p { left: 16px; top: 50%; transform: translateY(-50%); }
    .sdn-lb-n { right: 16px; top: 50%; transform: translateY(-50%); }
  `;
  document.head.appendChild(style);

  lbEl = document.createElement("div");
  lbEl.className = "sdn-lb";
  lbEl.innerHTML =
    '<button class="sdn-lb-x" aria-label="Tutup">&times;</button>' +
    '<button class="sdn-lb-p" aria-label="Sebelumnya">&#10094;</button>' +
    '<img src="" alt="">' +
    '<div class="sdn-lb-cap"></div>' +
    '<button class="sdn-lb-n" aria-label="Berikutnya">&#10095;</button>';
  document.body.appendChild(lbEl);

  lbImg = lbEl.querySelector("img");
  lbCap = lbEl.querySelector(".sdn-lb-cap");

  lbEl.querySelector(".sdn-lb-x").onclick = tutupLightbox;
  lbEl.querySelector(".sdn-lb-p").onclick = (e) => { e.stopPropagation(); geser(-1); };
  lbEl.querySelector(".sdn-lb-n").onclick = (e) => { e.stopPropagation(); geser(1); };
  lbEl.addEventListener("click", (e) => { if (e.target === lbEl) tutupLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (!lbEl.classList.contains("aktif")) return;
    if (e.key === "Escape") tutupLightbox();
    if (e.key === "ArrowLeft") geser(-1);
    if (e.key === "ArrowRight") geser(1);
  });
}

function bukaLightbox(i) {
  lbIndex = i;
  tampilLightbox();
  lbEl.classList.add("aktif");
  document.body.style.overflow = "hidden";
}
function tutupLightbox() {
  lbEl.classList.remove("aktif");
  document.body.style.overflow = "";
}
function geser(arah) {
  lbIndex = (lbIndex + arah + lbList.length) % lbList.length;
  tampilLightbox();
}
function tampilLightbox() {
  const f = lbList[lbIndex];
  lbImg.src = f.src;
  lbImg.alt = f.caption;
  lbCap.textContent = f.caption + "  (" + (lbIndex + 1) + "/" + lbList.length + ")";
}

// ---------------------------------------------------------
// 4. PASANG FOTO KE SETIAP BAGIAN
// ---------------------------------------------------------

// Logo
async function pasangLogo() {
  if (!FOTO.logo) return;
  const targets = document.querySelectorAll(".nav-logo-icon, .footer-logo-icon, .school-emblem");
  for (const el of targets) {
    const ok = await pasangFoto(el, FOTO.logo, "contain");
    if (ok) {
      el.style.backgroundColor = "#fff";
      el.style.boxShadow = "0 4px 14px rgba(0,0,0,.2)";
    }
  }
}

// Kepala sekolah (bagian sambutan)
async function pasangKepsek() {
  await pasangFoto(document.querySelector(".sambutan-avatar"), FOTO.kepsek);
}

// Guru & staf
async function pasangGuru() {
  const kartu = document.querySelectorAll(".guru-card");
  for (const k of kartu) {
    const namaEl = k.querySelector(".guru-name");
    if (!namaEl) continue;
    const nama = namaEl.textContent;
    for (const kunci in FOTO.guru) {
      if (nama.includes(kunci)) {
        await pasangFoto(k.querySelector(".guru-avatar"), FOTO.guru[kunci]);
        break;
      }
    }
  }
}

// Ekstrakurikuler
async function pasangEkskul() {
  for (const jenis in FOTO.ekskul) {
    const box = document.querySelector(".ekskul-img." + jenis);
    const ok = await pasangFoto(box, FOTO.ekskul[jenis]);
    if (ok) {
      const emoji = box.querySelector(".ekskul-emoji");
      if (emoji) emoji.style.display = "none";
    }
  }
}

// Berita
async function pasangBerita() {
  await pasangFoto(document.querySelector(".berita-img-main"), FOTO.berita.utama);
  const kecil = document.querySelectorAll(".berita-small-img");
  for (let i = 0; i < kecil.length; i++) {
    await pasangFoto(kecil[i], FOTO.berita.samping[i]);
  }
}

// Galeri
async function pasangGaleri() {
  const grid = document.querySelector(".galeri-grid");
  if (!grid) return;
  const itemAda = Array.from(grid.querySelectorAll(".galeri-item"));

  for (let i = 0; i < FOTO.galeri.length; i++) {
    const cfg = FOTO.galeri[i];
    let item = itemAda[i];

    if (item) {
      // kotak yang sudah ada di index.html
      const frame = item.querySelector(".galeri-frame");
      const labelEl = item.querySelector(".galeri-label");
      const ok = await pasangFoto(frame, cfg.src);
      if (ok) {
        item.dataset.foto = cfg.src;
        item.dataset.caption = cfg.caption || (labelEl ? labelEl.textContent : "Foto kegiatan");
      }
    } else {
      // kotak baru (foto tambahan) - hanya dibuat jika file fotonya ada
      const ada = await cekFoto(cfg.src);
      if (!ada) continue;
      item = document.createElement("div");
      item.className = "galeri-item reveal visible";
      item.innerHTML =
        '<div class="galeri-frame g' + ((i % 6) + 1) + '">' +
        '<div class="galeri-label"></div></div>';
      item.querySelector(".galeri-label").textContent = cfg.caption || "Kegiatan sekolah";
      await pasangFoto(item.querySelector(".galeri-frame"), cfg.src);
      item.dataset.foto = cfg.src;
      item.dataset.caption = cfg.caption || "Kegiatan sekolah";
      grid.appendChild(item);
    }
  }

  // Daftar foto untuk lightbox (urut sesuai tampilan)
  const semua = Array.from(grid.querySelectorAll(".galeri-item[data-foto]"));
  lbList = semua.map((el) => ({ src: el.dataset.foto, caption: el.dataset.caption }));
  semua.forEach((el, idx) => {
    el.addEventListener("click", () => bukaLightbox(idx));
  });
}

// ---------------------------------------------------------
// 5. JALANKAN
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  buatLightbox();
  pasangLogo();
  pasangKepsek();
  pasangGuru();
  pasangEkskul();
  pasangBerita();
  pasangGaleri();
});
