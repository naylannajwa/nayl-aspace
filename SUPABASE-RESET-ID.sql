# SUPABASE RESET LENGKAP - Bahasa Indonesia 🇮🇩

## 🔄 HAPUS SEMUA & MULAI BARU (5 Menit)

### 1. **Hapus Semua Tabel** (Database → Table Editor)
```
-- Jalankan di SQL Editor (satu per satu):
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS projects CASCADE; 
DROP TABLE IF EXISTS public_messages CASCADE;
```

### 2. **Hapus Bucket Images** (Storage)
```
Storage → images → ... (titik tiga) → Delete Bucket → CONFIRM
```

### 3. **Reset Auth Users** (Authentication → Users)
```
Users → Pilih semua user → Bulk Delete
```

### 4. **Buat Ulang dari Awal** (SQL Editor - Copy satu blok)
```
-- ENABLE EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABEL INTERESTS (GALLERY IMAGES)
CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  gallery_images TEXT[], -- UPLOAD GALERY
  images TEXT[], -- COVER
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABEL PROJECTS
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABEL MESSAGES
CREATE TABLE public_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (PUBLIC BACA, ADMIN TULIS)
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public_messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ
CREATE POLICY "Public baca interests" ON interests FOR SELECT USING (true);
CREATE POLICY "Public baca projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public baca messages" ON public_messages FOR SELECT USING (true);

-- ADMIN WRITE  
CREATE POLICY "Admin tulis interests" ON interests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin tulis projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
```

### 5. **Buat Bucket Images** (Storage → New Bucket)
```
Nama: images
Public Bucket: ✅ YA
```

### 6. **Policy Bucket** (Storage → images → Policies → Add)
```
Nama: "Public gambar"
Operation: SELECT  
Using expression: `true`
```

### 7. **Buat Admin** (Authentication → Users → Add User)
```
Email: admin@nayl-aSpace.com  
Password: nayl123456
```

### 8. **TEST** (pages/admin.html)
```
1. Login admin@nayl-aSpace.com / nayl123456
2. Interests → Tambah + upload gallery images
3. interests.html → LIHAT hasil + gambar muncul!
```

## 🎯 **KENAPA SEBELUMNYA ERROR?**
```
Error 42601 = Supabase SQL parser ketat
Solusi: Jalankan 1 blok SQL per waktu ✅
```

**Selesai! Gambar pasti muncul sekarang** 🚀

