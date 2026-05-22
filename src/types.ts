export type Priority = 'low' | 'medium' | 'high'

export type Filter = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  notes?: string
  completed: boolean
  priority: Priority
  createdAt: number
  completedAt?: number
  dueAt?: number
  tags: string[]
}

export interface AppState {
  todos: Todo[]
  filter: Filter
  query: string
  activeTag: string | null
}
