# 🧪 Cypress Testing — Frontend Testing yang Bikin Kamu Tidur Nyenyak

> **ETHJKT Phase 2 — Week 3 | Arcane Quest: The Testing Shield**

## Kenapa Testing Itu Penting?

Bayangin kamu udah deploy dApp ke mainnet, terus tiba-tiba user ngelaporin button "Connect Wallet" gak jalan. Panik? Pasti. Nah, dengan **testing**, kamu bisa tangkep bug kayak gitu **sebelum** user yang nemuin.

**Cypress** adalah salah satu testing framework paling populer buat frontend. Dia bisa:
- ✅ End-to-End (E2E) testing — simulasi user beneran pake app kamu
- ✅ Component testing — test komponen React secara isolated
- ✅ Visual debugging — liat test jalan real-time di browser
- ✅ Time travel — liat snapshot tiap step test

## Setup Cypress

### 1. Install Cypress

```bash
# Di project React/Vite kamu
npm install -D cypress

# Atau pake yarn
yarn add -D cypress
```

### 2. Buka Cypress pertama kali

```bash
npx cypress open
```

Ini bakal generate folder structure:

```
cypress/
├── e2e/           # E2E test files
├── fixtures/      # Test data (JSON, dll)
├── support/       # Custom commands & setup
│   ├── commands.ts
│   └── e2e.ts
└── downloads/
cypress.config.ts  # Config utama
```

### 3. Konfigurasi dasar

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Vite default port
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})
```

## Menulis E2E Test Pertama

### Konsep Dasar

Cypress pake syntax yang mirip English, jadi gampang dibaca:

```typescript
// cypress/e2e/home.cy.ts
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the hero section', () => {
    cy.get('h1').should('contain', 'Welcome to ETHJKT')
  })

  it('should navigate to about page', () => {
    cy.get('[data-testid="nav-about"]').click()
    cy.url().should('include', '/about')
    cy.get('h1').should('contain', 'About')
  })
})
```

### Anatomy of a Test

| Bagian | Fungsi |
|--------|--------|
| `describe()` | Grouping tests (test suite) |
| `it()` | Individual test case |
| `beforeEach()` | Jalanin sebelum tiap test |
| `cy.visit()` | Buka halaman |
| `cy.get()` | Ambil element dari DOM |
| `.should()` | Assertion — cek apakah sesuai ekspektasi |
| `.click()` | Simulasi user click |

## Selectors — Cara Pilih Element yang Bener

### ❌ Anti-pattern: Selector yang fragile

```typescript
// JANGAN gini — gampang pecah kalau CSS berubah
cy.get('.btn-primary.mt-4.px-6')
cy.get('#submit-btn')
cy.get('div > form > button:nth-child(2)')
```

### ✅ Best practice: data-testid

```tsx
// Di React component kamu
<button data-testid="connect-wallet-btn" onClick={handleConnect}>
  Connect Wallet
</button>
```

```typescript
// Di test
cy.get('[data-testid="connect-wallet-btn"]').click()
```

### Custom Command untuk data-testid

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Declare type
declare namespace Cypress {
  interface Chainable {
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
  }
}
```

Sekarang bisa pake:

```typescript
cy.getByTestId('connect-wallet-btn').click()
```

## Assertions yang Sering Dipake

```typescript
// Visibility
cy.get('h1').should('be.visible')
cy.get('.modal').should('not.exist')

// Text content
cy.get('p').should('contain', 'Hello')
cy.get('h1').should('have.text', 'Exact Text')

// Attributes
cy.get('input').should('have.attr', 'placeholder', 'Enter name')
cy.get('button').should('be.disabled')
cy.get('input').should('have.value', 'test@email.com')

// Length (jumlah element)
cy.get('li').should('have.length', 5)

// CSS
cy.get('div').should('have.css', 'background-color', 'rgb(0, 0, 0)')

// Chaining assertions
cy.get('[data-testid="user-card"]')
  .should('be.visible')
  .and('contain', 'Arcane Mage')
  .and('have.class', 'active')
```

## Interaksi User yang Umum

### Form Input

```typescript
it('should submit contact form', () => {
  cy.visit('/contact')

  cy.getByTestId('name-input').type('Satoshi Nakamoto')
  cy.getByTestId('email-input').type('satoshi@bitcoin.org')
  cy.getByTestId('message-input').type('GM from ETHJKT!')

  cy.getByTestId('submit-btn').click()

  // Cek success message
  cy.get('.toast-success')
    .should('be.visible')
    .and('contain', 'Message sent!')
})
```

### Handling API Calls dengan Intercept

```typescript
it('should display user data from API', () => {
  // Intercept API call dan kasih mock response
  cy.intercept('GET', '/api/users', {
    statusCode: 200,
    body: [
      { id: 1, name: 'Vitalik', role: 'Builder' },
      { id: 2, name: 'Satoshi', role: 'Mage' },
    ],
  }).as('getUsers')

  cy.visit('/users')

  // Tunggu API call selesai
  cy.wait('@getUsers')

  // Verify data tampil
  cy.get('[data-testid="user-card"]').should('have.length', 2)
  cy.get('[data-testid="user-card"]').first().should('contain', 'Vitalik')
})
```

