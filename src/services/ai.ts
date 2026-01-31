export async function improveNote(title: string, content: string): Promise<{ title: string; content: string }> {
  const res = await fetch('http://localhost:3001/api/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(err.error || 'Error al mejorar nota')
  }

  return res.json()
}
