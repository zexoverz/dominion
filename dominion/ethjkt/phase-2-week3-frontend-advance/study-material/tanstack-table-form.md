# 📊 TanStack Table & Form

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## Part 1: TanStack Table

TanStack Table itu **headless UI library** untuk bikin table. "Headless" artinya dia handle logic (sorting, filtering, pagination) tapi NGGAK kasih styling — kalian yang kontrol 100% tampilannya.

### Setup

```bash
pnpm add @tanstack/react-table
```

### Basic Table

```tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'

// Define data type
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive'
  joinedAt: string
}

// Column helper — type-safe column definitions
const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => (
      <a href={`mailto:${info.getValue()}`} className="text-blue-500">
        {info.getValue()}
      </a>
    ),
  }),
  
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (info) => {
      const colors: Record<string, string> = {
        admin: 'bg-red-100 text-red-800',
        user: 'bg-gray-100 text-gray-800',
        moderator: 'bg-blue-100 text-blue-800',
      }
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${colors[info.getValue()]}`}>
          {info.getValue()}
        </span>
      )
    },
  }),
  
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <span className={info.getValue() === 'active' ? 'text-green-500' : 'text-gray-400'}>
        ● {info.getValue()}
      </span>
    ),
  }),
  
  columnHelper.accessor('joinedAt', {
    header: 'Joined',
    cell: (info) => new Date(info.getValue()).toLocaleDateString('id-ID'),
  }),
  
  // Display column (no accessor)
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => (
      <div className="flex gap-2">
        <button onClick={() => alert(`Edit ${info.row.original.name}`)}>✏️</button>
        <button onClick={() => alert(`Delete ${info.row.original.id}`)}>🗑️</button>
      </div>
    ),
  }),
]

