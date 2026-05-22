import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Trash2, Pencil, X } from 'lucide-react'
import clsx from 'clsx'
import type { Priority, Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onUpdate: (id: string, patch: Partial<Todo>) => void
  onRemove: (id: string) => void
}

const priorityRing: Record<Priority, string> = {
  low: 'group-hover:border-priority-low/60',
  medium: 'group-hover:border-priority-med/60',
  high: 'group-hover:border-priority-high/60',
}

const priorityDot: Record<Priority, string> = {
  low: 'bg-priority-low',
  medium: 'bg-priority-med',
  high: 'bg-priority-high',
}

export function TodoItem({ todo, onToggle, onUpdate, onRemove }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function commit() {
    const next = draft.trim()
    if (next && next !== todo.title) {
      onUpdate(todo.id, { title: next })
    } else {
      setDraft(todo.title)
    }
    setEditing(false)
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, x: -16, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', damping: 22, stiffness: 220 }}
      className={clsx(
        'group relative flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 backdrop-blur-md transition-colors hover:border-border-strong',
        todo.completed && 'opacity-60',
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        className={clsx(
          'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-border-strong transition-all',
          priorityRing[todo.priority],
          todo.completed && 'border-accent bg-gradient-caramel shadow-glow-accent',
        )}
      >
        <AnimatePresence>
          {todo.completed && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 280 }}
            >
              <Check className="h-3.5 w-3.5 text-accent-foam" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') {
                setDraft(todo.title)
                setEditing(false)
              }
            }}
            className="w-full bg-transparent text-base text-fg focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={clsx(
              'block w-full truncate text-left text-base text-fg transition-colors',
              todo.completed && 'line-through decoration-fg-muted/60',
            )}
          >
            {todo.title}
          </button>
        )}
        {todo.notes && (
          <p className="mt-1 truncate text-sm text-fg-muted">{todo.notes}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
          <span className="flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
            <span className={clsx('h-1.5 w-1.5 rounded-full', priorityDot[todo.priority])} />
            <span className="capitalize">{todo.priority}</span>
          </span>
          {todo.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-accent/10 px-2 py-0.5 text-accent"
            >
              #{t}
            </span>
          ))}
          <time
            className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle"
            title={new Date(todo.createdAt).toLocaleString()}
          >
            {relativeTime(todo.createdAt)}
          </time>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        {editing ? (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              setDraft(todo.title)
              setEditing(false)
            }}
            className="grid h-8 w-8 place-items-center rounded-xl text-fg-muted hover:bg-surface hover:text-fg"
            aria-label="Cancel edit"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="grid h-8 w-8 place-items-center rounded-xl text-fg-muted hover:bg-surface hover:text-fg"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemove(todo.id)}
          className="grid h-8 w-8 place-items-center rounded-xl text-fg-muted hover:bg-priority-high/10 hover:text-priority-high"
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.li>
  )
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.round(diff / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const h = Math.round(min / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
