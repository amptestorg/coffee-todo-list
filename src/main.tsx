import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initTheme } from './hooks/useTheme'
import { initAnalytics } from './lib/analytics'

initTheme()

async function bootstrap() {
  await initAnalytics().catch(() => undefined)

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
