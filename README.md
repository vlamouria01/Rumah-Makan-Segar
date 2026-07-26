# RM Segar - Chinese Food Kalimantan

Aplikasi web untuk pemesanan menu RM Segar dengan fitur AI Assistant.

## Cara Deploy ke GitHub Pages (Agar Tidak Kosong)

Masalah "halaman kosong" terjadi karena Anda mengunggah kode sumber (source code) langsung ke GitHub. GitHub Pages membutuhkan hasil "build" agar bisa menampilkan aplikasi React.

Saya sudah menambahkan **GitHub Actions** untuk mengotomatisasi proses ini. Setiap kali Anda melakukan `git push`, aplikasi akan dibangun dan dideploy secara otomatis.

### Langkah-langkah:

1. **Push Kode Terbaru**:
   Pastikan semua file (termasuk folder `.github`) sudah diunggah ke repositori GitHub Anda.

2. **Aktifkan GitHub Actions**:
   - Buka repositori Anda di GitHub.
   - Pergi ke tab **Settings** > **Actions** > **General**.
   - Pastikan "Allow all actions and reusable workflows" terpilih.
   - Di bagian bawah (Workflow permissions), pilih **Read and write permissions**. Klik **Save**.

3. **Konfigurasi AI (Gemini API Key)**:
   Agar fitur AI bisa merespon pelanggan, Anda harus menambahkan API Key:
   - Buka repositori Anda di GitHub.
   - Pergi ke **Settings** > **Secrets and variables** > **Actions**.
   - Klik **New repository secret**.
   - Name: `GEMINI_API_KEY`
   - Value: (Masukkan API Key Gemini Anda dari Google AI Studio).
   - Klik **Add secret**.

4. **Tunggu Proses Build**:
   - Pergi ke tab **Actions** di GitHub.
   - Anda akan melihat workflow "Deploy to GitHub Pages" sedang berjalan.
   - Setelah selesai (centang hijau), aplikasi Anda akan tersedia di branch `gh-pages`.

5. **Setel GitHub Pages**:
   - Pergi ke **Settings** > **Pages**.
   - Di bagian **Build and deployment** > **Branch**, pilih `gh-pages` dan folder `/(root)`.
   - Klik **Save**.

Aplikasi Anda akan online di `https://<username>.github.io/<repo-name>/` dengan semua fitur aktif!

## Fitur
- **Menu Digital**: Bakmie, Kwetiao, Capcai, Kaifon, dan Minuman.
- **AI Assistant**: Chatbot pintar yang membantu pelanggan memilih menu.
- **Keranjang Belanja**: Simulasi pemesanan (Makan di Tempat / Bungkus).
- **Onboarding Tour**: Panduan interaktif untuk pengguna baru.
