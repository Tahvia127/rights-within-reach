// api.ts
// Client for the Rights Within Reach FastAPI backend.
// POST /ask    -- search + answer + sources + safety guardrails
// POST /search -- retrieval only

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000'

export interface Source {
  title: string
  section: string
  url?: string
  topic: string
  score?: number
}

export interface Contact {
  name: string
  sub?: string
  why?: string
  how?: string
  phone?: string
  hours?: string
  url?: string
}

export interface AskResponse {
  answer: string
  disclaimer?: string
  next_steps?: string[]
  contact?: Contact
  key_points?: Array<{ label: string; text: string }>
  note?: string
  sources: Source[]
  topic: string
  refused?: boolean
  refusal_org?: {
    name: string
    sub: string
    description: string
    phone: string
    hours: string
  }
}

export interface AskRequest {
  question: string
  language?: string
  area?: string
  zip?: string
  subject?: string
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export async function ask({ question, language = 'en', area, zip, subject }: AskRequest): Promise<AskResponse> {
  const res = await fetch(`${API_URL}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language, area, zip, subject }),
  })
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error')
    throw new ApiError(errorText || `Request failed: ${res.status}`, res.status)
  }
  return res.json() as Promise<AskResponse>
}

export async function search(query: string, topic?: string, k = 5): Promise<{ results: Source[] }> {
  const params = new URLSearchParams({ q: query, k: String(k) })
  if (topic) params.set('topic', topic)
  const res = await fetch(`${API_URL}/api/search?${params}`)
  if (!res.ok) throw new ApiError(`Search failed: ${res.status}`, res.status)
  return res.json()
}