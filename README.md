# 🎰 Full-Stack Judol System Architecture & RMS Telemetry Simulation

Aplikasi simulasi interaktif berbasis web yang mendemonstrasikan arsitektur sistem perjudian online secara komprehensif: **Frontend Game Client (Video Slot Engine 5x3)** yang terhubung secara *real-time* dengan **Backend Risk Management System (RMS) & Operator Dashboard**.

> ⚠️ **DISCLAIMER EDUKASI & ETIKA:**
> Proyek ini dibuat murni untuk keperluan **Edukasi, Riset Rekayasa Perangkat Lunak, dan Literasi Publik** mengenai cara kerja algoritma perjudian online serta trik manipulasi psikologis di balik sistem bandar. **Tidak menggunakan uang asli dan tidak memfasilitasi transaksi nyata.**

---

## 📑 Daftar Isi
1. [Arsitektur & Cara Kerja Sistem](#-arsitektur--cara-kerja-sistem)
2. [Trik Manipulasi Psikologis yang Disimulasikan](#-trik-manipulasi-psikologis-yang-disimulasikan)
3. [Fitur-Fitur Utama](#-fitur-fitur-utama)
4. [Struktur Proyek](#-struktur-proyek)
5. [Panduan Deploy ke Vercel](#-panduan-deploy-ke-vercel)
6. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)

---

## 🧠 Arsitektur & Cara Kerja Sistem

Aplikasi ini membagi layar menjadi dua perspektif interaktif yang saling bertolak belakang namun terhubung langsung:

```
+-----------------------------------+--------------------------------------+
|     FRONTEND GAME CLIENT          |        BACKEND RMS OPERATOR          |
|  (Apa yang dilihat oleh pemain)   |   (Apa yang dikendalikan oleh bandar)|
+-----------------------------------+--------------------------------------+
| • Visual Slot Menarik (5x3)       | • Dynamic RTP Throttler (50% - 115%) |
| • Efek Audio Selebrasi Menang     | • Profiling Pemain & Lifecycle Stage |
| • Ilusi Kontrol (Turbo, Auto)     | • Plafon Liabilitas Bankroll Bandar  |
| • Notifikasi Kemenangan Semu      | • Telemetri Chart.js & Audit Trail   |
+-----------------------------------+--------------------------------------+
```

### Alur Kerja Transaksi Putaran (*Spin Cycle*):
1. **Pemain Mengirim Permintaan Spin**: Nilai taruhan dipotong dari saldo pemain dan dicatat sebagai *Turnover* sistem.
2. **Backend RMS Menghitung *Outcome***: Bukannya RNG acak murni yang independen, sistem RMS mengevaluasi profil pemain (status pemain baru, riwayat deposit, turnover, serta plafon risiko bandar).
3. **Pemberian Bobot Peluang Dinamis**: Target RTP disesuaikan berdasarkan tahap siklus pemain (*Hooking*, *Milking*, atau *Retention*).
4. **Respon Dikirim ke Frontend**: Frontend merefleksikan hasil dengan efek animasi *staggered spin*, suara *synthesizer*, dan penyesuaian saldo.

---

## 🎯 Trik Manipulasi Psikologis yang Disimulasikan

Proyek ini mengungkap cara bandar mengeksploitasi celah kognitif pemain:

### 1. *Player Lifecycle Hooking* (Siklus 3 Tahap)
- **Fase Pancingan (*Hooking / Gacor*)**: Pemain baru (*User A*) diberikan RTP awal tinggi (115%+) dan peluang menang yang sering. Tujuannya adalah memicu lonjakan dopamin dan membuat pemain merasa "situs ini mudah menang" sehingga terdorong untuk deposit lebih banyak.
- **Fase Penyedotan (*Milking / Silent Extraction*)**: Setelah pemain melewati ambang tertentu, RTP diturunkan secara diam-diam (*User B*, RTP ~80%). Pemain terus bertaruh karena terbiasa menang di awal.
- **Fase Retensi (*Retention Trap*)**: Ketika saldo pemain menipis di bawah 2x nominal bet (*User C*), sistem sengaja menyuntikkan kemenangan kecil atau *Near-Miss* untuk mencegah pemain menutup aplikasi (*churn prevention*).

### 2. *Near-Miss Effect* (Psikologi Nyaris Menang)
Sistem secara sengaja menampilkan 2 simbol Scatter di Reel 1 dan 2 dengan efek musik ketegangan tinggi, sementara Reel ke-5 sengaja dibuat meleset tepat 1 baris. Secara neurologis, fenomena ini memicu otak bereaksi seperti halnya kemenangan sungguhan, membuat pemain merasa kemenangan berikutnya "hanya tinggal sedikit lagi".

### 3. *Loss Disguised as Win* (LDW)
Pemain bertaruh Rp 50.000 dan sistem memberikan pengembalian Rp 15.000 (rugi bersih Rp 35.000). Namun, sistem merayakannya dengan animasi warna hijau terang dan efek audio kemenangan. Secara psikologis, pemain merasa "menang" padahal saldo riilnya terus tergerus.

### 4. Proteksi Liabilitas & *Global Jackpot Lockout* (*Zero-Sum Bankroll Defense*)
Bandar judi online beroperasi berdasarkan alokasi kuota liabilitas (*payout pool*) yang terbatas, bukan mencetak uang tanpa batas. Kemenangan besar satu pemain (*User A*) adalah kerugian likuiditas langsung bagi bandar.
- **Penguncian Jackpot Global (*Global Lockout*)**: Begitu User A memenangkan *Max Win* (Rp 50.000.000), sistem RMS seketika mengunci akses jackpot ke seluruh pemain lain.
- **Intersepsi Penolakan Keras**: Jika User B atau User C mencoba memicu Max Win, server RMS langsung mencegat dan menolak dengan modal dialog resmi: *"🛑 MAX WIN DIBLOKIR SISTEM RMS! Kuota jackpot telah habis disedot oleh User A."*
- **Pemain Lain Dipaksa Menjadi Penambal Margin (*Cold Mode*)**: Selama jackpot terkunci, peluang kemenangan bersih (*Clean Big Win*) untuk pemain lain dimatikan menjadi 0% dan RTP dipangkas ke bawah 60% agar uang kekalahan mereka menutupi liabilitas yang dibawa kabur User A.
- **Penahanan Penarikan Dana (*Withdrawal Hold*)**: Jika pemain yang menang berniat menarik dana, sistem mensimulasikan penundaan pencairan dengan dalih *"Turnover Audit / Verifikasi Rekening"*.

### 5. *Post-MaxWin Greed & Tilt Trap* (Jebakan Sedot Balik Pasca-Jackpot)
Inilah trik paling mematikan dalam industri perjudian:
- Ketika pemain (*User A*) baru saja mendapatkan *Max Win*, otak mereka dibanjiri dopamin ekstrem sehingga merasa sedang *"sangat hoki"* dan cenderung terus memutar atau bahkan menaikkan taruhan (*greed effect*).
- **Sistem RMS Seketika Membalikkan Keadaan (*Downward Spiral*)**: Putaran berikutnya **BUKAN dibuat naik, melainkan DIJATUHKAN DRASTIS**.
- RTP pemain pemenang langsung dipangkas ke titik terendah (**52% – 55%**).
- Kemenangan bersih (*Clean Win*) dilarang total. Sistem sengaja memberikan **Rungkad Beruntun (Pure Loss)** yang diselingi *Near-Miss* agresif (nyaris petir lagi) untuk memancing emosi dan rasa penasaran pemain (*tilt chasing*).
- Tujuannya: Memastikan uang jackpot Rp 50 Juta tersebut **terkuras kembali ludes ke kas bandar** tanpa pemain menyadarinya.

---

## ⚡ Fitur-Fitur Utama

### Sisi Frontend (Game Client):
- **Video Slot Cabinet 5 Gulungan x 3 Baris**: Tampilan kasino modern dengan tema Zeus Olympus, bingkai emas bercahaya, dan kaca reel elegan.
- **Web Audio API Synthesizer**: Efek suara sintesis 100% dari browser (reel tick, scatter riser, sambaran petir, arpeggio kemenangan) tanpa perlu mengunduh aset audio eksternal. Dilengkapi tombol *Mute/Unmute*.
- **Multiplier Petir Zeus**: Multiplier acak dari 2x hingga 50x yang dapat jatuh sewaktu-waktu.
- **Kontrol Taruhan Fleksibel**:
  - Tombol penyesuaian nominal taruhan `+` dan `-`.
  - Tombol *Quick Bet Presets* (10k, 25k, 50k, 100k).
  - Mode **Turbo Spin** untuk animasi berkecepatan tinggi.
  - Mode **Auto Spin (10x)** dengan proteksi otomatis jika saldo habis.
- **Simulasi Transaksi Keuangan**: Fitur *Top-Up (Deposit)* dan *Tarik Dana (Withdraw)* untuk menguji respon sistem kasino.
- **Indikator Kunci Jackpot Dinamis**: Tombol Pemicu Max Win otomatis berubah status menjadi `🔒 Max Win Terkunci (Pemenang)` ketika kuota jackpot server telah disedot pemain lain.

### Sisi Backend (RMS Operator Dashboard):
- **Global Jackpot Lockout & Intersepsi Liabilitas**: Protokol otomatis yang mencegat dan memblokir permintaan jackpot pemain lain saat ada satu pemain yang berhasil Max Win.
- **Pemilihan Mode Algoritma**:
  - `RMS_DYNAMIC`: Siklus riil judol (pancingan gacor lalu sedot bertahap).
  - `FAIR`: Standar matematis probabilitas independen (*fair casino* 96% RTP).
  - `EXTREME_DRAIN`: Mode sedot agresif (RTP 65%) untuk memulihkan liabilitas bandar.
- **Visualisasi Chart.js Real-time**:
  - **Kurva Telemetri RTP**: Grafik garis perbandingan *Target RMS RTP* vs *Running Actual Player RTP*.
  - **Cashflow & GGR**: Grafik batang *Turnover*, total penarikan *Payout*, dan laba bersih bandar (*Net Profit*).
- **Matriks Metrik Eksploitasi Psikologis**: Penghitung otomatis jumlah putaran *Near-Miss*, *LDW*, *Clean Wins*, dan *Pure Losses*.
- **Matriks Profil Pemain**: Informasi real-time mengenai tahapan pemain, batas taruhan dinamis, total payout, dan rating risiko.
- **Audit Trail & Event Log Real-time**: Log server interaktif yang mencatat setiap peristiwa algoritma secara transparan.

---

## 📂 Struktur Proyek

```text
judol-simulation/
├── index.html                   # Halaman antarmuka utama (Frontend + RMS)
├── full_stack_judol_system_simulation.html # Salinan kompatibilitas file utama
├── css/
│   └── style.css                # Styling kabinet slot, animasi reel, dan tema dark casino
├── js/
│   └── app.js                   # Engine slot, Web Audio synthesizer, dan algoritma RMS
├── vercel.json                  # Konfigurasi deployment Vercel (routing & security headers)
├── package.json                 # Metadata proyek & skrip npm
├── .gitignore                   # Daftar pengabaian file Git
└── README.md                    # Dokumentasi lengkap arsitektur sistem
```

---

## 🚀 Panduan Deploy ke Vercel

Aplikasi ini merupakan aplikasi web statis modern murni (HTML, CSS, JS Native) sehingga dapat langsung di-deploy ke **Vercel** secara gratis dalam hitungan detik.

### Metode 1: Menggunakan Git & Dashboard Vercel (Paling Direkomendasikan)
1. Buat repositori baru di GitHub (misalnya: `judol-system-simulation`).
2. Masuk ke direktori proyek di terminal dan hubungkan ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit full-stack judol simulation"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/judol-system-simulation.git
   git push -u origin main
   ```
3. Buka [Vercel Dashboard](https://vercel.com/dashboard).
4. Klik tombol **"Add New..."** -> **"Project"**.
5. Pilih repositori GitHub Anda, lalu klik **"Import"**.
6. Pada bagian *Build & Output Settings*, biarkan default (karena berupa static site).
7. Klik **"Deploy"**. Selesai! Web Anda akan aktif di URL seperti `https://judol-system-simulation.vercel.app`.

---

### Metode 2: Menggunakan Vercel CLI (Langsung dari Terminal)
1. Pasang Vercel CLI di komputer Anda (jika belum ada):
   ```bash
   npm install -g vercel
   ```
2. Jalankan perintah login:
   ```bash
   vercel login
   ```
3. Di dalam folder `judol-simulation`, jalankan perintah deploy:
   ```bash
   vercel
   ```
4. Jawab pertanyaan di terminal:
   - *Set up and deploy?* -> Tekan **Y**
   - *Which scope?* -> Pilih akun Anda
   - *Link to existing project?* -> Tekan **N**
   - *What's your project's name?* -> Tekan **Enter**
   - *In which directory is your code located?* -> Tekan **Enter** (`./`)
5. Untuk deploy langsung ke production URL:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Teknologi yang Digunakan
- **HTML5 & Vanilla JavaScript (ES6+)**: Logika *Game Engine*, State Management, dan manipulasi DOM performa tinggi.
- **Web Audio API**: Pembangkitan audio sintetis tanpa aset suara eksternal.
- **Tailwind CSS & Custom CSS3**: Desain antarmuka kabinet gelap (*Dark Glassmorphism*) dan efek animasi putaran reel.
- **Chart.js**: Visualisasi telemetri data real-time untuk kurva RTP dan GGR bandar.
- **FontAwesome 6**: Ikonografi antarmuka platform.
- **Vercel**: Platform hosting dan deployment edge berkecepatan tinggi.

---

## 📜 Lisensi
Proyek ini didistribusikan di bawah lisensi **MIT License**. Bebas digunakan, dipelajari, dan dikembangkan untuk keperluan edukasi dan literasi publik.
