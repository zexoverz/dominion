"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const router = (0, express_1.Router)();
const REPORTS_DIR = path.resolve(__dirname, '../../reports');
const REPORT_META = {
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
        const reports = files.map(f => {
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
    }
    catch (err) {
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
    }
    catch (err) {
        console.error('GET /api/reports/:slug error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
