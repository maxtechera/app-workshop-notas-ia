import { useState } from 'react'
import type { Note } from '../types'
import { improveNote } from '../services/ai'
import ImprovePreview from './ImprovePreview'

interface Props {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onUpdate: (id: string, title: string, content: string) => void
}

export default function NoteCard({ note, onEdit, onDelete, onToggle, onUpdate }: Props) {
  const [improving, setImproving] = useState(false)
  const [preview, setPreview] = useState<{ title: string; content: string } | null>(null)

  const handleDelete = () => {
    if (window.confirm('¿Eliminar esta nota?')) {
      onDelete(note.id)
    }
  }

  const handleImprove = async () => {
    setImproving(true)
    try {
      const result = await improveNote(note.title, note.content)
      setPreview(result)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al mejorar')
    } finally {
      setImproving(false)
    }
  }

  const date = new Date(note.updatedAt).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <>
      <div
        className="rounded-lg p-4 flex flex-col gap-2 transition-shadow"
        style={{ backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow)', opacity: note.completed ? 0.6 : 1 }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
      >
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={note.completed}
            onChange={() => onToggle(note.id)}
            className="accent-[var(--accent-blue)] w-4 h-4 cursor-pointer flex-shrink-0"
          />
          <h3
            className="font-semibold truncate"
            style={{ color: 'var(--text-primary)', textDecoration: note.completed ? 'line-through' : 'none' }}
          >
            {note.title}
          </h3>
        </div>
        {note.content && (
          <p className="text-sm line-clamp-3 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{note.content}</p>
        )}
        <div
          className="mt-auto flex items-center justify-between pt-2"
          style={{ borderTopWidth: '1px', borderTopColor: 'var(--border-subtle)' }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{date}</span>
            {note.dueDate && (
              <span
                className="text-xs font-medium"
                style={{
                  color: !note.completed && note.dueDate < Date.now() ? 'var(--accent-red)' : 'var(--text-muted)',
                }}
              >
                Vence: {new Date(note.dueDate).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleImprove}
              disabled={improving}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ color: 'var(--accent-blue)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-blue-bg)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {improving ? '...' : 'Mejorar'}
            </button>
            <button
              onClick={() => onEdit(note)}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ color: 'var(--accent-blue)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-blue-bg)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ color: 'var(--accent-red)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-red-bg)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {preview && (
        <ImprovePreview
          title={preview.title}
          content={preview.content}
          onAccept={() => {
            onUpdate(note.id, preview.title, preview.content)
            setPreview(null)
          }}
          onReject={() => setPreview(null)}
        />
      )}
    </>
  )
}
