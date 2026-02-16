# 🎤 Soft Skills: Demo Day Preparation

## ETHJKT Phase 2 — Week 5: Fullstack Capstone

> Demo Day itu bukan cuma "showing code" — ini adalah **storytelling**. Lo menceritakan perjalanan lo dari nol sampai build fullstack app. Make it count.

---

## 🎯 Apa Itu Demo Day?

Demo Day adalah presentasi akhir dimana lo **demo capstone project** ke komunitas ETHJKT. Ini momen lo buat:

- **Showcase skill** yang udah lo pelajari selama Phase 2
- **Practice presenting** — skill yang wajib buat developer
- **Get feedback** dari sesama developers
- **Celebrate** — lo udah sampai di sini! 🎉

### Format:
- **Durasi:** 5-7 menit presentasi + 3 menit Q&A
- **Audience:** Fellow ETHJKT apprentices + mentors
- **Medium:** Live presentation (screen share)

---

## 📋 Struktur Presentasi

Ikuti framework ini buat presentasi yang **engaging dan terstruktur**:

### 1. Problem Statement (30 detik)

Mulai dengan **masalah** yang project lo solve. Jangan mulai dengan "Jadi saya bikin app yang..."

```
❌ "Jadi saya bikin notes app pakai React dan Express..."
✅ "Pernah nggak lo punya ide di tengah malam, buka HP mau catat, 
    tapi app notes-nya ribet? Gue pernah. Jadi gue bikin solusinya."
```

**Tips:**
- Relate ke pengalaman personal atau masalah nyata
- Bikin audience merasa "Oh iya, gue juga pernah!"
- Keep it short — 2-3 kalimat max

### 2. Solution & Demo (3-4 menit)

Ini bagian utama. **Show, don't tell.**

```
"Jadi gue bikin [Nama App] — [1-sentence description].
Let me show you how it works."

→ [Live Demo: walk through main features]
```

**Demo Flow yang Bagus:**
1. Buka app di browser (production URL!)
2. Walk through **happy path** — user journey utama
3. Show 2-3 key features
4. Tunjukkan responsive design (resize browser)

**Tips Demo:**
- **Pre-login** — Sudah ada akun test yang siap, jangan register dari awal
- **Pre-populate data** — Isi app dengan sample data yang menarik, jangan demo app kosong
- **Narrate** — Jelaskan apa yang lo lakukan: "Sekarang gue bikin note baru..."
- **Speed** — Jangan terlalu cepat, jangan terlalu lambat
- **Font size** — Zoom in browser (Ctrl/Cmd + +) supaya audience bisa baca

### 3. Architecture Overview (1 menit)

Tunjukkan technical depth tanpa overexplain:

```
"Under the hood, app ini pakai React di frontend, 
Express di backend, dan PostgreSQL buat database. 
Semuanya di-deploy — frontend di Vercel, backend di Railway."
```

Prepare slide sederhana atau diagram:

```
┌─────────────────┐    ┌─────────────────┐    ┌──────────┐
│   React + Vite  │───→│  Express API    │───→│PostgreSQL│
│   (Vercel)      │←───│  (Railway)      │←───│(Railway) │
└─────────────────┘    └─────────────────┘    └──────────┘
```

**Mention:**
- Tech stack (React, Express, PostgreSQL, TypeScript)
- Key technical decisions dan kenapa
- Testing approach (unit + integration tests)
- CI/CD pipeline (GitHub Actions)

### 4. Challenges & Learnings (1 menit)

Ini bagian yang bikin presentasi lo **memorable**. Be honest:

```
"Challenge terbesar gue itu [X]. Awalnya gue stuck karena [Y].
Tapi setelah [Z], akhirnya gue bisa solve. 
Lesson learned: [insight]."
```

**Contoh:**
- "Gue struggle sama CORS errors waktu deploy. Butuh 2 jam buat realize bahwa CLIENT_URL-nya salah satu huruf."
- "Database schema gue harus di-redesign 2 kali karena planning awal kurang detail."
- "Testing itu ternyata save waktu. Gue nemu bug yang nggak bakal ketemu manual."

**Kenapa ini penting:**
- Shows growth mindset
- Relatable — semua developer pernah struggle
- Menunjukkan lo **actually built this**, bukan copypaste

### 5. Closing & Future Plans (30 detik)

```
"Ke depan, gue mau tambah [feature X] dan [feature Y].
Repo-nya public di GitHub — feel free to check it out.
Thanks! Ada pertanyaan?"
```

---

## 🎬 Handling Live Demo Failures

Live demo itu **unpredictable**. Server down, internet putus, bug muncul tiba-tiba. It happens to EVERYONE, termasuk senior engineers.

### Persiapan Anti-Gagal:

#### 1. Record Backup Video

```markdown
Sebelum Demo Day:
1. Buka OBS Studio atau screen recorder bawaan OS
2. Record full demo flow (3-4 menit)
3. Narrate sambil record
4. Save video sebagai backup

Kalau live demo gagal:
"Let me switch to a recorded version real quick."
→ Play video
→ Tetap narrate di atasnya
```

#### 2. Prepare Screenshots

Siapkan screenshots key screens di slide:
- Landing page
- Dashboard
- Create/Edit form
- Mobile view

Kalau semua fail, lo masih bisa present pakai screenshots.

#### 3. Have a Local Version Ready

```bash
# Pastiin local development server jalan sebelum presentasi
cd arcane-notes
npm run dev
# localhost:5173 + localhost:3001 sebagai fallback
```

#### 4. The "Demo Gods" Recovery Script

Kalau something breaks live:

