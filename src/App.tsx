import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AmbientBackground } from './components/AmbientBackground'
import { Header } from './components/Header'
import { AddTodoBar } from './components/AddTodoBar'
import { FilterBar } from './components/FilterBar'
import { TodoItem } from './components/TodoItem'
import { EmptyState } from './components/EmptyState'
import { useTodos } from './hooks/useTodos'
import { useTheme } from './hooks/useTheme'
import type { ResolvedTheme, ThemePreference } from './hooks/useTheme'
import {
  getVariant,
  isExperimentReady,
  onExperimentReady,
  track,
} from './lib/analytics'

const THEME_FLAG_KEY = 'theme-mode-toggle'
const THEME_FLAG_VARIANT_ON = 'on'

function App() {
  // `null` until Experiment has loaded. Distinguishes "feature off" from
  // "we don't know yet" — without this, an unloaded client falls through to
  // an arbitrary default and the flag has no real gating power.
  const [themeVariant, setThemeVariant] = useState<string | null>(() =>
    isExperimentReady() ? getVariant(THEME_FLAG_KEY) : null,
  )

  useEffect(() => {
    if (themeVariant !== null) return
    return onExperimentReady(() => {
      setThemeVariant(getVariant(THEME_FLAG_KEY) ?? 'off')
    })
  }, [themeVariant])

  const themeSwitcherEnabled = themeVariant === THEME_FLAG_VARIANT_ON
  const flagResolved = themeVariant !== null

  // When the switcher is gated off, the resolved theme is forced to dark.
  // We do this via `useTheme`'s override so the user's stored preference is
  // preserved — when the flag flips on later, their choice comes back.
  const themeOverride: ResolvedTheme | null = !flagResolved
    ? 'dark'
    : themeSwitcherEnabled
      ? null
      : 'dark'

  const { theme, resolvedTheme, setTheme } = useTheme({ override: themeOverride })

  const {
    todos,
    filtered,
    filter,
    setFilter,
    query,
    setQuery,
    activeTag,
    setActiveTag,
    allTags,
    addTodo,
    toggleTodo,
    updateTodo,
    removeTodo,
    clearCompleted,
    stats,
  } = useTodos()

  useEffect(() => {
    track('App Loaded', { total_todos: todos.length })
  }, [todos.length])

  useEffect(() => {
    if (!flagResolved) return
    track('Theme Feature Evaluated', {
      flag_key: THEME_FLAG_KEY,
      variant: themeVariant,
      enabled: themeSwitcherEnabled,
    })
  }, [flagResolved, themeSwitcherEnabled, themeVariant])

  useEffect(() => {
    track('Theme Applied', {
      preference: theme,
      resolved: resolvedTheme,
      source: theme === 'system' ? 'system' : 'user',
      switcher_enabled: themeSwitcherEnabled,
      forced_by_flag: !themeSwitcherEnabled,
    })
  }, [theme, resolvedTheme, themeSwitcherEnabled])

  function onThemeChange(nextTheme: ThemePreference) {
    const nextResolved: ResolvedTheme =
      nextTheme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : nextTheme

    track('Theme Changed', {
      from: theme,
      to: nextTheme,
      resolved: nextResolved,
      flag_variant: themeVariant,
    })
    setTheme(nextTheme)
  }

  const isEmpty = todos.length === 0
  const allDone =
    !isEmpty && stats.active === 0 && filter !== 'completed' && !query && !activeTag
  const noResults =
    !isEmpty && filtered.length === 0 && (filter !== 'all' || !!query || !!activeTag)

  return (
    <>
      <AmbientBackground resolvedTheme={resolvedTheme} />
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16">
        <Header
          progress={stats.progress}
          active={stats.active}
          completed={stats.completed}
          theme={theme}
          onThemeChange={onThemeChange}
          showThemeSwitcher={themeSwitcherEnabled}
        />

        <AddTodoBar
          onAdd={({ title, priority, tags }) => {
            addTodo({ title, priority, tags })
            track('Todo Added', { priority, tag_count: tags.length })
          }}
        />

        <FilterBar
          filter={filter}
          setFilter={(f) => {
            setFilter(f)
            track('Filter Changed', { filter: f })
          }}
          query={query}
          setQuery={setQuery}
          tags={allTags}
          activeTag={activeTag}
          setActiveTag={(t) => {
            setActiveTag(t)
            track('Tag Filter Changed', { tag: t })
          }}
          hasCompleted={stats.completed > 0}
          onClearCompleted={() => {
            clearCompleted()
            track('Completed Cleared', { count: stats.completed })
          }}
        />

        <section className="flex flex-col gap-2">
          {isEmpty && <EmptyState variant="empty" />}
          {allDone && <EmptyState variant="all-done" />}
          {noResults && <EmptyState variant="no-results" />}

          <ul className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {filtered.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={(id) => {
                    toggleTodo(id)
                    track('Todo Toggled', {
                      priority: todo.priority,
                      now_completed: !todo.completed,
                    })
                  }}
                  onUpdate={(id, patch) => {
                    updateTodo(id, patch)
                    track('Todo Edited', { field: Object.keys(patch)[0] })
                  }}
                  onRemove={(id) => {
                    removeTodo(id)
                    track('Todo Removed', { priority: todo.priority })
                  }}
                />
              ))}
            </AnimatePresence>
          </ul>
        </section>

        <footer className="mt-auto flex flex-col items-center gap-1 pt-12 text-xs text-fg-subtle">
          <p>
            Brewed with{' '}
            <span className="font-mono text-fg-muted">React · Tailwind · Framer Motion</span>
          </p>
          <p>
            Everything stays local. <span className="text-fg-muted">Nothing leaves your cup.</span>
          </p>
        </footer>
      </main>
    </>
  )
}

export default App
