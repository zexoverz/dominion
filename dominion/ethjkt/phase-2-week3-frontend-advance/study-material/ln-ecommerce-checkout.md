# 🛒 ARCANE QUEST: E-Commerce Checkout — Stripe + Clerk

> **ETHJKT Phase 2 — Week 3 | Arcane Quest: The Merchant's Guild**

## Quest Overview

Di quest ini, kamu bakal build **full e-commerce checkout flow** dari nol. Product listing, shopping cart, authenticated checkout dengan Clerk, payment processing dengan Stripe, dan order confirmation. Ini project yang ngegabungin semua skill yang udah dipelajari di Week 3!

### Yang Bakal Kita Build

```
🏪 Product Listing → 🛒 Cart → 🔐 Auth Gate → 💳 Checkout → ✅ Confirmation
```

### Tech Stack

- **Vite + React + TypeScript** — framework
- **Tailwind CSS** — styling
- **Clerk** — authentication
- **Stripe** — payment processing
- **Express** — backend API
- **Zustand** — cart state management

## Step 1: Project Setup

### Init Project

```bash
npm create vite@latest arcane-shop -- --template react-ts
cd arcane-shop
npm install

# Dependencies
npm install @clerk/clerk-react @stripe/stripe-js @stripe/react-stripe-js zustand react-router-dom

# Backend dependencies
npm install express stripe cors dotenv @clerk/express
npm install -D @types/express @types/cors tsx
```

### Folder Structure

```
arcane-shop/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   ├── CheckoutForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProductPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── SuccessPage.tsx
│   │   ├── SignInPage.tsx
│   │   └── SignUpPage.tsx
│   ├── store/
│   │   └── cartStore.ts
│   ├── data/
│   │   └── products.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── server/
│   └── index.ts
├── .env
└── .env.local
```

### Environment Variables

```bash
# .env.local (frontend - Vite)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
VITE_API_URL=http://localhost:3001

# .env (backend)
CLERK_SECRET_KEY=sk_test_xxxx
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
CLIENT_URL=http://localhost:5173
PORT=3001
```

## Step 2: Types & Data

### Types

```typescript
// src/types/index.ts
export interface Product {
  id: string
  name: string
  description: string
  price: number // dalam cents
  image: string
  category: 'potion' | 'weapon' | 'armor' | 'scroll'
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  userId: string
  createdAt: string
}
```

### Product Data

```typescript
// src/data/products.ts
import { Product } from '../types'

export const products: Product[] = [
  {
    id: 'potion-001',
    name: 'Elixir of Solidity',
    description: 'Boost your smart contract skills. +50 debugging power.',
    price: 2999, // $29.99
    image: '/images/potion-solidity.png',
    category: 'potion',
    stock: 50,
  },
  {
    id: 'weapon-001',
    name: 'Vyper Blade',
    description: 'A sharp weapon forged in Python fire. Critical hit on gas optimization.',
    price: 4999,
    image: '/images/vyper-blade.png',
    category: 'weapon',
    stock: 25,
  },
  {
    id: 'armor-001',
    name: 'Hardhat Shield',
    description: 'Protection against reentrancy attacks. +100 defense.',
    price: 7999,
    image: '/images/hardhat-shield.png',
    category: 'armor',
    stock: 15,
  },
  {
    id: 'scroll-001',
    name: 'Scroll of ERC-721',
    description: 'Ancient knowledge of NFT creation. Unlock mint powers.',
    price: 1499,
    image: '/images/scroll-erc721.png',
    category: 'scroll',
    stock: 100,
  },
  {
    id: 'potion-002',
    name: 'Gas Optimization Brew',
    description: 'Reduce gas costs by 40%. Essential for mainnet deployment.',
    price: 3499,
    image: '/images/potion-gas.png',
    category: 'potion',
    stock: 30,
  },
  {
    id: 'weapon-002',
    name: 'Foundry Hammer',
    description: 'Forge and test contracts with devastating efficiency.',
    price: 5999,
    image: '/images/foundry-hammer.png',
    category: 'weapon',
    stock: 20,
  },
]
```

