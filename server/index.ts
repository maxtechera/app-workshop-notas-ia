import express from 'express'
import cors from 'cors'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const prompt = (title: string, content: string) =>
  `Mejora la gramática, claridad y redacción del siguiente texto. Devuelve SOLO un JSON válido con las claves "title" y "content", sin markdown ni explicaciones.

Título: ${title}
Contenido: ${content}`

app.post('/api/improve', async (req, res) => {
  const { title, content } = req.body
  if (!title && !content) {
    return res.status(400).json({ error: 'title o content requerido' })
  }

  const systemPrompt = prompt(title || '', content || '')

  try {
    let result: string

    try {
      const response = await generateText({
        model: google('gemini-1.5-flash'),
        prompt: systemPrompt,
      })
      result = response.text
    } catch {
      console.log('Gemini falló, usando Groq como fallback...')
      const response = await generateText({
        model: groq('llama-3.1-8b-instant'),
        prompt: systemPrompt,
      })
      result = response.text
    }

    // Parse JSON from response, handling possible markdown wrapping
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Respuesta inválida del modelo' })
    }

    const improved = JSON.parse(jsonMatch[0])
    res.json({ title: improved.title || title, content: improved.content || content })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Error al mejorar el texto' })
  }
})

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001')
})
