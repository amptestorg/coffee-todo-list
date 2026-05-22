import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Flag, Tag } from 'lucide-react'
import clsx from 'clsx'
import type { Priority } from '../types'

interface AddTodoBarProps {
  onAdd: (input: { title: string; priority: Priority; tags: string[] }) => void
}

const priorities: { value: Priority; label: string; dot: string }[] = [
  { value: 'low', label: 'Low', dot: 'bg-priority-low' },
  { value: 'medium', label: 'Medium', dot: 'bg-priority-med' },
  { value: 'high', label: 'High', dot: 'bg-priority-high' },
]

export function AddTodoBar({ onAdd }: AddTodoBarProps) {
  const [value, setValue] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [tag, setTag] = useState('')
  const [showTag, setShowTag] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function submit() {
    if (!value.trim()) return
    const tags = tag
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)
    onAdd({ title: value, priority, tags })
    setValue('')
    setTag('')
    setShowTag(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: 'spring', damping: 18, stiffness: 120 }}
      className={clsx(
        'glass-strong relative overflow-hidden p-3 transition-shadow duration-300',
        focused && 'shadow-glow-accent',
      )}
    >
      <div className="flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-surface">
          <Flag
            className={clsx(
              'h-4 w-4 transition-colors',
              priority === 'high' && 'text-priority-high',
              priority === 'medium' && 'text-priority-med',
              priority === 'low' && 'text-priority-low',
            )}
          />
        </div>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="What's brewing? (⌘K to focus)"
          className="flex-1 bg-transparent text-base text-fg placeholder:text-fg-subtle focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowTag((v) => !v)}
          className={clsx(
            'grid h-10 w-10 place-items-center rounded-2xl border transition-colors',
            showTag
              ? 'border-accent/50 bg-accent/15 text-accent'
              : 'border-transparent bg-surface text-fg-muted hover:text-fg',
          )}
          title="Add tags"
          aria-label="Toggle tag input"
        >
          <Tag className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim()}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-caramel text-accent-foam shadow-glow-accent transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          aria-label="Add task"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-2xl bg-surface p-1">
          {priorities.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={clsx(
                'flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-medium transition-colors',
                priority === p.value
                  ? 'bg-surface-raised text-fg'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              <span className={clsx('h-1.5 w-1.5 rounded-full', p.dot)} />
              {p.label}
            </button>
          ))}
        </div>

        {showTag && (
          <motion.input
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            transition={{ duration: 0.18 }}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submit()
              }
            }}
            placeholder="#tags, comma separated"
            className="min-w-[12rem] flex-1 rounded-xl bg-surface px-3 py-1.5 text-xs text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-accent/40"
          />
        )}
      </div>
    </motion.div>
  )
}
