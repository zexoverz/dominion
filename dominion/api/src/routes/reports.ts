import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();
const REPORTS_DIR = path.resolve(__dirname, '../../reports');

interface ReportMeta {
  slug: string;
  title: string;
  general: string;
  emoji: string;
  date: string;
  category: string;
}

const REPORT_META: Record<string, Omit<ReportMeta, 'slug'>> = {
  'seer-btc-sentiment-latest': {
    title: 'BTC Intelligence — Latest',
    general: 'SEER',
    emoji: '🔮',
    date: new Date().toISOString().slice(0, 10),
    category: 'market-intel',
  },
  'seer-btc-sentiment-feb2026': {
    title: 'BTC Sentiment Analysis — Feb 2026 (Archive)',
    general: 'SEER',
    emoji: '🔮',
    date: '2026-02-14',
    category: 'market-intel',
  },
  'feb-2026-financial-briefing': {
    title: 'Financial Briefing — Feb 2026',
    general: 'MAMMON',
    emoji: '💰',
    date: '2026-02-14',
    category: 'finance',
  },
  'investment-masterplan-v2': {
    title: 'Investment Master Plan v2.0',
    general: 'MAMMON',
    emoji: '💰',
    date: '2025-12-01',
    category: 'finance',
  },
  'investment-masterplan-readme': {
    title: 'Investment Plan — Overview',
    general: 'MAMMON',
    emoji: '💰',
    date: '2025-12-01',
    category: 'finance',
  },
  'grimoire-ethereum-research': {
    title: 'Ethereum Research & EIP Roadmap',
    general: 'GRIMOIRE',
    emoji: '📖',
    date: '2026-02-14',
    category: 'research',
  },
  'grimoire-ethjkt-curriculum-analysis': {
    title: 'ETHJKT Curriculum Analysis — 48 Repos',
    general: 'GRIMOIRE',
    emoji: '📖',
    date: '2026-02-14',
    category: 'research',
  },
  'grimoire-ethjkt-phase2-completion': {
    title: 'ETHJKT Phase 2 Completion — Week 4 & 5',
    general: 'GRIMOIRE',
    emoji: '📖',
    date: '2026-02-14',
    category: 'research',
  },
  'grimoire-ethjkt-phase3-redesign': {
    title: 'ETHJKT Phase 3 — Hackathon & Job Ready',
    general: 'GRIMOIRE',
    emoji: '📖',
    date: '2026-02-14',
    category: 'research',
  },
  'mammon-weekly-2026-02-14': {
    title: 'MAMMON Weekly Finance — Feb 14',
    general: 'MAMMON',
    emoji: '💰',
    date: '2026-02-14',
    category: 'finance',
  },
  'phantom-security-2026-02-14': {
    title: 'PHANTOM Security Scan — Feb 14',
    general: 'PHANTOM',
    emoji: '👻',
    date: '2026-02-14',
    category: 'security',
  },
  'echo-content-strategy': {
    title: 'Content Strategy & Brand Positioning',
    general: 'ECHO',
    emoji: '🔊',
    date: '2026-02-14',
    category: 'content',
  },
};

// GET /api/reports — list all reports
router.get('/', (_req, res) => {
  try {
    const files = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.md'));
    const reports: ReportMeta[] = files.map(f => {
      const slug = f.replace('.md', '');
      // Auto-detect daily BTC reports
      const dailyMatch = slug.match(/^seer-btc-daily-(\d{4}-\d{2}-\d{2})$/);
      let meta = REPORT_META[slug];
      if (!meta && dailyMatch) {
        meta = {
          title: `BTC Daily Intelligence — ${dailyMatch[1]}`,
          general: 'SEER',
          emoji: '🔮',
          date: dailyMatch[1],
          category: 'market-intel',
        };
      }
      if (!meta) {
        meta = {
          title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          general: 'THRONE',
          emoji: '👑',
          date: '2026-02-14',
          category: 'general',
        };
      }
      return { slug, ...meta };
    });
    reports.sort((a, b) => b.date.localeCompare(a.date));
    res.json(reports);
  } catch (err) {
    console.error('GET /api/reports error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/reports/:slug — get report content
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    // Sanitize slug
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ error: 'Invalid slug' });
    }
    const filePath = path.join(REPORTS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = REPORT_META[slug] || {
      title: slug.replace(/-/g, ' '),
      general: 'THRONE',
      emoji: '👑',
      date: '2026-02-14',
      category: 'general',
    };
    res.json({ slug, ...meta, content });
  } catch (err) {
    console.error('GET /api/reports/:slug error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