## Step 3: Cart State dengan Zustand

```typescript
// src/store/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          )

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
    }),
    {
      name: 'arcane-cart', // localStorage key
    }
  )
)
```

## Step 4: Components

### Navbar

```tsx
// src/components/Navbar.tsx
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useCartStore } from '../store/cartStore'

export function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-purple-400">
          ⚔️ Arcane Shop
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Products
          </Link>

          <Link to="/cart" className="relative text-gray-300 hover:text-white">
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <Link to="/sign-in" className="btn-primary text-sm">
              Sign In
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  )
}
```

### Product Card

```tsx
// src/components/ProductCard.tsx
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem)

  const categoryEmoji = {
    potion: '🧪',
    weapon: '⚔️',
    armor: '🛡️',
    scroll: '📜',
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors">
      <div className="h-48 bg-gray-700 flex items-center justify-center text-6xl">
        {categoryEmoji[product.category]}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded">
            {product.category}
          </span>
          <span className="text-xs text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white">{product.name}</h3>
        <p className="text-gray-400 text-sm mt-1">{product.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-green-400">
            ${(product.price / 100).toFixed(2)}
          </span>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Cart Item

```tsx
// src/components/CartItem.tsx
import { CartItem as CartItemType } from '../types'
import { useCartStore } from '../store/cartStore'

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
      <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-2xl">
        {item.product.category === 'potion' ? '🧪' :
         item.product.category === 'weapon' ? '⚔️' :
         item.product.category === 'armor' ? '🛡️' : '📜'}
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-white">{item.product.name}</h3>
        <p className="text-gray-400 text-sm">
          ${(item.product.price / 100).toFixed(2)} each
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="w-8 h-8 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          -
        </button>
        <span className="text-white w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="w-8 h-8 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-green-400">
          ${((item.product.price * item.quantity) / 100).toFixed(2)}
        </p>
        <button
          onClick={() => removeItem(item.product.id)}
          className="text-red-400 text-sm hover:text-red-300"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
```

## Step 5: Pages

### Home Page (Product Listing)

```tsx
// src/pages/HomePage.tsx
import { useState } from 'react'
import { products } from '../data/products'
import { ProductCard } from '../components/ProductCard'

export function HomePage() {
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all'
    ? products
    : products.filter((p) => p.category === filter)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">
        ⚔️ Arcane Shop
      </h1>
      <p className="text-gray-400 mb-6">
        Equip yourself for the Ethereum frontier
      </p>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'potion', 'weapon', 'armor', 'scroll'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat === 'all' ? '🌟 All' :
             cat === 'potion' ? '🧪 Potions' :
             cat === 'weapon' ? '⚔️ Weapons' :
             cat === 'armor' ? '🛡️ Armor' : '📜 Scrolls'}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

### Cart Page

