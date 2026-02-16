# ⚔️ ARCANE QUEST: Data Dashboard dengan TanStack

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## 🗺️ Quest Overview

Selamat datang, Arcane Developer! 🧙‍♂️

Di quest ini, kalian akan membangun **Data Dashboard** lengkap yang menampilkan data cryptocurrency dari API publik. Dashboard ini pakai:

- **TanStack Query** — data fetching & caching
- **TanStack Table** — sortable, filterable, paginated table
- **Vite + React + TypeScript** — build tooling

### Final Result Preview

Dashboard yang bisa:
- 📊 Menampilkan list crypto coins dalam table
- 🔍 Search/filter coins
- ↕️ Sort by name, price, market cap, 24h change
- 📄 Pagination (10/25/50 per page)
- 🔄 Auto-refresh setiap 60 detik
- 📱 Responsive

---

## Step 1: Project Setup

```bash
pnpm create vite crypto-dashboard --template react-ts
cd crypto-dashboard
pnpm install

# Install dependencies
pnpm add @tanstack/react-query @tanstack/react-query-devtools @tanstack/react-table

# Optional: styling
pnpm add tailwindcss @tailwindcss/vite
```

### Setup Tailwind (opsional tapi recommended)

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

---

## Step 2: Types & API Layer

```typescript
// src/types/crypto.ts
export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency: number
  circulating_supply: number
  sparkline_in_7d: {
    price: number[]
  }
}

export interface CoinListParams {
  page: number
  perPage: number
  currency: string
}
```

```typescript
// src/api/crypto.ts
import { CoinData, CoinListParams } from '../types/crypto'

const BASE_URL = 'https://api.coingecko.com/api/v3'

export async function fetchCoins(params: CoinListParams): Promise<CoinData[]> {
  const { page, perPage, currency } = params
  
  const url = new URL(`${BASE_URL}/coins/markets`)
  url.searchParams.set('vs_currency', currency)
  url.searchParams.set('order', 'market_cap_desc')
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('page', String(page))
  url.searchParams.set('sparkline', 'true')
  url.searchParams.set('price_change_percentage', '7d')
  
  const res = await fetch(url.toString())
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }
  
  return res.json()
}
```

---

## Step 3: Query Hooks

```typescript
// src/hooks/useCryptoData.ts
import { useQuery } from '@tanstack/react-query'
import { fetchCoins } from '../api/crypto'
import { CoinListParams } from '../types/crypto'

export function useCoins(params: CoinListParams) {
  return useQuery({
    queryKey: ['coins', params],
    queryFn: () => fetchCoins(params),
    staleTime: 1000 * 60,        // Fresh 1 menit
    refetchInterval: 1000 * 60,  // Auto-refetch 1 menit
    placeholderData: (prev) => prev, // Keep old data while refetching
  })
}
```

---

## Step 4: TanStack Table Setup

```tsx
// src/components/CryptoTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { CoinData } from '../types/crypto'

const columnHelper = createColumnHelper<CoinData>()

// Define columns
const columns = [
  columnHelper.accessor('market_cap_rank', {
    header: '#',
    cell: (info) => info.getValue(),
    size: 50,
  }),
  
  columnHelper.accessor('name', {
    header: 'Coin',
    cell: (info) => (
      <div className="flex items-center gap-2">
        <img
          src={info.row.original.image}
          alt={info.getValue()}
          className="w-6 h-6 rounded-full"
        />
        <div>
          <span className="font-semibold">{info.getValue()}</span>
          <span className="text-gray-500 ml-2 uppercase text-sm">
            {info.row.original.symbol}
          </span>
        </div>
      </div>
    ),
  }),
  
  columnHelper.accessor('current_price', {
    header: 'Price',
    cell: (info) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(info.getValue()),
  }),
  
  columnHelper.accessor('price_change_percentage_24h', {
    header: '24h %',
    cell: (info) => {
      const value = info.getValue()
      const isPositive = value > 0
      return (
        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
          {isPositive ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
        </span>
      )
    },
  }),
  
  columnHelper.accessor('price_change_percentage_7d_in_currency', {
    header: '7d %',
    cell: (info) => {
      const value = info.getValue()
      if (value == null) return '-'
      const isPositive = value > 0
      return (
        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
          {isPositive ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
        </span>
      )
    },
  }),
  
  columnHelper.accessor('market_cap', {
    header: 'Market Cap',
    cell: (info) => {
      const value = info.getValue()
      if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
      if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
      if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
      return `$${value.toLocaleString()}`
    },
  }),
  
  columnHelper.accessor('total_volume', {
    header: 'Volume (24h)',
    cell: (info) => {
      const value = info.getValue()
      if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
      if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
      return `$${value.toLocaleString()}`
    },
  }),
]

interface CryptoTableProps {
  data: CoinData[]
  isLoading: boolean
}

export function CryptoTable({ data, isLoading }: CryptoTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 25 },
    },
  })
  
  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="🔍 Search coins..."
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer select-none hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted() as string] ?? ''}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          <tbody>
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## Step 5: Dashboard Page

```tsx
// src/components/Dashboard.tsx
import { useState } from 'react'
import { useCoins } from '../hooks/useCryptoData'
import { CryptoTable } from './CryptoTable'