```
😅 "Ah, classic demo gods. Jadi yang harusnya terjadi di sini adalah 
[explain what should happen]. Let me try [quick fix / show screenshot / 
play video]. As you can see from [backup], the feature works like this..."
```

**JANGAN:**
- ❌ Panik
- ❌ Spend 3 menit debugging live
- ❌ Minta maaf berlebihan

**DO:**
- ✅ Acknowledge dengan humor
- ✅ Switch ke backup
- ✅ Keep moving

---

## 🗣️ Storytelling Tips

### Hook the Audience

Mulai dengan sesuatu yang **unexpected**:

```
❌ "Hai, nama saya [X], saya bikin [Y]."
✅ "Raise your hand kalau pernah kehilangan catatan penting 
    karena app notes-nya crash."
✅ "3 minggu lalu, gue nggak bisa bedain frontend sama backend. 
    Sekarang, let me show you the fullstack app that I built."
```

### Show Your Personality

Lo bukan robot. Be yourself:
- Kalau lo lucu, tambahin humor
- Kalau lo passionate tentang tech detail, go deeper
- Kalau lo introvert, itu juga oke — prepared and calm beats loud and chaotic

### Pace & Pauses

- **Slow down** di bagian penting
- **Pause** setelah statement besar — let it sink in
- **Jangan** fill silence dengan "umm", "eee" — silence is okay

### Eye Contact (Virtual)

- Look at the camera, bukan layar
- Sesekali lihat chat/reactions

---

## ❓ Q&A Preparation

Setelah presentasi, audience akan tanya. **Prepare for common questions:**

### Technical Questions:

```markdown
Q: "Kenapa pilih [tech X] instead of [tech Y]?"
A: "Gue pilih [X] karena [reason]. [Y] juga bagus, tapi untuk 
    scope project ini, [X] lebih cocok karena [specific reason]."

Q: "Gimana cara handle authentication?"
A: "Gue pakai JWT. User login → server generate token → token 
    disimpan di localStorage → setiap request, token dikirim 
    di header Authorization."

Q: "Apa yang paling challenging?"
A: [Udah prepared di bagian Challenges & Learnings]

Q: "Kalau ada waktu lebih, mau tambah apa?"
A: [Prepared list of future features]
```

### Process Questions:

```markdown
Q: "Berapa lama build ini?"
A: "Total sekitar 7 hari. 2 hari planning, 3 hari building, 
    1 hari testing & deploy, 1 hari polish & preparation."

Q: "Gimana cara organize code-nya?"
A: "Gue pakai monorepo structure — client dan server dalam 
    satu repo. Shared types supaya FE dan BE consistent."
```

### Kalau Nggak Tau Jawabannya:

```
✅ "Good question! Honestly, gue belum explore itu. 
    Tapi gue akan research setelah ini."

❌ "Umm... *makes up answer*"
```

**Honesty > Bullshit.** Semua orang respect developer yang tau batas knowledge-nya.

---

## 📝 Presentation Checklist

### 1 Hari Sebelum Demo Day:

```markdown
## Content
- [ ] Slide deck / notes ready
- [ ] Demo script written (bullet points apa yang di-show)
- [ ] Architecture diagram prepared
- [ ] Challenges & learnings listed

## Technical
- [ ] Production app working (test both URLs)
- [ ] Sample data populated (app nggak kosong)
- [ ] Test account ready (nggak perlu register live)
- [ ] Local dev server as backup
- [ ] Backup video recorded

## Practice
- [ ] Practiced full presentation 1-2 kali
- [ ] Timed it (5-7 menit)
- [ ] Practiced Q&A dengan teman/sendiri

## Setup
- [ ] Browser tabs ready (production URL, GitHub repo)
- [ ] Close unnecessary tabs & notifications
- [ ] Font size zoomed in
- [ ] Stable internet connection
```

### Template Slide Deck (Simple, 5-6 slides):

```markdown
Slide 1: Title
  [App Name] — [1-line description]
  [Your Name] | ETHJKT Phase 2 Capstone

Slide 2: The Problem
  [1-2 sentences about the problem]
  [Optional: image/meme that relates]

Slide 3: Live Demo
  [Switch to browser → demo app]

Slide 4: Architecture
  [Tech stack diagram]
  [Key technical decisions]

Slide 5: Challenges & Learnings
  [2-3 bullet points]

Slide 6: What's Next
  [Future features]
  [GitHub link]
  [Live URL]
  "Questions?"
```

---

## 🏋️ Latihan

### Exercise 1: Write Your Script
1. Tulis opening hook (2-3 kalimat)
2. List fitur yang akan di-demo (urutan)
3. Tulis 2 challenges/learnings
4. Tulis closing statement

### Exercise 2: Practice Run
1. Set timer 7 menit
2. Practice full presentation (sendirian, nggak apa-apa)
3. Record diri sendiri kalau bisa — review hasilnya
4. Adjust pacing

### Exercise 3: Prepare Backups
1. Record backup demo video (3-4 menit)
2. Screenshot 5 key screens
3. Pastiin local dev server jalan sebagai fallback
4. Prepare 5 Q&A answers

---

## 🔑 Key Takeaways

- **Structure matters** — Problem → Solution → Demo → Architecture → Learnings
- **Show, don't tell** — Live demo > slides tentang features
- **Prepare for failure** — Backup video, screenshots, local server
- **Be honest** — Share real challenges, don't fake perfection
- **Practice** — Even 2 runs makes a HUGE difference
- **Enjoy it** — Lo udah sampai di sini, be proud! 🎉

> 🧙‍♂️ "The best Arcane developers aren't just great coders — they can communicate their magic to others." — ETHJKT Wisdom

Demo Day adalah momen lo buat **shine**. Lo udah build something real. Now go tell the world about it! 🚀
