# 🎭 05 — E2E Testing dengan Playwright: Test Like a Real User

```
╔══════════════════════════════════════════════════════╗
║  "If it's not tested in a real browser, it's not    ║
║   tested."                                          ║
╚══════════════════════════════════════════════════════╝
```

## 🎯 Tujuan Pembelajaran

Setelah materi ini, kalian bakal bisa:

- Memahami kenapa Playwright > Cypress di 2025
- Setup Playwright dari nol
- Nulis E2E test dengan auto-waiting
- Implement Page Object Model pattern
- Test authentication flows
- Visual regression testing
- Integrate Playwright ke CI/CD

## 🤔 Kenapa Playwright di 2025?

Dulu Cypress itu raja E2E testing. Tapi di 2025, Playwright udah menang di hampir semua aspek:

| Feature | Playwright | Cypress |
|---------|-----------|---------|
| **Multi-browser** | Chromium, Firefox, WebKit | Chromium only (free) |
| **Speed** | Parallel by default | Sequential |
| **Auto-waiting** | Built-in, smart | Manual waits needed |
| **Tab/Window** | Full support | No multi-tab |
| **iFrames** | Native support | Limited |
| **Network** | Full control | Limited |
| **Mobile** | Device emulation | Viewport only |
| **Language** | JS/TS/Python/Java/C# | JS/TS only |
| **Pricing** | 100% free | Dashboard paid |

```mermaid
graph LR
    subgraph "Playwright Architecture"
        A["Test Runner"] --> B["Browser Context 1\n(Chromium)"]
        A --> C["Browser Context 2\n(Firefox)"]
        A --> D["Browser Context 3\n(WebKit/Safari)"]
        
        B --> E["Page 1"]
        B --> F["Page 2"]
        C --> G["Page 3"]
        D --> H["Page 4"]
    end
    
    style A fill:#5A67D8,stroke:#fff,color:#fff
    style B fill:#48BB78,stroke:#fff,color:#fff
    style C fill:#ED8936,stroke:#fff,color:#fff
    style D fill:#E53E3E,stroke:#fff,color:#fff
```

---

## ⚙️ Setup Playwright

```bash
# Install
npm init playwright@latest

# Ini bakal:
# 1. Install @playwright/test
# 2. Download browsers (Chromium, Firefox, WebKit)
# 3. Create playwright.config.ts
# 4. Create example test files
# 5. Create GitHub Actions workflow

# Atau manual:
npm install -D @playwright/test
npx playwright install
```

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fail kalau ada .only di CI
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ...(process.env.CI ? [['github' as const]] : []),
  ],
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',     // capture trace on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup project — run auth once, share state
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    // Mobile testing
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  // Start dev server before tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Folder Structure

```
e2e/
├── .auth/
│   └── user.json          # Shared auth state
├── fixtures/
│   └── test-data.ts       # Test data
├── pages/
│   ├── LoginPage.ts       # Page Object
│   ├── ProductPage.ts
│   └── CartPage.ts
├── auth.setup.ts           # Auth setup
├── home.spec.ts
├── products.spec.ts
├── cart.spec.ts
└── auth.spec.ts
```

### Package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

---

## 📝 Writing Your First E2E Test

### Basic Test

```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the hero section', async ({ page }) => {
    await page.goto('/');

    // Auto-waiting: Playwright otomatis nunggu element muncul
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /shop now/i })).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /products/i }).click();

    // Playwright auto-waits for navigation
    await expect(page).toHaveURL(/.*products/);
    await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu should exist
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();

    // Desktop nav should be hidden
    await expect(page.getByRole('navigation').getByRole('link', { name: /products/i })).toBeHidden();
  });
});
```

### Playwright Auto-Waiting

Ini fitur KILLER Playwright. Gak perlu `cy.wait()` atau `setTimeout()`:

