interface Props {
  title: string
  content: string
  onAccept: () => void
  onReject: () => void
}

export default function ImprovePreview({ title, content, onAccept, onReject }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full max-w-lg rounded-lg p-5 space-y-4"
        style={{ backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-md)' }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Vista previa — Texto mejorado
        </h3>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Título</p>
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
        </div>
        {content && (
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Contenido</p>
            <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{content}</p>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onAccept}
            className="px-4 py-2 text-white rounded-md transition-colors"
            style={{ backgroundColor: 'var(--accent-blue)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-blue-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent-blue)')}
          >
            Aceptar
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 rounded-md transition-colors"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  )
}
