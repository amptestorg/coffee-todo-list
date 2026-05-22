import { useCallback, useEffect, useMemo, useState } from 'react'

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

interface UseThemeOptions {
  /**
   * When set, the resolved theme is forced to this value regardless of the
   * user's stored preference. Used to gate the feature behind a flag without
   * destroying the preference. Pass `null` to apply the user's preference.
   */
  override?: ResolvedTheme | null
}

export function useTheme(options: UseThemeOptions = {}) {
  const { override = null } = options

  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return 'system'
    return getStoredTheme()
  })
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'dark'
    return getSystemTheme()
  })

  const userResolvedTheme = useMemo<ResolvedTheme>(() => {
    if (theme === 'system') return systemTheme
    return theme
  }, [theme, systemTheme])

  const resolvedTheme: ResolvedTheme = override ?? userResolvedTheme

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    applyThemeToDocument(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // no-op
    }
  }, [])

  return {
    /** User's stored preference. Untouched by `override`. */
    theme,
    /** What's actually applied to the DOM (may be flag-overridden). */
    resolvedTheme,
    /** What would be applied if the override weren't in effect. */
    userResolvedTheme,
    setTheme,
  }
}
