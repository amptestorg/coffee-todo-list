import type { Todo } from '../types'

const KEY = 'coffee:todos:v1'

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw) as Todo[]
    if (!Array.isArray(parsed)) return seed()
    return parsed
  } catch {
    return seed()
  }
}

export function saveTodos(todos: Todo[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(todos))
  } catch {
    // quota errors are non-fatal — UI keeps state in memory
  }
}

function seed(): Todo[] {
  const now = Date.now()
  return [
    {
      id: cryptoId(),
      title: 'Welcome to Coffee ☕',
      notes: 'Your warm space for what matters today. Try completing this one.',
      completed: false,
      priority: 'medium',
      createdAt: now - 3000,
      tags: ['welcome'],
    },
    {
      id: cryptoId(),
      title: 'Press ⌘K to focus the input',
      completed: false,
      priority: 'low',
      createdAt: now - 2000,
      tags: ['tips'],
    },
    {
      id: cryptoId(),
      title: 'Pick a priority, then press Enter',
      completed: true,
      priority: 'low',
      createdAt: now - 1000,
      completedAt: now - 500,
      tags: ['tips'],
    },
  ]
}

export function cryptoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