### Handling Loading States

```typescript
it('should show loading then data', () => {
  cy.intercept('GET', '/api/data', {
    statusCode: 200,
    body: { items: ['a', 'b', 'c'] },
    delay: 1000, // Simulate slow API
  }).as('getData')

  cy.visit('/dashboard')

  // Loading state harus muncul
  cy.getByTestId('loading-spinner').should('be.visible')

  cy.wait('@getData')

  // Loading hilang, data muncul
  cy.getByTestId('loading-spinner').should('not.exist')
  cy.getByTestId('data-list').should('be.visible')
})
```

## Component Testing

Selain E2E, Cypress juga bisa test komponen React secara isolated.

### Setup

```bash
npm install -D cypress @cypress/react
```

### Contoh Component Test

```tsx
// src/components/TokenCard.tsx
interface TokenCardProps {
  name: string
  symbol: string
  price: number
  onChange?: (symbol: string) => void
}

export function TokenCard({ name, symbol, price, onChange }: TokenCardProps) {
  return (
    <div data-testid="token-card" className="card">
      <h3>{name}</h3>
      <p>{symbol}</p>
      <p data-testid="token-price">${price.toFixed(2)}</p>
      <button
        data-testid="buy-btn"
        onClick={() => onChange?.(symbol)}
      >
        Buy
      </button>
    </div>
  )
}
```

```typescript
// src/components/TokenCard.cy.tsx
import { TokenCard } from './TokenCard'

describe('TokenCard', () => {
  it('renders token info correctly', () => {
    cy.mount(
      <TokenCard name="Ethereum" symbol="ETH" price={3500.50} />
    )

    cy.get('h3').should('have.text', 'Ethereum')
    cy.get('p').first().should('have.text', 'ETH')
    cy.getByTestId('token-price').should('have.text', '$3500.50')
  })

  it('calls onChange when Buy is clicked', () => {
    const onChangeSpy = cy.spy().as('onChange')

    cy.mount(
      <TokenCard
        name="Ethereum"
        symbol="ETH"
        price={3500.50}
        onChange={onChangeSpy}
      />
    )

    cy.getByTestId('buy-btn').click()
    cy.get('@onChange').should('have.been.calledWith', 'ETH')
  })
})
```

## CI Integration dengan GitHub Actions

### Workflow File

```yaml
# .github/workflows/cypress.yml
name: Cypress Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  cypress-run:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Cypress E2E tests
        uses: cypress-io/github-action@v6
        with:
          build: npm run build
          start: npm run preview
          wait-on: 'http://localhost:4173'
          browser: chrome

      - name: Upload screenshots on failure
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots

      - name: Upload videos
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
```

### Tips CI

- **`wait-on`** — pastiin dev server udah ready sebelum test jalan
- **Upload artifacts** — kalau test gagal, kamu bisa download screenshot/video buat debugging
- **`npm ci`** — lebih cepat dari `npm install` di CI karena pake lockfile langsung

## Best Practices Cypress

1. **Satu test = satu hal** — jangan test 10 hal dalam 1 `it()` block
2. **Pakai `data-testid`** — jangan depend sama class CSS atau struktur DOM
3. **Mock external APIs** — pake `cy.intercept()` supaya test gak flaky
4. **Avoid `cy.wait(3000)`** — pake `cy.wait('@alias')` atau assertion-based waiting
5. **Reset state tiap test** — pake `beforeEach()` buat clean slate
6. **Keep tests independent** — test A gak boleh depend sama test B

## 🏋️ Latihan: Arcane Quest Testing Challenge

### Quest 1: Test Navigation
Buat E2E test yang verify:
- Homepage load dengan benar
- Semua nav links bisa di-click dan navigate ke halaman yang tepat
- 404 page muncul untuk URL yang gak ada

### Quest 2: Test Form Submission
Buat E2E test untuk form dengan:
- Input validation (required fields, email format)
- Success submission dengan mock API
- Error handling kalau API return 500

### Quest 3: Component Test
Buat component test untuk sebuah `WalletButton` component yang:
- Tampil "Connect Wallet" kalau belum connected
- Tampil alamat wallet (shortened) kalau udah connected
- Trigger callback saat di-click

### Quest 4: CI Pipeline
Setup GitHub Actions workflow yang:
- Run tests otomatis di setiap PR
- Upload video artifacts
- Fail PR kalau ada test yang gagal

## Resources

- 📖 [Cypress Docs](https://docs.cypress.io)
- 📖 [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- 📖 [Testing Library + Cypress](https://testing-library.com/docs/cypress-testing-library/intro)
- 🎥 [Cypress in 100 Seconds - Fireship](https://www.youtube.com/watch?v=BQqzfHQkREo)

---

> 🛡️ *"Code without tests is like a smart contract without audits — you're just hoping nothing goes wrong."* — ETHJKT Arcane Wisdom
