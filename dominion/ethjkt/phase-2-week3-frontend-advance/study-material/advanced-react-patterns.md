# 🏗️ Advanced React Patterns

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## Kenapa Belajar Patterns?

Patterns itu kayak design recipes — solusi yang udah terbukti buat masalah yang sering muncul. Kalau kalian baca codebase library populer (Radix UI, Headless UI, React Hook Form), kalian bakal nemuin patterns ini di mana-mana.

Kita bakal bahas 5 patterns:
1. **Composition** (Children pattern)
2. **Compound Components**
3. **Render Props**
4. **Higher-Order Components (HOCs)**
5. **Slot Pattern**

---

## 1️⃣ Composition Pattern

Ini pattern paling fundamental di React. Intinya: **build complex UI dari simple components**.

### ❌ Anti-pattern: Prop Explosion

```tsx
// Terlalu banyak props — susah di-maintain
<Card
  title="Ethereum"
  subtitle="Cryptocurrency"
  image="/eth.png"
  imageAlt="ETH Logo"
  description="Decentralized platform..."
  footer="Updated 5m ago"
  footerIcon="clock"
  onHeaderClick={() => {}}
  headerActions={[{ label: 'Share', onClick: share }]}
  variant="outlined"
/>
```

### ✅ Composition: Flexible & Maintainable

```tsx
<Card variant="outlined">
  <Card.Header onClick={handleHeaderClick}>
    <Card.Title>Ethereum</Card.Title>
    <Card.Subtitle>Cryptocurrency</Card.Subtitle>
    <Card.Actions>
      <Button onClick={share}>Share</Button>
    </Card.Actions>
  </Card.Header>
  
  <Card.Image src="/eth.png" alt="ETH Logo" />
  
  <Card.Body>
    <p>Decentralized platform...</p>
  </Card.Body>
  
  <Card.Footer>
    <Clock size={14} />
    <span>Updated 5m ago</span>
  </Card.Footer>
</Card>
```

Lihat bedanya? Composition bikin component:
- **Flexible** — consumer bisa arrange content sesuka hati
- **Readable** — structure-nya jelas dari JSX
- **Extensible** — tambahin content baru tanpa ubah Card component

---

## 2️⃣ Compound Components

Compound components itu group of components yang **share implicit state**. Contoh classic: `<select>` + `<option>`.

### Implementasi: Accordion

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'

// Context untuk share state
interface AccordionContextType {
  activeItems: Set<string>
  toggle: (id: string) => void
}

const AccordionContext = createContext<AccordionContextType | null>(null)

function useAccordion() {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('Must be used within Accordion')
  return ctx
}

// Root component
interface AccordionProps {
  children: ReactNode
  multiple?: boolean // Allow multiple items open
}

