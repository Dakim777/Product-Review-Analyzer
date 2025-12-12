# 📊 Product Review Analyzer AI

![React](https://img.shields.io/badge/Frontend-React-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![AI](https://img.shields.io/badge/AI-Gemini%20%26%20HuggingFace-orange)

Aplikasi AI Fullstack untuk menganalisis ulasan pelanggan menggunakan **Natural Language Processing (NLP)** dan **Generative AI**.

Aplikasi ini dapat mendeteksi sentimen (Positif/Negatif/Netral) termasuk **Slang Indonesia** (contoh: *"Gila bagus banget"*) dan menghasilkan ringkasan singkat menggunakan **Google Gemini 2.5**.

---

## ✨ Fitur

- **Analisis Teks:** Input ulasan produk dalam Bahasa Inggris atau Indonesia (formal/slang).
- **Analisis Sentimen Tingkat Lanjut:** Menggunakan `w11wo/indonesian-roberta-base-sentiment-classifier` untuk akurasi tinggi pada konteks Indonesia.
- **Ringkasan AI:** Secara otomatis mengekstrak 3 poin penting menggunakan **Google Gemini 2.0 Flash**.
- **Penyimpanan Persisten:** Menyimpan semua riwayat analisis ke database **PostgreSQL**.
- **UI Modern:** Interface responsif dibangun dengan React, Tailwind CSS, dan desain Glassmorphism.
- **Personal Branding:** Integrasi aset dan identitas khusus.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (Inter Font)
- **HTTP Client:** Axios
- **Icons:** Heroicons & Custom SVG

### Backend
- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy
- **Database Driver:** Psycopg2
- **AI Models:**
  - Hugging Face Transformers (RoBERTa)
  - Google Generative AI (Gemini)

### Database
- **System:** PostgreSQL

---

## 🚀 Instalasi & Pengaturan

Ikuti langkah-langkah berikut untuk menjalankan proyek secara lokal.

### Prasyarat
- Node.js & Yarn/NPM
- Python 3.9+
- PostgreSQL terinstal dan berjalan

### 1. Pengaturan Database
Buat database baru di PostgreSQL bernama `review_db`:
```sql
CREATE DATABASE review_db;
```

### 2. Pengaturan Backend

Navigasi ke folder backend:

```bash
cd backend
```

Buat dan aktifkan Virtual Environment:

```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

Instal dependensi:

```bash
pip install -r requirements.txt
# Atau secara manual:
pip install fastapi uvicorn sqlalchemy psycopg2-binary google-generativeai transformers torch
```

**Konfigurasi:**
Buka `main.py` dan perbarui **GEMINI_API_KEY** Anda:

```python
GEMINI_API_KEY = "YOUR_ACTUAL_API_KEY_HERE"
DATABASE_URL = "postgresql://localhost/review_db" # Perbarui jika menggunakan password
```

Jalankan server:

```bash
python -m uvicorn main:app --reload
```

*Server akan berjalan di `http://localhost:8000`*

### 3. Pengaturan Frontend

Buka terminal baru dan navigasi ke folder frontend:

```bash
cd frontend
```

Instal dependensi:

```bash
yarn install
# atau
npm install
```

Jalankan aplikasi:

```bash
yarn dev
# atau
npm run dev
```

*Aplikasi akan berjalan di `http://localhost:5173`*

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/reviews` | Mengambil semua riwayat analisis dari database |
| `POST` | `/api/analyze-review` | Menganalisis teks baru (Sentimen + Ringkasan) |

---

## 📸 Screenshots

### Dashboard Utama
![Dashboard](./screenshots/dashboard.png)
*Tampilan halaman utama aplikasi dengan form input untuk memasukkan ulasan produk yang akan dianalisis.*

### Hasil Analisis Sentimen
![Analisis Sentimen](./screenshots/sentiment-analysis.png)
*Hasil analisis sentimen menampilkan skor sentimen (Positif/Negatif/Netral) beserta persentase kepercayaan model.*

### Ringkasan AI dengan Gemini
![AI Summary](./screenshots/ai-summary.png)
*Ringkasan otomatis yang dihasilkan oleh Google Gemini 2.5 Flash dalam 3 poin penting dari ulasan.*

### Riwayat Analisis
![History](./screenshots/history.png)
*Daftar riwayat semua analisis yang telah dilakukan, tersimpan dalam database PostgreSQL.*

---

## 👨‍💻 Penulis

**M. Daffa Hakim Matondang (Dakim)**

- **NIM:** 123140002
- **Project:** Tugas Individu 3 - Pengembangan Aplikasi dan Web

---

*Dibuat menggunakan React & FastAPI*
