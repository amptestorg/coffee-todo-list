import { motion } from 'framer-motion'
import { CheckCircle2, Coffee } from 'lucide-react'

interface EmptyStateProps {
  variant: 'empty' | 'no-results' | 'all-done'
}

const copy = {
  empty: {
    title: 'A clean cup.',
    body: 'Add your first task to start brewing.',
    icon: Coffee,
  },
  'no-results': {
    title: 'No matches.',
    body: 'Try a different filter or search.',
    icon: Coffee,
  },
  'all-done': {
    title: 'All sipped. ☕',
    body: 'Take a breath — you earned the refill.',
    icon: CheckCircle2,
  },
} as const

export function EmptyState({ variant }: EmptyStateProps) {
  const { title, body, icon: Icon } = copy[variant]
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center"
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-surface">
        <Icon className="h-6 w-6 text-fg-muted" />
      </div>
      <div>
        <p className="text-base font-medium text-fg">{title}</p>
        <p className="mt-1 text-sm text-fg-muted">{body}</p>
      </div>
    </motion.div>
  )
}
