import { useState, useEffect } from 'react'
import type { Note } from './types'
import { useNotes } from './hooks/useNotes'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const { notes, addNote, updateNote, deleteNote, toggleNote } = useNotes()
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const handleSave = (title: string, content: string, dueDate?: number) => {
    if (editingNote) {
      updateNote(editingNote.id, title, content, dueDate)
      setEditingNote(null)
    } else {
      addNote(title, content, dueDate)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Mis Notas</h1>
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          >
            {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>
        <NoteForm editingNote={editingNote} onSave={handleSave} onCancel={() => setEditingNote(null)} />
        <NoteList notes={notes} onEdit={setEditingNote} onDelete={deleteNote} onToggle={toggleNote} onUpdate={updateNote} />
      </div>
    </div>
  )
}