function UserTable({ data }: { data: User[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  
  return (
    <table className="w-full border-collapse">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="border-b p-3 text-left font-semibold">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border-b p-3">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

### Sorting

```tsx
import { getSortedRowModel, SortingState } from '@tanstack/react-table'

function SortableTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  
  // Di header, tambahin click handler
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="cursor-pointer select-none"
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {' '}
              {{ asc: '↑', desc: '↓' }[header.column.getIsSorted() as string] ?? ''}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}
```

---

### Filtering

```tsx
import { getFilteredRowModel, ColumnFiltersState } from '@tanstack/react-table'

function FilterableTable({ data }: { data: User[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, globalFilter },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })
  
  return (
    <div>
      {/* Global search */}
      <input
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search all columns..."
      />
      
      {/* Per-column filter */}
      <select
        value={(table.getColumn('role')?.getFilterValue() as string) ?? ''}
        onChange={(e) => table.getColumn('role')?.setFilterValue(e.target.value || undefined)}
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
      </select>
      
      {/* Table */}
      {/* ... same as before */}
    </div>
  )
}
```

---

### Pagination

```tsx
import { getPaginationRowModel } from '@tanstack/react-table'

function PaginatedTable({ data }: { data: User[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  })
  
  return (
    <div>
      {/* Table content... */}
      
      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          {' '}-{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}
          {' '}of {table.getFilteredRowModel().rows.length}
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
            ⟪
          </button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            ←
          </button>
          
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            →
          </button>
          <button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
            ⟫
          </button>
        </div>
        
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>Show {size}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
```

---

### Row Selection

```tsx
import { RowSelectionState } from '@tanstack/react-table'

function SelectableTable({ data }: { data: User[] }) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  
  const selectColumns = [
    // Checkbox column
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 40,
    }),
    ...columns,
  ]
  
  const table = useReactTable({
    data,
    columns: selectColumns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  })
  
  const selectedRows = table.getSelectedRowModel().rows
  
  return (
    <div>
      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded flex items-center gap-4">
          <span>{selectedRows.length} selected</span>
          <button onClick={() => handleBulkDelete(selectedRows.map(r => r.original.id))}>
            🗑️ Delete Selected
          </button>
          <button onClick={() => handleBulkExport(selectedRows.map(r => r.original))}>
            📥 Export Selected
          </button>
        </div>
      )}
      {/* Table... */}
    </div>
  )
}
```

---

## Part 2: TanStack Form

TanStack Form itu form management library yang type-safe dan performant.

### Setup

```bash
pnpm add @tanstack/react-form
```

### Basic Form

```tsx
import { useForm } from '@tanstack/react-form'

function RegistrationForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user' as 'admin' | 'user',
    },
    onSubmit: async ({ value }) => {
      // value is fully typed!
      console.log('Form submitted:', value)
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      })
    },
  })
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div>
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              value.length < 3 ? 'Name minimal 3 karakter' : undefined,
          }}
          children={(field) => (
            <div>
              <label>Name</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 && (
                <span className="text-red-500 text-sm">
                  {field.state.meta.errors.join(', ')}
                </span>
              )}
            </div>
          )}
        />
      </div>
      
      <div>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Email wajib diisi'
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                return 'Email nggak valid'
              return undefined
            },
            // Async validation — check kalau email udah terdaftar
            onChangeAsync: async ({ value }) => {
              await new Promise((r) => setTimeout(r, 500)) // debounce
              const res = await fetch(`/api/check-email?email=${value}`)
              const { exists } = await res.json()
              return exists ? 'Email udah terdaftar' : undefined
            },
            onChangeAsyncDebounceMs: 500,
          }}
          children={(field) => (
            <div>
              <label>Email</label>
              <input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.isValidating && <span>Checking...</span>}
              {field.state.meta.errors.map((error, i) => (
                <span key={i} className="text-red-500 text-sm block">{error}</span>
              ))}
            </div>
          )}
        />
      </div>
      
      <div>
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (value.length < 8) return 'Password minimal 8 karakter'
              if (!/[A-Z]/.test(value)) return 'Harus ada huruf besar'
              if (!/[0-9]/.test(value)) return 'Harus ada angka'
              return undefined
            },
          }}
          children={(field) => (
            <div>
              <label>Password</label>
              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((err, i) => (
                <span key={i} className="text-red-500 text-sm block">{err}</span>
              ))}
            </div>
          )}
        />
      </div>
      
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        )}
      />
    </form>
  )
}
```

---

### Field Arrays

Untuk dynamic fields (tambahin/hapus items):

```tsx
function OrderForm() {
  const form = useForm({
    defaultValues: {
      customerName: '',
      items: [{ product: '', quantity: 1, price: 0 }],
    },
    onSubmit: async ({ value }) => {
      console.log('Order:', value)
    },
  })
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field name="customerName" children={(field) => (
        <input
          placeholder="Customer Name"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      )} />
      
      <h3>Order Items</h3>
      
      <form.Field name="items" mode="array" children={(field) => (
        <div>
          {field.state.value.map((_, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <form.Field name={`items[${index}].product`} children={(subField) => (
                <input
                  placeholder="Product"
                  value={subField.state.value}
                  onChange={(e) => subField.handleChange(e.target.value)}
                />
              )} />
              
              <form.Field name={`items[${index}].quantity`} children={(subField) => (
                <input
                  type="number"
                  min={1}
                  value={subField.state.value}
                  onChange={(e) => subField.handleChange(Number(e.target.value))}
                />
              )} />
              
              <form.Field name={`items[${index}].price`} children={(subField) => (
                <input
                  type="number"
                  placeholder="Price"
                  value={subField.state.value}
                  onChange={(e) => subField.handleChange(Number(e.target.value))}
                />
              )} />
              
              <button
                type="button"
                onClick={() => field.removeValue(index)}
                disabled={field.state.value.length <= 1}
              >
                🗑️
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => field.pushValue({ product: '', quantity: 1, price: 0 })}
          >
            + Add Item
          </button>
        </div>
      )} />
      
      <button type="submit">Submit Order</button>
    </form>
  )
}
```

---

## 🎯 Practice Exercises

### Exercise 1: Full-Featured Table
Buat table Users yang support sorting, filtering (global + per-column), pagination, dan row selection. Data dari JSONPlaceholder API.

### Exercise 2: Registration Form
Buat form registrasi lengkap dengan:
- Name, email, password, confirm password
- Sync validation (required, min length, email format)
- Async validation (check email availability)
- Password strength indicator

### Exercise 3: Dynamic Invoice Form
Buat form invoice yang bisa tambahin/hapus line items. Auto-calculate subtotal per item dan total invoice. Validate semua field.

### Exercise 4: Editable Table
Combine Table + Form: buat table yang bisa inline-edit. Klik cell → jadi input. Save dengan Enter atau blur.

### Bonus Challenge 🏆
Buat admin panel lengkap: table yang support CRUD operations dengan modal forms. Add, Edit, Delete users. Pakai TanStack Table + Form + Query sekaligus.

---

> 💡 **Pro tip:** TanStack Table dan Form itu headless — artinya kalian bisa pakai styling library apapun (Tailwind, MUI, Chakra, custom CSS). Ini bikin mereka super flexible dibanding opinionated alternatives.
