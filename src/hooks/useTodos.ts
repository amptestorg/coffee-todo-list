import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Filter, Priority, Todo } from '../types'
import { cryptoId, loadTodos, saveTodos } from '../lib/storage'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = useCallback(
    (input: {
      title: string
      priority?: Priority
      tags?: string[]
      notes?: string
    }) => {
      const title = input.title.trim()
      if (!title) return
      const todo: Todo = {
        id: cryptoId(),
        title,
        notes: input.notes,
        completed: false,
        priority: input.priority ?? 'medium',
        createdAt: Date.now(),
        tags: input.tags ?? [],
      }
      setTodos((prev) => [todo, ...prev])
    },
    [],
  )

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : undefined,
            }
          : t,
      ),
    )
  }, [])

  const updateTodo = useCallback((id: string, patch: Partial<Todo>) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }, [])

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }, [])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    todos.forEach((t) => t.tags.forEach((tag) => set.add(tag)))
    return Array.from(set).sort()
  }, [todos])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return todos
      .filter((t) => {
        if (filter === 'active' && t.completed) return false
        if (filter === 'completed' && !t.completed) return false
        if (activeTag && !t.tags.includes(activeTag)) return false
        if (q) {
          const hay = (t.title + ' ' + (t.notes ?? '') + ' ' + t.tags.join(' ')).toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        const prio = { high: 0, medium: 1, low: 2 } as const
        if (prio[a.priority] !== prio[b.priority]) {
          return prio[a.priority] - prio[b.priority]
        }
        return b.createdAt - a.createdAt
      })
  }, [todos, filter, query, activeTag])

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const active = total - completed
    const progress = total === 0 ? 0 : completed / total
    return { total, completed, active, progress }
  }, [todos])

  return {
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
  }
}
