import type { Note } from '../types'
import NoteCard from './NoteCard'

interface Props {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onUpdate: (id: string, title: string, content: string) => void
}

export default function NoteList({ notes, onEdit, onDelete, onToggle, onUpdate }: Props) {
  if (notes.length === 0) {
    return <p className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No hay notas todavía.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...notes].sort((a, b) => Number(a.completed) - Number(b.completed)).map(note => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} onUpdate={onUpdate} />
      ))}
    </div>
  )
}
