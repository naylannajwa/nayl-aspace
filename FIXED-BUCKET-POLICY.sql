-- SUPABASE BUCKET POLICY FIX - Bahasa Indonesia

## 🚨 **ERROR SOLVED** – Jalankan ini di Storage Policies

### Storage → images bucket → Policies → New Policy:

```
NAME: Public Images Read
ALLOWED ROWS: SELECT
USING EXPRESSION:
```
```
true
```
```
(with semicolon)
```

### Atau SQL Editor:
```
-- Bucket sudah ada? Skip create
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO NOTHING;

-- Policy Public Read
CREATE POLICY "Public images read" ON storage.objects
FOR SELECT USING (bucket_id = 'images');
```

**TEST:**
```
1. Upload gambar di admin.html
2. Console F12 → cek URL gambar
3. interests.html → gambar muncul!
```

**DONE!** No more syntax error 🚀

