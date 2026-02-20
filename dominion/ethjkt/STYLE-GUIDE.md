# ETHJKT Course Style Guide (extracted from Phase 0-2 analysis)

## Writing Voice
- First person "gua/gue" not "saya" — casual Indonesian dev talk
- Direct address "kalian" to students
- Mix Indonesian + English technical terms naturally
- Emotional/motivational hooks: "Congrats!!!", bold warnings, mual/burnout/garuk kepala jokes
- Story building before concepts — explain WHY before HOW
- Use analogies to real life (Git = mesin waktu, DOM = blueprint rumah)
- Bold important warnings: ***INGAT INI BUKAN BELAJAR BIKIN WEB NAMUN BELAJAR NGODING***

## Content Structure
- Start with high-level "apa sih ini?" explanation
- Visual diagrams/images/GIFs for concepts
- Working code examples (tested, runnable)
- Step-by-step with screenshots (GitHub-hosted images)
- End with navigation: "Next Part -> [link]"

## Exercise Naming
- Phase 0-1: "Logic Nolep" (ln-xxx.md) — algorithm challenges
- Phase 0-1: "Quiz" — folder-based, separate .js files per soal
- Phase 2+: "Arcane Quest" (ln-xxx.md) — full project builds
- Group Project: "gp-weekX.md"
- Soft Skills: "sk-xxx.md"
- Ujian: Final exam per week

## Exercise Style
- HARDCORE — real-world scenarios (Indonesian cities, pet shop, inventory)
- Specific requirements (tools wajib, CSS wajib native, framework BANNED)
- Creative freedom: "Kreasi apapun diterima, buat se kreatif mungkin"
- Clear grading: "yang paling dinilai adalah tampilan UI"
- Bonus points: animation, responsive, unique fonts
- Test cases provided for algorithm challenges
- Console.table for data display
- Must deploy to Vercel

## Folder Structure
- study-material/ or study_material/ (Phase 2 uses study-material/)
- logic_nolep/ or inside study-material/ as ln-xxx.md
- quiz/ with part1/, part2/, etc (Phase 0-1)
- project-material/ (optional)

## Code Style
- Comments in code can be English or Indonesian
- Always runnable — include full setup commands
- Show console output expected
- Use console.log for debugging education
- TypeScript for Phase 2 (React projects)

## Key Patterns
- README.md per week = course overview with link list to all materials
- Each study material = self-contained lesson
- Progressive difficulty within week
- Real-world context (Indonesian companies, cities, culture)
- Video tutorial links at end of parts
- Screenshots hosted on GitHub user-attachments
