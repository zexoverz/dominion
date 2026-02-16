# 🎯 useRef Deep Dive

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## Apa Itu useRef?

Oke, jadi `useRef` itu kayak "kotak penyimpanan" yang persist across renders tapi **NGGAK trigger re-render** waktu nilainya berubah. Ini yang bikin dia beda dari `useState`.

```typescript
const myRef = useRef(initialValue)
// myRef.current = initialValue
```

Ada 2 use case utama:
1. **DOM Reference** — akses langsung ke DOM element
2. **Mutable Value** — simpan nilai yang nggak perlu trigger re-render

---

## 🏗️ Use Case 1: DOM References

### Focus Management

Ini use case paling klasik. Misal kamu mau auto-focus input field waktu page load:

```tsx
import { useRef, useEffect } from 'react'

function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    // Auto-focus email input on mount
    emailRef.current?.focus()
  }, [])
  
  return (
    <form>
      <input 
        ref={emailRef} 
        type="email" 
        placeholder="Email" 
      />
      <input type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Scroll to Element

```tsx
function ChatRoom() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<string[]>([])
  
  // Auto-scroll ke bawah setiap ada message baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  return (
    <div className="chat-container">
      {messages.map((msg, i) => (
        <div key={i} className="message">{msg}</div>
      ))}
      {/* Element invisible di paling bawah */}
      <div ref={bottomRef} />
    </div>
  )
}
```

### Measure Element Size

```tsx
function ResponsiveChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '400px' }}>
      <p>Container: {dimensions.width}x{dimensions.height}</p>
      {/* Render chart with actual dimensions */}
    </div>
  )
}
```

---

## 🎬 Video Player Example

Ini contoh lengkap yang sering banget dipakai — custom video player controls:

```tsx
import { useRef, useState } from 'react'

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const togglePlay = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
  }
  
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    if (!videoRef.current) return
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }
  
  const skipForward = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime += 10
  }
  
  const skipBackward = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime -= 10
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src="/sample-video.mp4"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="controls">
        <button onClick={skipBackward}>⏪ 10s</button>
        <button onClick={togglePlay}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={skipForward}>10s ⏩</button>
        
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
        />
        
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
    </div>
  )
}
```

Lihat gimana kita pakai `videoRef.current` untuk kontrol langsung video element (play, pause, seek) tanpa perlu re-render!

---

## 📦 Use Case 2: Mutable Values (Bukan DOM)

### Kapan Pakai useRef vs useState?

Rule of thumb: **Kalau perubahan nilai NGGAK perlu ditampilin ke UI, pakai useRef.**

```typescript
// ❌ Nggak perlu useState kalau nggak render nilainya
const [renderCount, setRenderCount] = useState(0)
useEffect(() => {
  setRenderCount(c => c + 1) // Ini trigger EXTRA re-render!
})

// ✅ Pakai useRef — no extra re-render
const renderCount = useRef(0)
useEffect(() => {
  renderCount.current += 1
  console.log(`Rendered ${renderCount.current} times`)
})
```

### Previous Value Tracker

```tsx
function usePrevoius<T>(value: T): T | undefined {
  const ref = useRef<T>()
  
  useEffect(() => {
    ref.current = value
  }, [value])
  
  return ref.current
}