export function Dashboard() {
  const [page] = useState(1)
  
  const { data: coins, isLoading, isFetching, dataUpdatedAt } = useCoins({
    page,
    perPage: 100,
    currency: 'usd',
  })
  
  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('id-ID')
    : '-'
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">⚔️ Crypto Dashboard</h1>
          <p className="text-gray-500 mt-1">
            ETHJKT Arcane Quest — Real-time market data
          </p>
        </div>
        
        <div className="text-right text-sm text-gray-500">
          <p>Last updated: {lastUpdated}</p>
          {isFetching && (
            <p className="text-blue-500">🔄 Refreshing...</p>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      {coins && coins.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="🥇 Top Coin"
            value={coins[0].name}
            sub={`$${coins[0].current_price.toLocaleString()}`}
          />
          <StatCard
            title="📈 Best 24h"
            value={(() => {
              const best = [...coins].sort((a, b) => 
                b.price_change_percentage_24h - a.price_change_percentage_24h
              )[0]
              return best.name
            })()}
            sub={(() => {
              const best = [...coins].sort((a, b) => 
                b.price_change_percentage_24h - a.price_change_percentage_24h
              )[0]
              return `+${best.price_change_percentage_24h.toFixed(2)}%`
            })()}
            positive
          />
          <StatCard
            title="📉 Worst 24h"
            value={(() => {
              const worst = [...coins].sort((a, b) => 
                a.price_change_percentage_24h - b.price_change_percentage_24h
              )[0]
              return worst.name
            })()}
            sub={`${worst_calc(coins).price_change_percentage_24h.toFixed(2)}%`}
            negative
          />
        </div>
      )}
      
      {/* Table */}
      <CryptoTable data={coins ?? []} isLoading={isLoading} />
    </div>
  )
}

// Helper
function worst_calc(coins: any[]) {
  return [...coins].sort((a, b) => 
    a.price_change_percentage_24h - b.price_change_percentage_24h
  )[0]
}

function StatCard({ title, value, sub, positive, negative }: {
  title: string
  value: string
  sub: string
  positive?: boolean
  negative?: boolean
}) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className={`text-sm mt-1 ${
        positive ? 'text-green-500' : negative ? 'text-red-500' : 'text-gray-600'
      }`}>
        {sub}
      </p>
    </div>
  )
}
```

---

## Step 6: App Entry Point

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Dashboard } from './components/Dashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 2,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

## Step 7: Run & Test!

```bash
pnpm dev
```

Buka `http://localhost:5173` dan voila! Dashboard crypto kalian udah jalan! 🎉

---

## 🏆 Bonus Challenges

### Level 1: Favorites
Tambahin fitur "Favorite" coins. Simpan favorites di localStorage (pakai `useLocalStorage` hook). Tambahin tab "Favorites" yang filter hanya coins yang di-favorite.

### Level 2: Detail Page
Klik coin → navigate ke detail page yang tampilkan:
- Price chart 7 hari (pakai sparkline data)
- Market stats lengkap
- Price converter (USD → IDR)

### Level 3: Real-time Updates
Tambahin visual indicator waktu harga berubah:
- Flash hijau kalau harga naik
- Flash merah kalau harga turun
- Smooth number transition animation

### Level 4: Export
Tambahin button "Export to CSV" yang download current table data (respect filter dan sort).

---

## 📋 Grading Criteria

| Criteria | Points |
|----------|--------|
| Table renders correctly | 20 |
| Search/filter works | 15 |
| Sorting works (all columns) | 15 |
| Pagination works | 15 |
| Auto-refresh implemented | 10 |
| Loading states (skeleton) | 10 |
| Error handling | 10 |
| Code quality & TypeScript | 5 |
| **Total** | **100** |
| Bonus challenges | +10 each |

---

> ⚔️ **Quest Complete!** Kalian udah berhasil build data dashboard yang production-ready. Skill TanStack Query + Table ini bakal berguna banget di real projects. Good luck, Arcane Developer! 🧙‍♂️
