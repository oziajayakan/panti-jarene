# Panduan Menjalankan Web Donasi & Dashboard Admin As-Sholihin

Repositori resmi GitHub:
🔗 **https://github.com/oziajayakan/panti-jarene.git**

---

## 1. Kebutuhan Sistem (Prerequisites)
Pastikan di komputer Anda sudah terpasang:
- **Node.js** (Versi 18 LTS atau 20+)
- **Git**

---

## 2. Cara Clone & Menjalankan di Lokal (Development)

### Langkah 1: Clone Repositori
Buka Terminal / Command Prompt / PowerShell, lalu jalankan:
```bash
git clone https://github.com/oziajayakan/panti-jarene.git
cd panti-jarene
```

### Langkah 2: Install Dependensi
```bash
npm install
```
*(Catatan pengguna Windows PowerShell: jika ada policy script, gunakan `npm.cmd install`)*

### Langkah 3: Konfigurasi File Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi di file `.env` (Midtrans Sandbox Server Key):
```env
VITE_API_BASE_URL=/api
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxx
```

### Langkah 4: Jalankan Server Lokal
```bash
npm run dev
```
Buka peramban (browser) di:
- **Halaman Utama (Publik):** `http://localhost:5173/`
- **Portal Donatur:** `http://localhost:5173/portal-donatur`
- **Dashboard Admin:** `http://localhost:5173/admin`

---

## 3. Akun Uji Coba (Login Credentials)

### A. Dashboard Admin (`/admin`)
- **Email:** `admin@panti.com`
- **Kata Sandi:** `password`
- **Fitur Utama:**
  - Layout modern ala Shadcn Admin (Sidebar Collapsible & Rail Toggle).
  - Command Palette global (`Ctrl + K` / `Cmd + K`).
  - Sistem AI Investigasi Kelayakan Adopsi Anak (PP 54/2007).
  - Rekonsiliasi Kas Nirlaba PSAK 109 & Sinkronisasi Otomatis Midtrans.
  - CRUD Galeri & Postingan Dokumentasi Kegiatan.

### B. Portal Donatur (`/portal-donatur`)
- **Akun 1 (Donatur Terbuka):**
  - **Email / No. WA:** `donatur@panti.com` / `081234567890`
  - **Kata Sandi:** `password`
- **Akun 2 (Mode Anonim / Hamba Allah):**
  - **Email / No. WA:** `donatur@gmail.com` / `081298765432`
  - **Kata Sandi:** `password`
- **Fitur Utama:**
  - Unggah & ganti foto profil.
  - Riwayat donasi & unduh E-Kwitansi resmi (PDF).
  - Waktu tunggu pembayaran Payment Gateway (15 menit) dengan *auto-cancel*.

---

## 4. Cara Build untuk Production & Deploy (Vercel)

Jika ingin mem-build bundle statis:
```bash
npm run build
```
Hasil build akan berada di direktori `dist/`.

### Deploy ke Vercel:
Proyek ini sudah dilengkapi file konfigurasi `vercel.json` dan serverless functions di folder `api/`.
1. Masuk ke [Vercel](https://vercel.com) dan impor repositori `oziajayakan/panti-jarene`.
2. Framework Preset: **Vite**.
3. Masukkan Environment Variable `MIDTRANS_SERVER_KEY` di pengaturan proyek Vercel.
4. Klik **Deploy**. Setiap *push* ke branch `main` akan terdeploy secara otomatis.
