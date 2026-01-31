import { useState, useEffect } from 'react'
import type { Note } from '../types'

const STORAGE_KEY = 'notes-app-data'

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  const addNote = (title: string, content: string, dueDate?: number) => {
    const now = Date.now()
    setNotes(prev => [
      { id: crypto.randomUUID(), title, content, createdAt: now, updatedAt: now, completed: false, dueDate },
      ...prev,
    ])
  }

  const updateNote = (id: string, title: string, content: string, dueDate?: number) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, title, content, dueDate, updatedAt: Date.now() } : n)),
    )
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const toggleNote = (id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, completed: !n.completed, updatedAt: Date.now() } : n)),
    )
  }

  return { notes, addNote, updateNote, deleteNote, toggleNote }
}
