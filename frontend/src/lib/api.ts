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
  web?: boolean // pulled from a live web check rather than our corpus
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
  follow_ups?: string[]
  key_points?: Array<{ label: string; text: string }>
  note?: string
  sources: Source[]
  topic: string
  confidence?: 'high' | 'medium' | 'low' | string
  /** Verified local orgs for the user's state + topic, from the resource finder. */
  local_orgs?: OrgCard[]
  /** Warm handoff to a guided legal-aid intake — present on refusals / low confidence. */
  handoff?: { name: string; url?: string; description?: string }
  refused?: boolean
  /** Backend sets reason:"error" (in a 200 response) when the answer engine failed. */
  reason?: string
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
  /** Jurisdiction the user is asking about — keeps answers to federal + this state. */
  state?: string
  /** Locality (e.g. "chicago", "san_francisco") — boosts local ordinances. */
  locality?: string
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export async function ask({ question, language = 'en', area, zip, subject, state, locality }: AskRequest): Promise<AskResponse> {
  const res = await fetch(`${API_URL}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language, area, zip, subject, state, locality }),
  })
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error')
    throw new ApiError(errorText || `Request failed: ${res.status}`, res.status)
  }
  return res.json() as Promise<AskResponse>
}

export async function sendFeedback(helpful: boolean, language = 'en', topic = ''): Promise<void> {
  // Fire-and-forget; a failed vote should never disrupt the user.
  try {
    await fetch(`${API_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ helpful, language, topic }),
    })
  } catch { /* ignore */ }
}

export interface OrgCard {
  name: string
  city?: string
  state?: string
  zip?: string
  address?: string
  phone?: string
  url?: string
  list_codes?: string[]
  languages?: string[]
  source?: string
}

export interface OrgsQuery {
  state?: string
  topic?: string
  list_code?: string
  language?: string
  zip?: string
  limit?: number
  /** Optional, to cancel a stale request when the filters change. */
  signal?: AbortSignal
}

// GET /orgs — the resource finder. Returns verified referral orgs for a place +
// topic, ranked toward the user's language and ZIP.
export async function findOrgs(query: OrgsQuery): Promise<{ count: number; results: OrgCard[] }> {
  const params = new URLSearchParams()
  if (query.state) params.set('state', query.state)
  if (query.topic) params.set('topic', query.topic)
  if (query.list_code) params.set('list_code', query.list_code)
  if (query.language) params.set('language', query.language)
  if (query.zip) params.set('zip', query.zip)
  if (query.limit) params.set('limit', String(query.limit))
  const res = await fetch(`${API_URL}/api/orgs?${params}`, { signal: query.signal })
  if (!res.ok) throw new ApiError(`Org lookup failed: ${res.status}`, res.status)
  return res.json() as Promise<{ count: number; results: OrgCard[] }>
}

export async function search(query: string, topic?: string, k = 5): Promise<{ results: Source[] }> {
  const params = new URLSearchParams({ q: query, k: String(k) })
  if (topic) params.set('topic', topic)
  const res = await fetch(`${API_URL}/api/search?${params}`)
  if (!res.ok) throw new ApiError(`Search failed: ${res.status}`, res.status)
  return res.json()
}