function Accordion({ children, multiple = false }: AccordionProps) {
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set())
  
  const toggle = (id: string) => {
    setActiveItems(prev => {
      const next = new Set(multiple ? prev : [])
      if (prev.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }
  
  return (
    <AccordionContext.Provider value={{ activeItems, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  )
}

// Item component
function AccordionItem({ id, children }: { id: string; children: ReactNode }) {
  const { activeItems } = useAccordion()
  const isOpen = activeItems.has(id)
  
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`} data-state={isOpen ? 'open' : 'closed'}>
      {children}
    </div>
  )
}

// Trigger component
function AccordionTrigger({ id, children }: { id: string; children: ReactNode }) {
  const { activeItems, toggle } = useAccordion()
  const isOpen = activeItems.has(id)
  
  return (
    <button 
      className="accordion-trigger" 
      onClick={() => toggle(id)}
      aria-expanded={isOpen}
    >
      {children}
      <span className={`chevron ${isOpen ? 'rotate' : ''}`}>▼</span>
    </button>
  )
}

// Content component
function AccordionContent({ id, children }: { id: string; children: ReactNode }) {
  const { activeItems } = useAccordion()
  const isOpen = activeItems.has(id)
  
  if (!isOpen) return null
  
  return (
    <div className="accordion-content" role="region">
      {children}
    </div>
  )
}

// Attach sub-components
Accordion.Item = AccordionItem
Accordion.Trigger = AccordionTrigger
Accordion.Content = AccordionContent

export { Accordion }
```

### Usage — Super Clean! 😍

```tsx
<Accordion multiple>
  <Accordion.Item id="1">
    <Accordion.Trigger id="1">Apa itu Ethereum?</Accordion.Trigger>
    <Accordion.Content id="1">
      <p>Ethereum adalah platform blockchain terdesentralisasi...</p>
    </Accordion.Content>
  </Accordion.Item>
  
  <Accordion.Item id="2">
    <Accordion.Trigger id="2">Apa itu Smart Contract?</Accordion.Trigger>
    <Accordion.Content id="2">
      <p>Smart contract adalah program yang berjalan di blockchain...</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Contoh Lain: Tabs

```tsx
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  
  <Tabs.Content value="overview">
    <OverviewPanel />
  </Tabs.Content>
  <Tabs.Content value="analytics">
    <AnalyticsPanel />
  </Tabs.Content>
  <Tabs.Content value="settings">
    <SettingsPanel />
  </Tabs.Content>
</Tabs>
```

---

## 3️⃣ Render Props Pattern

Render props itu pattern di mana component menerima **function sebagai prop** yang return JSX. Consumer yang tentuin gimana data di-render.

```tsx
interface MousePosition {
  x: number
  y: number
}

interface MouseTrackerProps {
  children: (position: MousePosition) => ReactNode
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }
  
  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh' }}>
      {children(position)}
    </div>
  )
}

// Usage — consumer decides rendering
<MouseTracker>
  {({ x, y }) => (
    <div>
      <p>Mouse: ({x}, {y})</p>
      <div 
        className="cursor" 
        style={{ left: x - 10, top: y - 10 }} 
      />
    </div>
  )}
</MouseTracker>
```

### Real-World: Toggleable Component

```tsx
interface ToggleProps {
  children: (props: { 
    isOn: boolean
    toggle: () => void
    setOn: () => void
    setOff: () => void 
  }) => ReactNode
  initialState?: boolean
}

function Toggle({ children, initialState = false }: ToggleProps) {
  const [isOn, setIsOn] = useState(initialState)
  
  const toggle = () => setIsOn(prev => !prev)
  const setOn = () => setIsOn(true)
  const setOff = () => setIsOn(false)
  
  return <>{children({ isOn, toggle, setOn, setOff })}</>
}

// Usage
<Toggle initialState={false}>
  {({ isOn, toggle }) => (
    <div>
      <button onClick={toggle}>
        {isOn ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      <div className={isOn ? 'dark' : 'light'}>
        Content here...
      </div>
    </div>
  )}
</Toggle>
```

> **Note:** Render props agak old-school. Sekarang kebanyakan di-replace sama **custom hooks**. Tapi masih berguna untuk kasus tertentu!

---

## 4️⃣ Higher-Order Components (HOCs)

HOC itu function yang **terima component, return component baru** dengan tambahan functionality.

```tsx
// HOC: withAuth — protect component dengan authentication check
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()
    
    if (isLoading) return <LoadingSpinner />
    if (!isAuthenticated) return <Navigate to="/login" />
    
    return <WrappedComponent {...props} />
  }
}

// Usage
const ProtectedDashboard = withAuth(Dashboard)
const ProtectedSettings = withAuth(Settings)

// Di routes
<Route path="/dashboard" element={<ProtectedDashboard />} />
```

### HOC: withLogging

```tsx
function withLogging<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function LoggedComponent(props: P) {
    useEffect(() => {
      console.log(`[${componentName}] Mounted`)
      return () => console.log(`[${componentName}] Unmounted`)
    }, [])
    
    useEffect(() => {
      console.log(`[${componentName}] Props changed:`, props)
    })
    
    return <WrappedComponent {...props} />
  }
}

const LoggedButton = withLogging(Button, 'Button')
```

### Kapan Pakai HOC vs Custom Hook?

| HOC | Custom Hook |
|-----|-------------|
| Wrap component dengan extra UI (loading, error boundary) | Share logic tanpa UI |
| Legacy codebase / class components | Modern functional components |
| Cross-cutting concerns (auth, logging) | Reusable stateful logic |

**Trend saat ini:** Custom hooks > HOCs untuk kebanyakan kasus.

---

## 5️⃣ Slot Pattern

Terinspirasi dari Vue's slots. Consumer bisa "inject" content ke specific slot di layout:

```tsx
interface PageLayoutProps {
  header?: ReactNode
  sidebar?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

function PageLayout({ header, sidebar, children, footer }: PageLayoutProps) {
  return (
    <div className="page-layout">
      {header && <header className="page-header">{header}</header>}
      
      <div className="page-body">
        {sidebar && <aside className="page-sidebar">{sidebar}</aside>}
        <main className="page-content">{children}</main>
      </div>
      
      {footer && <footer className="page-footer">{footer}</footer>}
    </div>
  )
}

// Usage
<PageLayout
  header={<NavBar />}
  sidebar={
    <nav>
      <a href="/dashboard">Dashboard</a>
      <a href="/settings">Settings</a>
    </nav>
  }
  footer={<p>© 2024 ETHJKT</p>}
>
  <h1>Dashboard</h1>
  <DashboardContent />
</PageLayout>
```

---

## 🤔 Kapan Pakai Pattern yang Mana?

| Pattern | Use Case | Contoh Library |
|---------|----------|---------------|
| **Composition** | Flexible, reusable UI | Semua component libraries |
| **Compound** | Related components share state | Radix UI, Headless UI |
| **Render Props** | Consumer controls rendering | Formik (legacy), Downshift |
| **HOC** | Cross-cutting concerns | React Router (withRouter), Redux (connect) |
| **Slot** | Page layouts, templates | Layout systems |

---

## 🎯 Practice Exercises

### Exercise 1: Compound Tabs
Buat compound `Tabs` component lengkap dengan `Tabs.List`, `Tabs.Trigger`, dan `Tabs.Content`. Support keyboard navigation (arrow keys).

### Exercise 2: Render Props Modal
Buat `Modal` component yang pakai render props untuk content. Consumer bisa render apapun di dalam modal dan punya akses ke `close` function.

### Exercise 3: HOC withPermission
Buat HOC `withPermission(Component, requiredPermission)` yang check apakah user punya permission tertentu. Kalau nggak, tampilkan "Access Denied".

### Exercise 4: Compound Dropdown
Buat `Dropdown` compound component dengan `Dropdown.Trigger`, `Dropdown.Menu`, dan `Dropdown.Item`. Handle click outside to close.

### Bonus Challenge 🏆
Buat mini component library dengan 3 compound components: `Accordion`, `Tabs`, dan `Dialog`. Semua harus accessible (keyboard nav, ARIA attributes). Publish ke npm!

---

> 💡 **Pro tip:** Nggak ada "best" pattern — semuanya tools di toolbox kalian. Pahami trade-offs masing-masing dan pilih yang paling cocok untuk use case kalian. Most modern React leans heavily into composition + custom hooks.
