import { useState, useEffect } from 'react'
import type { Note } from '../types'
import { improveNote } from '../services/ai'
import ImprovePreview from './ImprovePreview'

interface Props {
  editingNote: Note | null
  onSave: (title: string, content: string, dueDate?: number) => void
  onCancel: () => void
}

export default function NoteForm({ editingNote, onSave, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [improving, setImproving] = useState(false)
  const [preview, setPreview] = useState<{ title: string; content: string } | null>(null)

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title)
      setContent(editingNote.content)
      setDueDate(editingNote.dueDate ? new Date(editingNote.dueDate).toISOString().split('T')[0] : '')
    } else {
      setTitle('')
      setContent('')
      setDueDate('')
    }
  }, [editingNote])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const dueDateTs = dueDate ? new Date(dueDate + 'T00:00:00').getTime() : undefined
    onSave(title.trim(), content.trim(), dueDateTs)
    setTitle('')
    setContent('')
    setDueDate('')
  }

  const handleImprove = async () => {
    if (!title.trim() && !content.trim()) return
    setImproving(true)
    try {
      const result = await improveNote(title, content)
      setPreview(result)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al mejorar')
    } finally {
      setImproving(false)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg p-4 mb-6 space-y-3"
        style={{ backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow)' }}
      >
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            '--tw-ring-color': 'var(--ring-focus)',
          } as React.CSSProperties}
        />
        <textarea
          placeholder="Contenido..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 resize-y"
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            '--tw-ring-color': 'var(--ring-focus)',
          } as React.CSSProperties}
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            '--tw-ring-color': 'var(--ring-focus)',
          } as React.CSSProperties}
          placeholder="Fecha de vencimiento"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 text-white rounded-md transition-colors"
            style={{ backgroundColor: 'var(--accent-blue)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-blue-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent-blue)')}
          >
            {editingNote ? 'Actualizar' : 'Crear nota'}
          </button>
          <button
            type="button"
            onClick={handleImprove}
            disabled={improving || (!title.trim() && !content.trim())}
            className="px-4 py-2 rounded-md transition-colors"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-blue)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
          >
            {improving ? 'Mejorando...' : 'Mejorar con AI'}
          </button>
          {editingNote && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {preview && (
        <ImprovePreview
          title={preview.title}
          content={preview.content}
          onAccept={() => {
            setTitle(preview.title)
            setContent(preview.content)
            setPreview(null)
          }}
          onReject={() => setPreview(null)}
        />
      )}
    </>
  )
}