// Usage
function PriceDisplay({ price }: { price: number }) {
  const previousPrice = usePrevoius(price)
  
  const direction = previousPrice !== undefined
    ? price > previousPrice ? '📈' : price < previousPrice ? '📉' : '➡️'
    : ''
  
  return (
    <div>
      <span>{direction} ${price}</span>
      {previousPrice !== undefined && (
        <small>was ${previousPrice}</small>
      )}
    </div>
  )
}
```

### Timer/Interval Reference

Ini SUPER penting. Kamu butuh ref untuk cleanup interval:

```tsx
function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const start = () => {
    if (isRunning) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 10)
    }, 10)
  }
  
  const stop = () => {
    if (!isRunning) return
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }
  
  const reset = () => {
    stop()
    setTime(0)
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centiseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  }
  
  return (
    <div>
      <h1>{formatTime(time)}</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### Debounce with useRef

```tsx
function SearchInput() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Set new timeout (debounce 500ms)
    timeoutRef.current = setTimeout(async () => {
      if (value.trim()) {
        const res = await fetch(`/api/search?q=${value}`)
        const data = await res.json()
        setResults(data)
      }
    }, 500)
  }
  
  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search..." />
      <ul>
        {results.map((r: any) => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  )
}
```

---

## 🔄 Callback Refs

Kadang kamu butuh ref yang lebih dynamic — misal untuk element yang conditionally rendered:

```tsx
function MeasuredComponent() {
  const [height, setHeight] = useState(0)
  
  // Callback ref — dipanggil setiap kali element mount/unmount
  const measuredRef = (node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height)
    }
  }
  
  return (
    <div>
      <div ref={measuredRef}>
        <p>Content yang height-nya bisa berubah</p>
        <p>Bisa multi-line</p>
      </div>
      <p>Height: {height}px</p>
    </div>
  )
}
```

---

## ⚠️ Kapan NGGAK Pakai useRef

1. **Jangan baca/tulis ref.current selama rendering** (kecuali inisialisasi)

```tsx
// ❌ BAD — mutate ref during render
function Bad() {
  const ref = useRef(0)
  ref.current += 1 // Nggak predictable!
  return <div>{ref.current}</div>
}

// ✅ GOOD — mutate inside event handler atau useEffect
function Good() {
  const ref = useRef(0)
  
  useEffect(() => {
    ref.current += 1
  })
  
  const handleClick = () => {
    ref.current += 1
    console.log(ref.current)
  }
  
  return <button onClick={handleClick}>Click</button>
}
```

2. **Jangan pakai ref sebagai pengganti state kalau nilainya perlu ditampilin di UI**

```tsx
// ❌ UI nggak bakal update karena ref nggak trigger re-render
function Bad() {
  const count = useRef(0)
  return (
    <div>
      <p>{count.current}</p>
      <button onClick={() => count.current++}>+</button>
    </div>
  )
}
```

---

## 🧠 Mental Model: useState vs useRef

| | useState | useRef |
|--|---------|--------|
| Trigger re-render? | ✅ Ya | ❌ Tidak |
| Persist across renders? | ✅ Ya | ✅ Ya |
| Mutable? | Via setter only | Langsung `.current` |
| Kapan pakai? | Nilai ditampilin di UI | Nilai internal / DOM access |

---

## 🎯 Practice Exercises

### Exercise 1: Auto-Focus
Buat form registrasi dengan 3 input (name, email, password). Saat user submit dan ada error, auto-focus ke input yang error.

### Exercise 2: Click Counter (Hidden)
Buat button yang track berapa kali diklik pakai `useRef` (bukan state). Tampilin count hanya ketika user klik tombol "Reveal Count".

### Exercise 3: Custom Video Player
Extend video player example di atas dengan:
- Volume control (slider)
- Playback speed selector (0.5x, 1x, 1.5x, 2x)
- Fullscreen toggle

### Exercise 4: Infinite Scroll
Buat list component yang load data baru saat user scroll ke bawah. Gunakan `IntersectionObserver` + `useRef` untuk detect kapan element terakhir visible.

### Bonus Challenge 🏆
Buat canvas drawing app sederhana pakai `useRef` untuk akses `<canvas>` element. User bisa draw dengan mouse, pilih warna, dan clear canvas.

---

> 💡 **Key takeaway:** `useRef` itu "escape hatch" dari React's declarative model. Pakai bijak — kalau bisa solve pakai state/props, itu lebih baik. Tapi untuk DOM manipulation dan mutable values, `useRef` is your best friend!
