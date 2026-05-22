import { Coffee, Monitor, Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { ThemePreference } from '../hooks/useTheme'

interface HeaderProps {
  progress: number
  active: number
  completed: number
  theme: ThemePreference
  onThemeChange: (theme: ThemePreference) => void
  showThemeSwitcher: boolean
}

const themeOptions: Array<{ value: ThemePreference; label: string; icon: typeof Monitor }> = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
]

export function Header({
  progress,
  active,
  completed,
  theme,
  onThemeChange,
  showThemeSwitcher,
}: HeaderProps) {
  const pct = Math.round(progress * 100)
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 120 }}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-caramel shadow-glow-accent"
        >
          <Coffee className="h-6 w-6 text-accent-foam" strokeWidth={2.2} />
        </motion.div>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="accent-text">Coffee</span>
            <span className="text-fg-muted font-medium font-sans"> · tasks</span>
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            A warm cup of focus. Brewed daily.
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-2 sm:w-auto sm:min-w-[16rem]">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-fg-muted">
          <span>Today's brew</span>
          <span className="font-mono text-fg">{pct}%</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-surface">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-caramel"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', damping: 18, stiffness: 90 }}
          />
        </div>
        <div className="flex justify-between text-xs text-fg-muted">
          <span>
            <span className="text-fg">{active}</span> brewing
          </span>
          <span>
            <span className="text-fg">{completed}</span> sipped
          </span>
        </div>
        {showThemeSwitcher && (
          <div className="flex items-center gap-1 rounded-2xl bg-surface p-1">
            {themeOptions.map((option) => {
              const Icon = option.icon
              const selected = theme === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onThemeChange(option.value)}
                  className={clsx(
                    'flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors',
                    selected
                      ? 'bg-surface-raised text-fg shadow-soft'
                      : 'text-fg-muted hover:text-fg',
                  )}
                  aria-pressed={selected}
                  aria-label={`Use ${option.label.toLowerCase()} theme`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}
