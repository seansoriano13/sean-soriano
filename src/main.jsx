import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import './styles.css'
import App from './App.jsx'

// The Dive is laid out from the top; a restored mid-page scroll would land
// inside a timeline that was never built from there.
history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
