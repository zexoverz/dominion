# The Dominion of Lord Zexo - Frontend Dashboard

A dark cyberpunk-themed command and control dashboard for Lord Zexo's multi-agent system, built with Next.js 14+ and shadcn/ui.

## 🎯 Features

### Core Pages
- **🏰 Throne Room** (`/`) - Main dashboard with general overview and system metrics
- **👑 Generals** (`/generals`) - Detailed general profiles with stats, memory, relationships, and activity
- **🎭 Roundtable** (`/roundtable`) - Conversation history and live replay functionality  
- **🎯 Missions** (`/missions`) - Mission control with timeline views and status tracking
- **💰 Treasury** (`/treasury`) - Cost dashboard with charts, thresholds, and efficiency metrics

### Design System
- **Dark cyberpunk aesthetic** with deep purple/indigo (#6366f1) and gold accents (#f59e0b) for THRONE
- **Mobile-first responsive** design on 8px grid system
- **Custom glow effects** and animations for enhanced cyberpunk feel
- **Accessible contrast ratios** (4.5:1 for text, 3:1 for UI components)

### Component Architecture
- **GeneralCard** - Status cards for each of the 7 generals
- **StatBar** - Animated progress bars for general statistics
- **MissionTimeline** - Visual timeline for mission progress
- **ConversationReplay** - Interactive conversation playback with controls
- **CostDashboard** - Comprehensive cost analytics with charts
- **SignalFeed** - Real-time event notifications
- **Sidebar** - Navigation with general quick-access

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📊 Mock Data

The dashboard uses comprehensive mock data including:

- **7 Generals** with full stat blocks (INT/WIS/CHA/STR/DEX/LCK)
- **3 Active generals** (THRONE, GRIMOIRE, ECHO) and 4 in standby for Phase 2
- **Mission timelines** with step-by-step progress tracking
- **Conversation history** with turn-by-turn replay functionality
- **Cost analytics** with daily/weekly/monthly breakdowns
- **Real-time signals** for system events and updates

## 🎨 Visual Hierarchy

### Color Scheme
- **Primary**: Deep purple (#6366f1) - System elements, active states
- **Accent**: Gold (#f59e0b) - THRONE-specific elements, important highlights  
- **Background**: Very dark (#0a0a0f) - Main background
- **Card backgrounds**: Dark with subtle purple glow effects

### Typography
- **Hero titles**: 48px with glow effects for major headings
- **Section headers**: 30px for page sections
- **Body text**: 16px base with 24px line height
- **UI elements**: 12-14px for compact information

### Interactive Elements
- **Hover effects**: 1.05x scale with glow intensification
- **Click feedback**: 0.95x scale for tactile response
- **Smooth transitions**: 0.2-0.3s for all animations
- **Focus states**: High contrast outlines for accessibility

## 🏗️ Architecture

### File Structure
```
/app
├── layout.tsx          # Root layout with sidebar
├── page.tsx           # Throne Room dashboard  
├── globals.css        # Dark theme + cyberpunk styles
├── generals/page.tsx  # General profiles & details
├── roundtable/page.tsx # Conversations & replay
├── missions/page.tsx   # Mission control center
└── treasury/page.tsx   # Cost monitoring

/components
├── ui/                # shadcn/ui base components
├── GeneralCard.tsx    # General status displays
├── StatBar.tsx        # Animated stat progress bars  
├── MissionTimeline.tsx # Mission step visualization
├── ConversationReplay.tsx # Interactive chat playback
├── CostDashboard.tsx  # Treasury analytics
├── Sidebar.tsx        # Navigation sidebar
└── SignalFeed.tsx     # Real-time notifications

/lib  
├── types.ts           # TypeScript interfaces
├── mock-data.ts       # Complete mock dataset
└── utils.ts           # Utility functions
```

### Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Components**: shadcn/ui with Radix UI primitives
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **Animations**: CSS transitions with custom keyframes

## 🎮 General System

### The Seven Generals

1. **👑 THRONE** (Supreme Overlord) - *Active*
   - Strategic Command & Dominion Oversight
   - INT:99 WIS:95 CHA:90 STR:60 DEX:70 LCK:85
   - Gold accent coloring and enhanced glow effects

2. **📚 GRIMOIRE** (Archon of Knowledge) - *Active*
   - Information Systems & Data Architecture  
   - INT:92 WIS:98 CHA:88 STR:45 DEX:55 LCK:70

3. **🎭 ECHO** (Viceroy of Influence) - *Active*
   - Communications & Social Engineering
   - INT:85 WIS:78 CHA:99 STR:40 DEX:88 LCK:90

4. **🔮 SEER** (Oracle of Prediction) - *Standby*
   - Forecasting & Strategic Analysis
   - INT:96 WIS:94 CHA:55 STR:35 DEX:65 LCK:80

5. **👤 PHANTOM** (Shadow Executor) - *Standby*  
   - Covert Operations & Intelligence
   - INT:90 WIS:75 CHA:50 STR:95 DEX:99 LCK:72

6. **💰 MAMMON** (Treasurer of Acquisition) - *Standby*
   - Resource Management & Economic Strategy
   - INT:93 WIS:90 CHA:40 STR:50 DEX:60 LCK:88

7. **👁️ WRAITH-EYE** (Sentinel of Surveillance) - *Standby*
   - Monitoring & Threat Assessment  
   - INT:91 WIS:97 CHA:35 STR:40 DEX:55 LCK:75

## 📱 Responsive Design

- **Mobile (320px+)**: Single column, collapsible sidebar
- **Tablet (768px+)**: Two-column layouts, expanded cards
- **Desktop (992px+)**: Full sidebar, multi-column grids
- **Large screens (1200px+)**: Maximum content width with centering

## ♿ Accessibility

- **WCAG 2.2 compliance** with proper contrast ratios
- **Keyboard navigation** with visible focus states
- **Screen reader support** with semantic HTML and ARIA labels
- **Color-blind friendly** with icon + color coding
- **High contrast mode** compatibility

---

**Built for the Dominion. Designed for conquest. 👑**