```typescript
// ❌ Cypress style — manual waits
cy.get('[data-testid="product-list"]').should('exist');
cy.wait(2000); // hope the data loads...
cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);

// ✅ Playwright — auto-waiting
await expect(page.getByTestId('product-list')).toBeVisible();
// Playwright automatically retries until the assertion passes (default 5s timeout)
await expect(page.getByTestId('product-card').first()).toBeVisible();
```

Playwright auto-waits for:
- Element to be attached to DOM
- Element to be visible
- Element to be enabled
- Element to be stable (no animation)
- Navigation to complete
- Network requests to finish

---

## 🏛️ Page Object Model (POM)

Page Objects abstract page interactions. Ini bikin test lebih readable dan maintainable.

```typescript
// e2e/pages/LoginPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /login|sign in/i });
    this.errorMessage = page.getByRole('alert');
    this.successMessage = page.getByText(/welcome/i);
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL(/.*dashboard|.*home/);
  }
}
```

```typescript
// e2e/pages/ProductPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly productCards: Locator;
  readonly addToCartButtons: Locator;
  readonly cartBadge: Locator;
  readonly categoryFilter: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder(/search/i);
    this.productCards = page.getByTestId('product-card');
    this.addToCartButtons = page.getByRole('button', { name: /add to cart/i });
    this.cartBadge = page.getByTestId('cart-badge');
    this.categoryFilter = page.getByRole('combobox', { name: /category/i });
    this.sortSelect = page.getByRole('combobox', { name: /sort/i });
  }

  async goto() {
    await this.page.goto('/products');
    await expect(this.page.getByRole('heading', { name: /products/i })).toBeVisible();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    // Wait for debounce
    await this.page.waitForTimeout(500);
  }

  async addToCart(productName: string) {
    const card = this.page
      .getByTestId('product-card')
      .filter({ hasText: productName });
    await card.getByRole('button', { name: /add to cart/i }).click();
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  async sortBy(option: string) {
    await this.sortSelect.selectOption(option);
  }

  async expectProductCount(count: number) {
    await expect(this.productCards).toHaveCount(count);
  }

  async expectProductVisible(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async expectCartCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }
}
```

```typescript
// e2e/pages/CartPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly checkoutButton: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('cart-item');
    this.totalPrice = page.getByTestId('cart-total');
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
    this.emptyMessage = page.getByText(/cart is empty/i);
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async removeItem(productName: string) {
    const item = this.page
      .getByTestId('cart-item')
      .filter({ hasText: productName });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async updateQuantity(productName: string, quantity: number) {
    const item = this.page
      .getByTestId('cart-item')
      .filter({ hasText: productName });
    await item.getByRole('spinbutton').fill(String(quantity));
  }

  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectTotal(total: string) {
    await expect(this.totalPrice).toContainText(total);
  }
}
```

### Using Page Objects in Tests

```typescript
// e2e/products.spec.ts
import { test, expect } from '@playwright/test';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';

test.describe('Product Browsing', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.goto();
  });

  test('should display products', async () => {
    await expect(productPage.productCards.first()).toBeVisible();
  });

  test('should search products', async () => {
    await productPage.search('keyboard');
    await productPage.expectProductVisible('Mechanical Keyboard');
  });

  test('should filter by category', async () => {
    await productPage.filterByCategory('electronics');
    // All visible products should be electronics
    await productPage.expectProductVisible('Mechanical Keyboard');
  });

  test('should add product to cart', async ({ page }) => {
    await productPage.addToCart('Mechanical Keyboard');
    await productPage.expectCartCount(1);

    // Navigate to cart and verify
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.expectItemCount(1);
  });
});
```

---

## 🔐 Testing Authentication Flows

### Auth Setup — Share Login State

```typescript
// e2e/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel(/email/i).fill('test@arcane.dev');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /login/i }).click();

  // Wait for redirect after login
  await expect(page).toHaveURL(/.*dashboard|.*home/);

  // Save auth state — all tests in dependent projects will use this
  await page.context().storageState({ path: authFile });
});
```

