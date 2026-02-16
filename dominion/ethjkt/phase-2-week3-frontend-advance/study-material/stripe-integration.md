# 💳 Stripe Integration — Payment Processing untuk Web App

> **ETHJKT Phase 2 — Week 3 | Arcane Quest: The Payment Forge**

## Kenapa Stripe?

Stripe adalah salah satu payment processor paling populer di dunia. Developer-friendly banget, docs-nya bagus, dan support hampir semua payment method. Buat web3 builders yang mau bikin hybrid app (crypto + fiat), Stripe essential banget.

**Yang bakal kita pelajari:**
- 🔑 Setup test keys
- 🛒 Checkout Sessions (redirect flow)
- 💰 Payment Intents (custom flow)
- 🔔 Webhooks
- ⚛️ React integration dengan `@stripe/react-stripe-js`

## Setup

### 1. Daftar Stripe Account

Pergi ke [dashboard.stripe.com](https://dashboard.stripe.com), buat account. Kamu bakal dapet **test mode** keys — gak perlu verify identity dulu buat development.

### 2. Ambil API Keys

Di Stripe Dashboard → Developers → API keys:

```
Publishable key: pk_test_xxxxxxxxxxxx  (buat frontend)
Secret key:      sk_test_xxxxxxxxxxxx  (buat backend ONLY!)
```

> ⚠️ **JANGAN PERNAH** expose secret key di frontend atau commit ke Git!

### 3. Install Packages

```bash
# Frontend
npm install @stripe/stripe-js @stripe/react-stripe-js

# Backend (Node.js)
npm install stripe
```

### 4. Environment Variables

```bash
# .env (frontend - Vite)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx

# .env (backend)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

## Stripe Checkout Session (Redirect Flow)

Cara paling gampang. User di-redirect ke hosted payment page Stripe, terus redirect balik ke app kamu setelah bayar.

### Backend: Create Checkout Session

```typescript
// server/routes/checkout.ts
import Stripe from 'stripe'
import express from 'express'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const router = express.Router()

interface CartItem {
  name: string
  price: number // dalam cents!
  quantity: number
  image?: string
}

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body as { items: CartItem[] }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: item.price, // Stripe pake cents! $10.00 = 1000
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        // Tambahin custom data kamu di sini
        orderId: 'order_123',
      },
    })

    res.json({ url: session.url })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

export default router
```

### Frontend: Redirect ke Checkout

```tsx
// src/components/CheckoutButton.tsx
import { useState } from 'react'

interface CartItem {
  name: string
  price: number
  quantity: number
}

export function CheckoutButton({ items }: { items: CartItem[] }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const { url } = await response.json()
      window.location.href = url // Redirect ke Stripe
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="btn-primary"
    >
      {loading ? 'Processing...' : 'Checkout'}
    </button>
  )
}
```

## Payment Intents (Custom Flow)

Kalau kamu mau kontrol penuh atas UI payment form, pake Payment Intents + Stripe Elements.

### Backend: Create Payment Intent

```typescript
// server/routes/payment.ts
import Stripe from 'stripe'
import express from 'express'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const router = express.Router()

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // dalam cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.body.userId || 'anonymous',
      },
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

export default router
```

### Frontend: Custom Payment Form

```tsx
// src/components/PaymentForm.tsx
import { useState } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Load Stripe SEKALI di luar component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// Inner form component
function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    })

    if (submitError) {
      setError(submitError.message ?? 'Payment failed')
      setProcessing(false)
    }
    // Kalau sukses, user di-redirect ke return_url
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <PaymentElement />

      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full mt-4"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

// Wrapper component yang setup Elements
export function PaymentForm({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night', // Dark mode! 🌙
          variables: {
            colorPrimary: '#7c3aed',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      }}
    >
      <CheckoutForm />
    </Elements>
  )
}
```

### Pake PaymentForm di Page

```tsx
// src/pages/PaymentPage.tsx
import { useEffect, useState } from 'react'
import { PaymentForm } from '../components/PaymentForm'

export function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5000 }), // $50.00
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [])

  if (!clientSecret) return <p>Loading payment form...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>
      <PaymentForm clientSecret={clientSecret} />
    </div>
  )
}
```

## Webhooks — Dengerin Event dari Stripe

Webhooks itu notifikasi dari Stripe ke server kamu. Penting banget buat:
- Confirm pembayaran sukses
- Update order status
- Handle refunds
- Detect failed payments

### Setup Webhook Endpoint

```typescript
// server/routes/webhook.ts
import Stripe from 'stripe'
import express from 'express'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const router = express.Router()

// PENTING: Webhook route harus pake raw body, bukan JSON parsed!
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed')
      return res.status(400).send('Webhook Error')
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`💰 Payment succeeded: ${paymentIntent.id}`)
        // Update order di database
        // await updateOrderStatus(paymentIntent.metadata.orderId, 'paid')
        break
      }

      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log(`❌ Payment failed: ${failedPayment.id}`)
        // Notify user, update order status
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log(`✅ Checkout completed: ${session.id}`)
        // Fulfill the order
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  }
)

export default router
```

### Test Webhooks Locally

```bash
# Install Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks ke local server
stripe listen --forward-to localhost:3000/api/webhook

# Trigger test event
stripe trigger payment_intent.succeeded
```

## Test Cards

Stripe kasih test card numbers buat development:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Sukses |
| `4000 0000 0000 3220` | 3D Secure required |
| `4000 0000 0000 9995` | Payment declined |
| `4000 0000 0000 0077` | Charge succeeds, dispute later |

Expiry: any future date. CVC: any 3 digits. ZIP: any 5 digits.

## Security Best Practices

1. **JANGAN PERNAH** handle raw card numbers di server kamu — selalu pake Stripe Elements
2. **Secret key** cuma di backend, environment variable
3. **Verify webhook signatures** — jangan trust raw POST data
4. **Idempotency keys** — buat prevent duplicate charges
5. **HTTPS only** — Stripe gak bakal kirim webhook ke HTTP

```typescript
// Idempotency key example
const paymentIntent = await stripe.paymentIntents.create(
  { amount: 1000, currency: 'usd' },
  { idempotencyKey: `order_${orderId}` }
)
```

## 🏋️ Latihan: Arcane Quest Payment Challenge

### Quest 1: Checkout Session
Bikin halaman product dengan button "Buy Now" yang:
- Create checkout session di backend
- Redirect ke Stripe checkout
- Handle success & cancel pages

### Quest 2: Custom Payment Form
Bikin custom payment form dengan Stripe Elements yang:
- Tampil dark mode theme
- Show loading state saat processing
- Handle error messages
- Redirect ke success page

### Quest 3: Webhook Handler
Setup webhook endpoint yang:
- Verify Stripe signature
- Handle `payment_intent.succeeded`
- Handle `payment_intent.payment_failed`
- Log semua events
- Test dengan Stripe CLI

### Quest 4: Subscription (Bonus)
Bikin subscription flow:
- Create Stripe Product + Price di dashboard
- Checkout session dengan `mode: 'subscription'`
- Handle `customer.subscription.created` webhook

## Resources

- 📖 [Stripe Docs](https://stripe.com/docs)
- 📖 [Stripe Elements React](https://stripe.com/docs/stripe-js/react)
- 📖 [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- 📖 [Stripe CLI](https://stripe.com/docs/stripe-cli)
- 🧪 [Stripe Test Cards](https://stripe.com/docs/testing)

---

> 💳 *"Payment integration itu kayak enchanting — satu langkah salah bisa costly. Always test di sandbox dulu!"* — ETHJKT Arcane Wisdom
