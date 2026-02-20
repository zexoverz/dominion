# ⚔️ Arcane Quest 02: Arcane Command Center

## 📊 Real-time Dashboard

> **Difficulty:** ⭐⭐⭐⭐ (Advanced)
> **Type:** Optional — bonus points
> **Stack:** React + Socket.IO + React Query + Zustand + Recharts

---

## Misi

Bikin **real-time dashboard** yang menampilkan live data. Bayangin dashboard admin yang update otomatis — angka bergerak, chart berubah, notifikasi masuk real-time. No refresh needed.

---

## Requirements

### Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│  🏰 Arcane Command Center              🔔 (3)  👤  │
├──────────┬──────────────────────────────────────────┤
│          │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│ Sidebar  │  │Total │ │Active│ │Low   │ │Revenue│   │
│          │  │Prod  │ │Users │ │Stock │ │Today  │   │
│ - Dash   │  │ 234  │ │  12  │ │  5⚠️ │ │ 15jt  │   │
│ - Produk │  └──────┘ └──────┘ └──────┘ └──────┘    │
│ - Users  │                                          │
│ - Notif  │  ┌─────────────────┐ ┌─────────────────┐ │
│          │  │   Sales Chart   │ │  Activity Feed  │ │
│          │  │   (Recharts)    │ │  - User joined  │ │
│          │  │   📈            │ │  - Product sold │ │
│          │  │                 │ │  - Low stock    │ │
│          │  └─────────────────┘ └─────────────────┘ │
│          │                                          │
│          │  ┌───────────────────────────────────────┐│
│          │  │  Recent Orders Table                  ││
│          │  │  Auto-updates when new order comes in ││
│          │  └───────────────────────────────────────┘│
└──────────┴──────────────────────────────────────────┘
```

### Feature List

1. **Stats Cards** (4 cards di atas)
   - Total Products — dari React Query (GET /api/stats)
   - Active Users — dari Socket.IO (real-time count)
   - Low Stock Alerts — dari React Query, badge merah kalo > 0
   - Revenue Today — dari React Query, update tiap menit

2. **Sales Chart** (Recharts)
   - Line chart: sales per hari (last 7 days)
   - Atau bar chart: sales per category
   - Real-time update: new sale masuk → chart update
   - Library: `recharts`

3. **Live Activity Feed**
   - Real-time events via Socket.IO:
     - "Budi added new product: Laptop ASUS"
     - "Order #123 completed — Rp 2.500.000"
     - "⚠️ Low stock alert: Mouse Logitech (3 left)"
     - "Rina just logged in"
   - Max 20 items, newest di atas
   - Timestamp relative ("2m ago")

4. **Notification System**
   - Bell icon with unread count badge
   - Dropdown panel with notification list
   - Mark as read / mark all read
   - Toast popup for new notifications
   - Store di Zustand

5. **Online Users Indicator**
   - Show who's currently online
   - Avatar + name
   - Real-time update (join/leave)

### Technical Requirements

- **React Query** buat semua REST API data fetching
- **Socket.IO** buat real-time events
- **Zustand** buat notification store dan UI state
- **Recharts** buat charts (`npm install recharts`)
- **Pattern:** Socket events → invalidate React Query cache

### Backend Events (Socket.IO)

Kalian perlu backend yang emit events ini. Bisa bikin simple mock server:

```javascript
// backend/mock-events.js — Simulate real-time events
setInterval(() => {
  // Simulate random events
  const events = [
    { type: 'sale', data: { product: 'Laptop', amount: 12000000 } },
    { type: 'low_stock', data: { product: 'Mouse', remaining: 3 } },
    { type: 'user_login', data: { name: 'Rina' } },
  ];
  
  const event = events[Math.floor(Math.random() * events.length)];
  io.emit('dashboard:event', event);
}, 5000); // Emit random event every 5 seconds
```

---

## Grading

| Criteria | Points |
|---|---|
| Stats cards with real data | 15 |
| Charts with Recharts | 20 |
| Live activity feed (Socket.IO) | 20 |
| Notification system (Zustand) | 15 |
| Online users indicator | 10 |
| Socket + React Query integration | 10 |
| UI/UX polish | 10 |
| **TOTAL** | **100** |

---

## Resources

- Recharts: https://recharts.org
- Socket.IO Client: https://socket.io/docs/v4/client-api/
- Zustand: https://zustand-demo.pmnd.rs/

---

## Tips

1. Start dengan static dashboard (hardcoded data)
2. Add React Query buat fetch real data
3. Add Socket.IO connection
4. Connect socket events ke React Query invalidation
5. Add Zustand buat notifications
6. Polish UI last

Build something you'd be proud to show! 🏰