### Testing Login/Logout

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

// These tests DON'T use the shared auth state
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@arcane.dev', 'password123');
    await loginPage.expectLoggedIn();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await loginPage.expectError('Invalid credentials');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should logout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@arcane.dev', 'password123');
    await loginPage.expectLoggedIn();

    // Logout
    await page.getByRole('button', { name: /logout|sign out/i }).click();
    await expect(page).toHaveURL(/.*login|.*home/);
  });

  test('should persist login across page refresh', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@arcane.dev', 'password123');
    await loginPage.expectLoggedIn();

    // Refresh
    await page.reload();
    // Should still be logged in
    await expect(page.getByText(/dashboard|welcome/i)).toBeVisible();
  });
});
```

---

## 🌐 Network Interception

Playwright bisa intercept network requests — useful buat test error states dan edge cases.

```typescript
// e2e/error-handling.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should show error page on server error', async ({ page }) => {
    // Intercept API and return 500
    await page.route('**/api/products', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    );

    await page.goto('/products');
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
  });

  test('should show offline message when disconnected', async ({ page, context }) => {
    await page.goto('/products');
    await expect(page.getByTestId('product-card').first()).toBeVisible();

    // Go offline
    await context.setOffline(true);

    // Try to load more / refresh
    await page.reload();

    await expect(page.getByText(/offline|no connection/i)).toBeVisible();

    // Go back online
    await context.setOffline(false);
  });

  test('should handle slow network gracefully', async ({ page }) => {
    // Simulate slow response
    await page.route('**/api/products', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.continue();
    });

    await page.goto('/products');

    // Loading state should be visible
    await expect(page.getByText(/loading/i)).toBeVisible();

    // Eventually products should load
    await expect(page.getByTestId('product-card').first()).toBeVisible({
      timeout: 10000,
    });
  });
});
```

---

## 📸 Visual Regression Testing

Playwright bisa compare screenshots buat detect visual changes.

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('home page should match screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for all images and animations to load
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('home-page.png', {
      maxDiffPixels: 100,    // tolerate small rendering differences
      fullPage: true,
    });
  });

  test('product card should match screenshot', async ({ page }) => {
    await page.goto('/products');
    
    const firstCard = page.getByTestId('product-card').first();
    await expect(firstCard).toBeVisible();

    await expect(firstCard).toHaveScreenshot('product-card.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('login form should match screenshot', async ({ page }) => {
    await page.goto('/login');

    const form = page.getByRole('form');
    await expect(form).toHaveScreenshot('login-form.png');
  });
});
```

**Update screenshots:**

```bash
# Generate/update baseline screenshots
npx playwright test --update-snapshots

# Screenshots saved to:
# e2e/visual.spec.ts-snapshots/home-page-chromium-linux.png
# e2e/visual.spec.ts-snapshots/home-page-firefox-linux.png
```

> ⚠️ **Warning:** Visual regression tests bisa flaky di CI karena font rendering beda antar OS. Pakai `maxDiffPixels` atau `maxDiffPixelRatio` buat tolerance. Atau pakai Docker buat consistent environment.

---

## 🔧 Advanced Techniques

### Testing with API Calls

```typescript
// e2e/api-integration.spec.ts
import { test, expect } from '@playwright/test';

test('should create and display a new product', async ({ page, request }) => {
  // Create product via API first
  const response = await request.post('/api/products', {
    data: {
      name: 'E2E Test Product',
      price: 999000,
      stock: 10,
      categoryId: 1,
    },
    headers: {
      Authorization: 'Bearer fake-admin-token',
    },
  });
  expect(response.ok()).toBeTruthy();
  const { data: product } = await response.json();

  // Now check it appears in the UI
  await page.goto('/products');
  await expect(page.getByText('E2E Test Product')).toBeVisible();

  // Cleanup via API
  await request.delete(`/api/products/${product.id}`, {
    headers: { Authorization: 'Bearer fake-admin-token' },
  });
});
```