```tsx
// src/pages/CartPage.tsx
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { CartItem } from '../components/CartItem'

export function CartPage() {
  const { items, clearCart, getTotalPrice } = useCartStore()
  const totalPrice = getTotalPrice()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-white mb-2">Cart is Empty</h2>
        <p className="text-gray-400 mb-6">
          Your inventory is empty, adventurer. Visit the shop!
        </p>
        <Link to="/" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">🛒 Your Cart</h1>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">Total</span>
          <span className="text-2xl font-bold text-green-400">
            ${(totalPrice / 100).toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
          >
            Clear Cart
          </button>
          <Link
            to="/checkout"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg font-medium"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### Checkout Page (Auth-Protected)

```tsx
// src/pages/CheckoutPage.tsx
import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCartStore } from '../store/cartStore'
import { useNavigate } from 'react-router-dom'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const clearCart = useCartStore((state) => state.clearCart)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    })

    if (submitError) {
      setError(submitError.message ?? 'Payment failed')
      setProcessing(false)
    } else {
      clearCart()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-red-400 mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

export function CheckoutPage() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const navigate = useNavigate()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
      return
    }

    const createPaymentIntent = async () => {
      const token = await getToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.product.id,
            quantity: i.quantity,
          })),
          amount: getTotalPrice(),
        }),
      })
      const data = await response.json()
      setClientSecret(data.clientSecret)
    }

    createPaymentIntent()
  }, [])

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-2">💳 Checkout</h1>
      <p className="text-gray-400 mb-6">
        Welcome, {user?.firstName}! Complete your purchase.
      </p>

      {/* Order Summary */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-white mb-2">Order Summary</h3>
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm text-gray-400">
            <span>{item.product.name} × {item.quantity}</span>
            <span>${((item.product.price * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
        <hr className="border-gray-700 my-2" />
        <div className="flex justify-between font-bold text-white">
          <span>Total</span>
          <span>${(getTotalPrice() / 100).toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Form */}
      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: 'night', variables: { colorPrimary: '#7c3aed' } },
          }}
        >
          <CheckoutForm />
        </Elements>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto" />
          <p className="text-gray-400 mt-2">Preparing checkout...</p>
        </div>
      )}
    </div>
  )
}
```

### Success Page

```tsx
// src/pages/SuccessPage.tsx
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useCartStore } from '../store/cartStore'

export function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      <p className="text-6xl mb-4">✅</p>
      <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
      <p className="text-gray-400 mb-6">
        Your arcane items have been added to your inventory.
        May they serve you well on your quest!
      </p>
      <Link to="/" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  )
}
```

## Step 6: App Router

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { SuccessPage } from './pages/SuccessPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
```

## Step 7: Backend API

```typescript
// server/index.ts
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(clerkMiddleware())

// Webhook route HARUS sebelum express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'] as string

  try {
    const event = stripe.webhooks.constructEvent(
      req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('💰 Payment succeeded!')
        // Update order in DB
        break
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed!')
        break
    }

    res.json({ received: true })
  } catch (err) {
    res.status(400).send('Webhook Error')
  }
})

app.use(express.json())

// Create Payment Intent (protected)
app.post('/api/create-payment-intent', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req)
    const { amount, items } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: userId!,
        items: JSON.stringify(items),
      },
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
```

### Jalanin Backend

```json
// package.json - tambah script
{
  "scripts": {
    "dev": "vite",
    "server": "tsx watch server/index.ts",
    "dev:all": "concurrently \"npm run dev\" \"npm run server\""
  }
}
```

```bash
npm install -D concurrently
npm run dev:all
```

## Step 8: Testing the Flow

1. **Browse products** → buka `http://localhost:5173`
2. **Add to cart** → klik "Add to Cart" di beberapa product
3. **Go to cart** → review items, adjust quantity
4. **Checkout** → klik "Proceed to Checkout"
5. **Sign in** → kalau belum login, di-redirect ke sign-in
6. **Pay** → pake test card `4242 4242 4242 4242`
7. **Success** → liat confirmation page ✅

## 🏋️ Bonus Quests

### Quest 1: Order History
Tambah halaman `/orders` yang:
- Fetch orders dari backend berdasarkan userId
- Tampil list semua past orders
- Detail view per order

### Quest 2: Wishlist
Implement wishlist feature:
- Zustand store terpisah
- Persist ke localStorage
- Button "Add to Wishlist" di product card
- Halaman `/wishlist`

### Quest 3: Search & Sort
Tambah di product listing:
- Search by name
- Sort by price (low-high, high-low)
- Sort by category

### Quest 4: Email Confirmation
Integrate Stripe webhook untuk:
- Send email konfirmasi setelah payment sukses
- Pake Resend atau SendGrid

---

> 🛒 *"Seorang merchant yang baik tahu bahwa setiap transaksi harus aman, terverifikasi, dan transparan — persis seperti blockchain."* — ETHJKT Arcane Wisdom
