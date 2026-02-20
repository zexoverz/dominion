# 🧩 Quiz: Authentication

## 5 Coding Challenges

> **Topics:** JWT, protected routes, token handling
> **Format:** Fix/implement code, verify with test cases
> **Time:** ~35 minutes

---

## Challenge 1: Implement useAuth Hook

Bikin `useAuth` hook yang manage auth state menggunakan Context.

```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Check saved token on mount

  // Implement:
  // 1. On mount: check localStorage for token, verify with GET /api/auth/me
  // 2. login(email, password) — POST /api/auth/login, save token, set user
  // 3. logout() — clear token, clear user, clear React Query cache
  // 4. register(name, email, password) — POST /api/auth/register, auto-login

  const login = async (email, password) => {
    // ???
  };

  const logout = () => {
    // ???
  };

  const register = async (name, email, password) => {
    // ???
  };

  // value to provide
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

**Test cases:**
```javascript
// login with valid creds → user set, token saved, isAuthenticated = true
// login with invalid creds → throws error, user stays null
// logout → user null, token null, localStorage cleared
// mount with saved valid token → auto-verify, user loaded
// mount with saved invalid token → auto-logout, redirect to login
```

---

## Challenge 2: Fix the ProtectedRoute

This ProtectedRoute has bugs. Find and fix all of them.

```jsx
// ❌ BUGGY — fix it
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth(); // Bug 1: doesn't check loading state

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Bug 2: doesn't save return URL
  }

  return children; // Bug 3: no loading state shown during token verification
}
```

**Fixed version should:**
```javascript
// 1. Show loading spinner while checking auth
// 2. Redirect to /login with ?returnTo=currentPath
// 3. Only render children when authenticated AND done loading

// Test cases:
// loading = true → show <LoadingSpinner />
// loading = false, isAuthenticated = false → <Navigate to="/login?returnTo=/dashboard" />
// loading = false, isAuthenticated = true → render children
```

---

## Challenge 3: JWT Decoder (No Library)

Implement a function that decodes a JWT token payload WITHOUT a library. JWT is base64url encoded.

```javascript
function decodeJWT(token) {
  // JWT format: header.payload.signature
  // We need the payload (middle part)
  // Decode from base64url
  // Parse as JSON
  // Return the payload object
  
  // Implement:
  // ???
}

// Also implement:
function isTokenExpired(token) {
  // Decode token, check exp field against current time
  // Return true if expired, false if still valid
  // ???
}
```

**Test token (paste into jwt.io to verify):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYnVkaUBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMzI3NTIwMCwiZXhwIjoxNzAzMjc4ODAwfQ.fake_signature_here
```

**Test cases:**
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYnVkaUBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMzI3NTIwMCwiZXhwIjoxNzAzMjc4ODAwfQ.fake';

const payload = decodeJWT(token);
expect(payload.userId).toBe(1);
expect(payload.email).toBe('budi@example.com');
expect(payload.role).toBe('admin');
expect(payload.exp).toBe(1703278800);

// Token with exp in the past → expired
expect(isTokenExpired(token)).toBe(true);

// Token with exp in the future → not expired
const futureToken = createTokenWithExp(Date.now() / 1000 + 3600); // 1 hour from now
expect(isTokenExpired(futureToken)).toBe(false);
```

---

## Challenge 4: Role-Based Access Control

Implement `RoleGuard` component yang restrict access based on user role.

```jsx
// Implement RoleGuard
function RoleGuard({ roles, children, fallback = null }) {
  // roles: array of allowed roles, e.g., ['admin', 'manager']
  // children: render if user has required role
  // fallback: render if user doesn't have role (default: null / nothing)
  
  // Implement:
  // ???
}

// Usage:
function AdminPage() {
  return (
    <ProtectedRoute>
      <RoleGuard roles={['admin']} fallback={<p>Access denied. Admin only.</p>}>
        <AdminDashboard />
      </RoleGuard>
    </ProtectedRoute>
  );
}

function ManagerPage() {
  return (
    <ProtectedRoute>
      <RoleGuard roles={['admin', 'manager']}>
        <ManagerDashboard />
      </RoleGuard>
    </ProtectedRoute>
  );
}
```

**Test cases:**
```javascript
// User with role 'admin':
// RoleGuard roles={['admin']} → render children ✅
// RoleGuard roles={['admin', 'manager']} → render children ✅
// RoleGuard roles={['superadmin']} → render fallback ❌

// User with role 'user':
// RoleGuard roles={['admin']} → render fallback ❌
// RoleGuard roles={['user', 'admin']} → render children ✅
```

---

## Challenge 5: Secure Token Storage Pattern

Implement a `tokenService` that handles token storage with these requirements:
- Access token in memory (not localStorage) for security
- Refresh token in localStorage (or httpOnly cookie in real app)
- Auto-clear on tab close (access token only)

```javascript
// Implement tokenService
const tokenService = {
  _accessToken: null, // In-memory only

  getAccessToken() {
    // Return in-memory access token
  },

  setAccessToken(token) {
    // Store in memory
  },

  getRefreshToken() {
    // Return from localStorage
  },

  setRefreshToken(token) {
    // Store in localStorage
  },

  setTokens(accessToken, refreshToken) {
    // Store both
  },

  clearTokens() {
    // Clear both (memory + localStorage)
  },

  hasTokens() {
    // Return true if both tokens exist
  },

  // Bonus: get token expiration
  getTokenExpiry(token) {
    // Decode JWT, return exp as Date
  },

  isAccessTokenExpired() {
    // Check if access token is expired (or will expire in 30 seconds)
  },
};
```

**Test cases:**
```javascript
// Initially empty
expect(tokenService.hasTokens()).toBe(false);
expect(tokenService.getAccessToken()).toBeNull();

// Set tokens
tokenService.setTokens('access-123', 'refresh-456');
expect(tokenService.getAccessToken()).toBe('access-123');
expect(tokenService.getRefreshToken()).toBe('refresh-456');
expect(tokenService.hasTokens()).toBe(true);

// Access token NOT in localStorage (security)
expect(localStorage.getItem('accessToken')).toBeNull();

// Refresh token IS in localStorage
expect(localStorage.getItem('refreshToken')).toBe('refresh-456');

// Clear
tokenService.clearTokens();
expect(tokenService.hasTokens()).toBe(false);
expect(localStorage.getItem('refreshToken')).toBeNull();
```