### Testing File Upload

```typescript
test('should upload product image', async ({ page }) => {
  await page.goto('/admin/products/new');

  // Upload file
  const fileInput = page.getByLabel(/image/i);
  await fileInput.setInputFiles('e2e/fixtures/test-image.jpg');

  // Preview should show
  await expect(page.getByAltText(/preview/i)).toBeVisible();
});
```

### Testing Toast/Notification

```typescript
test('should show success toast after adding to cart', async ({ page }) => {
  await page.goto('/products');

  await page.getByRole('button', { name: /add to cart/i }).first().click();

  // Toast appears
  const toast = page.getByRole('status'); // atau getByTestId('toast')
  await expect(toast).toContainText(/added to cart/i);

  // Toast disappears after a few seconds
  await expect(toast).toBeHidden({ timeout: 5000 });
});
```

---

## 🚀 Playwright di CI/CD

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Setup database
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb

      - name: Seed database
        run: npx prisma db seed
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb

      - name: Build app
        run: npm run build

      - name: Run E2E tests
        run: npx playwright test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb
          BASE_URL: http://localhost:5173

      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-traces
          path: test-results/
          retention-days: 7
```

---

## 🎯 Playwright Best Practices buat Capstone

### Do's ✅

1. **Use role-based selectors** — `getByRole('button')` > `getByTestId('btn')`
2. **Use Page Objects** — abstraction = maintainability
3. **Test user flows, not units** — login → browse → add to cart → checkout
4. **Use auto-waiting** — jangan pake `waitForTimeout` kecuali terpaksa
5. **Run in CI** — kalau gak jalan di CI, gak worth
6. **Save traces on failure** — debug jauh lebih gampang

### Don'ts ❌

1. **Don't test everything E2E** — mahal dan lambat
2. **Don't hard-code waits** — `page.waitForTimeout(5000)` = code smell
3. **Don't test third-party** — jangan test Stripe/OAuth E2E
4. **Don't skip cleanup** — setiap test harus independent
5. **Don't test CSS** — visual regression aja kalau perlu

### Minimum E2E Tests buat Capstone

```typescript
// 5-8 E2E tests covering:
// 1. Homepage loads correctly
// 2. User can login
// 3. User can browse products
// 4. User can add to cart
// 5. User can checkout (mock payment)
// 6. Admin can manage products
// 7. Responsive layout works
// 8. Error states handled gracefully
```

---

## 🛠️ Debugging Playwright

```bash
# Debug mode — step through tests with inspector
npx playwright test --debug

# UI mode — visual test runner
npx playwright test --ui

# Headed mode — see browser
npx playwright test --headed

# Generate test code by recording
npx playwright codegen http://localhost:5173

# Show last test report
npx playwright show-report

# Trace viewer — inspect failed test step by step
npx playwright show-trace test-results/path/to/trace.zip
```

**`codegen` itu game changer.** Buka browser, klik-klik, Playwright generate test code otomatis. Kalau bingung mulai dari mana, codegen dulu terus refine.

---

## 📝 Summary

| Konsep | Key Takeaway |
|--------|-------------|
| Playwright | E2E testing framework, multi-browser, auto-waiting |
| Auto-waiting | No manual waits, Playwright handles it |
| Page Objects | Abstract page interactions for maintainability |
| Auth Setup | Login once, share state across tests |
| Visual Regression | Screenshot comparison for UI changes |
| CI Integration | Run E2E in GitHub Actions with Playwright |
| Codegen | Record browser actions → generate test code |

**Pro tip: kalau capstone kalian punya 5+ E2E tests yang pass di CI, reviewer bakal langsung kasih bonus point. It shows you understand production-grade quality.**

---

**Next up:** CI/CD dengan GitHub Actions — automate everything, trust nothing. 🔄
