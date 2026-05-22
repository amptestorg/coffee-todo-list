import { useEffect, useMemo, useState } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'coffee:theme:v1'
const META_THEME_COLOR_SELECTOR = 'meta[name="theme-color"]'

const THEME_COLOR: Record<ResolvedTheme, string> = {
  dark: '#150b06',
  light: '#FBF6EE',
}

function getStoredTheme(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // no-op
  }
  return 'system'
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: ThemePreference): ResolvedTheme {
  if (theme === 'system') return getSystemTheme()
  return theme
}

function applyThemeToDocument(resolvedTheme: ResolvedTheme) {
  document.documentElement.setAttribute('data-theme', resolvedTheme)
  document.documentElement.style.colorScheme = resolvedTheme

  const metaThemeColor = document.querySelector<HTMLMetaElement>(META_THEME_COLOR_SELECTOR)
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', THEME_COLOR[resolvedTheme])
  }
}

export function initTheme() {
  if (typeof window === 'undefined') return
  const resolvedTheme = resolveTheme(getStoredTheme())
  applyThemeToDocument(resolvedTheme)
}

export function useTheme(initialTheme: ThemePreference = 'system') {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return initialTheme
    return getStoredTheme()
  })
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return initialTheme === 'dark' ? 'dark' : 'light'
    return getSystemTheme()
  })

  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (theme === 'system') return systemTheme
    return theme
  }, [theme, systemTheme])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // no-op
    }
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    applyThemeToDocument(resolvedTheme)
  }, [resolvedTheme])

  return {
    theme,
    resolvedTheme,
    setTheme,
  }
}
