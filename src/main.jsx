import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', color: 'white', background: '#09090b', minHeight: '100vh' }}>
        <h2>Setup Required</h2>
        <p>Please add your <code>VITE_CLERK_PUBLISHABLE_KEY</code> to the <code>.env</code> file in the root directory to enable Authentication.</p>
        <p>You can get this key by creating a free account at <a href="https://clerk.com" style={{color: '#3b82f6'}}>clerk.com</a>.</p>
      </div>
    )}
  </StrictMode>,
)
