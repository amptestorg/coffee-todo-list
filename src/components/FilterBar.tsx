import { Search, X } from 'lucide-react'
import clsx from 'clsx'
import type { Filter } from '../types'

interface FilterBarProps {
  filter: Filter
  setFilter: (f: Filter) => void
  query: string
  setQuery: (q: string) => void
  tags: string[]
  activeTag: string | null
  setActiveTag: (t: string | null) => void
  hasCompleted: boolean
  onClearCompleted: () => void
}

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
]

export function FilterBar({
  filter,
  setFilter,
  query,
  setQuery,
  tags,
  activeTag,
  setActiveTag,
  hasCompleted,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-2xl bg-surface p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={clsx(
                'rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f.value
                  ? 'bg-surface-raised text-fg shadow-soft'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 h-4 w-4 text-fg-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-2xl bg-surface py-1.5 pl-9 pr-9 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-accent/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 grid h-6 w-6 place-items-center rounded-lg text-fg-muted hover:text-fg"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {hasCompleted && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="rounded-xl bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted hover:bg-priority-high/10 hover:text-priority-high"
          >
            Clear done
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
            Tags
          </span>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={clsx(
              'rounded-full px-2.5 py-0.5 text-xs transition-colors',
              activeTag === null
                ? 'bg-accent/20 text-accent'
                : 'bg-surface text-fg-muted hover:text-fg',
            )}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTag(activeTag === t ? null : t)}
              className={clsx(
                'rounded-full px-2.5 py-0.5 text-xs transition-colors',
                activeTag === t
                  ? 'bg-accent/20 text-accent'
                  : 'bg-surface text-fg-muted hover:text-fg',
              )}
            >
              #{t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
