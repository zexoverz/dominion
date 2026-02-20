# 🎤 ARCANE QUEST 02 — DEMO DAY DI MAGIC TEMPLE

> **"Bikin app keren tapi gak bisa presentasi? Sama aja kayak bikin pedang tapi gak bisa make. Di dunia kerja, lo HARUS bisa explain dan demo kerjaan lo."**

---

## 🏛️ Magic Temple — Discord Voice Channel

Setiap group **WAJIB** presentasi project mereka di Discord voice channel **"Magic Temple"**.

Ini bukan opsional. Ini bukan nice-to-have. **Ini MANDATORY.**

Absent = **-20% individual grade**. No exceptions.

---

## 📋 Format Presentasi

**15 menit per tim.** Gak boleh lebih, gak boleh (terlalu) kurang.

| Segment | Durasi | Detail |
|---------|--------|--------|
| **Problem Statement** | 2 min | Masalah apa yang app kalian solve? Kenapa orang butuh ini? |
| **Solution Overview** | 2 min | High-level overview: fitur utama, tech stack, architecture |
| **Live Demo** | 7 min | Share screen di Discord. Demo SEMUA fitur utama. Setiap member demo bagian mereka. |
| **Technical Architecture** | 2 min | System design, database schema, interesting technical decisions |
| **Q&A** | 2 min | Pertanyaan dari mentor dan audience. SEMUA member harus bisa jawab. |

---

## ⚠️ Rules

### Wajib

1. **SEMUA anggota tim HARUS bicara** — bukan cuma 1 orang yang present, sisanya diem. Setiap member harus demo/explain bagian yang mereka kerjain.
2. **Share screen di Discord** untuk live demo — bukan slides, bukan recording. LIVE.
3. **App HARUS deployed dan accessible** — demo dari deployed URL, bukan localhost.
4. **Have backup recording** — record demo kalian sebelumnya (pakai OBS atau screen recorder). Kalau internet mati pas demo, at least ada recording.

### Jangan

- ❌ Jangan cuma baca slides — ini demo, bukan presentasi PowerPoint
- ❌ Jangan demo dari localhost — harus deployed URL
- ❌ Jangan 1 orang doang yang ngomong — semua member HARUS participate
- ❌ Jangan exceed 15 menit — mentor bakal cut

---

## 🖥️ Live Demo Flow (7 menit)

Ini recommended flow buat demo. Adjust sesuai project kalian:

### 1. Happy Path (3 min)
Walk through the main user journey dari awal sampai akhir:
- Register → Login → Core feature usage → Result

### 2. Key Features (2 min)
Highlight fitur-fitur yang paling impressive:
- Real-time WebSocket demo (buka 2 browser, show live updates)
- Admin panel walkthrough
- File upload demo
- RBAC demo (login as different roles, show different access)

### 3. Team Feature Showcase (2 min)
Setiap member briefly demo 1 fitur yang mereka personally build:
- "Gue ngerjain notification system, ini cara kerjanya..."
- "Bagian gue admin panel, lo bisa liat..."

---

## 🎯 Technical Architecture Segment (2 menit)

Show 1-2 dari ini:
- System architecture diagram (frontend ↔ backend ↔ database ↔ WebSocket)
- Database ERD
- Interesting technical decisions ("Kenapa kita pilih Zustand vs Redux?")
- Challenges & how you solved them

---

## ❓ Q&A Rules (2 menit)

- Mentor bakal tanya **random member** tentang code yang BUKAN bagian mereka
- Kalian harus paham **keseluruhan codebase**, bukan cuma bagian masing-masing
- Jawab dengan jujur — "Gue gak tau" lebih baik daripada bullshit
- Audience (tim lain) juga boleh tanya

---

## 💡 Tips buat Discord Demo

### Sebelum Demo Day

- [ ] **Test screen share** di Discord sebelumnya — pastiin work, resolution bagus
- [ ] **Test mic** — pastiin suara jelas, gak ada echo
- [ ] **Stable internet** — kalau WiFi unreliable, pake kabel LAN atau hotspot HP
- [ ] **Close unnecessary tabs** — biar Discord gak lag
- [ ] **Practice run minimal 2x** — time it, pastiin 15 menit
- [ ] **Record backup demo** — pakai OBS/screen recorder
- [ ] **Prepare seeder data** — app harus udah ada data dummy yang bagus buat demo

### Pas Demo Day

- [ ] Join Magic Temple voice channel **10 menit sebelum jadwal**
- [ ] Make sure semua member udah join voice channel
- [ ] Close Slack, email, notification — biar gak ada popup pas demo
- [ ] Share screen pake "Application Window" bukan "Entire Screen" (lebih aman)
- [ ] Siapin semua browser tabs yang dibutuhin (deployed app, admin panel, 2nd user)
- [ ] **Speak loudly and clearly** — Discord voice kadang compress audio

### Kalau Ada Masalah

- App crash? **Stay calm.** Explain apa yang harusnya terjadi, lanjut ke fitur lain.
- Internet mati? **Play backup recording.**
- Screen share gak work? Minta member lain yang share screen.
- Lupa mau ngomong apa? Liat notes — boleh punya cheat sheet.

---

## 📊 Grading Presentasi

| Kriteria | Bobot | Detail |
|----------|-------|--------|
| **Clarity** | 30% | Penjelasan jelas, mudah dimengerti, structured |
| **Demo Smoothness** | 30% | Demo lancar, fitur work, no major bugs |
| **Q&A Handling** | 20% | Jawab pertanyaan dengan baik, semua member bisa jawab |
| **Team Participation** | 20% | Semua member bicara, equal participation, good teamwork vibe |

### Grade Breakdown

| Grade | Deskripsi |
|-------|-----------|
| **A** | Demo flawless, semua fitur jalan, Q&A solid, semua member participate equally |
| **B** | Demo mostly smooth, minor hiccups, Q&A decent, semua member bicara |
| **C** | Demo ada beberapa masalah, beberapa fitur gak jalan, Q&A lemah |
| **D** | Demo banyak masalah, banyak fitur gak jalan, cuma 1-2 orang yang ngomong |
| **F** | Gak present / gak deploy / cuma 1 orang yang hadir |

---

## 📅 Demo Day Schedule

Jadwal presentasi akan diumumkan di Discord channel. Setiap tim dapat slot 15 menit + 5 menit buffer.

Format:
```
10:00 - 10:20  Tim Alpha    (Quest A — Arcane Marketplace)
10:20 - 10:40  Tim Beta     (Quest C — Arcane Board)
10:40 - 11:00  Tim Gamma    (Quest B — Arcane Chronicle)
11:00 - 11:10  BREAK
11:10 - 11:30  Tim Delta    (Quest D — Arcane Codex)
11:30 - 11:50  Tim Epsilon  (Quest E — Custom)
11:50 - 12:00  Closing & Awards
```

> Jadwal final akan di-announce H-2 di Discord.

---

## 🏆 Awards

Setelah semua tim present, akan ada voting untuk:

- 🥇 **Best Overall Project** — project terbaik secara keseluruhan
- 🎨 **Best UI/UX** — design paling polished dan user-friendly
- ⚡ **Best Technical** — implementasi paling impressive secara teknis
- 🎤 **Best Presentation** — presentasi paling engaging dan clear
- 🤝 **Best Teamwork** — kolaborasi tim terbaik (based on git history + presentation)

---

**Prepare well. Present with confidence. Own your work.**

**See you at the Magic Temple! 🏛️⚔️**
