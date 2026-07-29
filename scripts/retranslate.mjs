// Re-translate ALL translatable content with a top MT engine (more accurate than
// the current machine drafts), then diff against what's live so reviewers only look
// at what changed. Covers:
//   - UI strings          (translations.tsx  STRINGS)      parallel-by-key
//   - referral-org text   (translations.tsx  ORG_I18N)     keyed-by-English
//   - resource cards      (Resources.tsx  DESC/TAG/META_I18N) keyed-by-English
//   - topic-page content  (Housing/Money/Repairs/Benefits.tsx CONTENT) parallel-nested
//
//   DeepL  -> Spanish, Chinese, Vietnamese   (DEEPL_API_KEY; free tier is fine)
//   Google -> Tagalog                        (GOOGLE_TRANSLATE_KEY; DeepL has no Tagalog)
//
// Both over plain REST (no SDK). Keys come from env vars, never committed. Output:
//   docs/review/retranslate/<lang>.csv  — section | id | English | current | new MT | changed?
// Nothing in the app changes; you review the CSVs and paste in the wins.
//
// Engines (see CODE map): deepl (default es/zh/vi, needs key, most accurate) ·
// google (default tl, needs key) · libre (LibreTranslate, self-host/key) ·
// apertium (free/no key, English→Spanish only, lower quality). Override all langs
// with --engine <name>.
//
// Usage:
//   DEEPL_API_KEY=... GOOGLE_TRANSLATE_KEY=... node scripts/retranslate.mjs
//   node scripts/retranslate.mjs --langs es,vi                 # subset
//   node scripts/retranslate.mjs --dry-run                     # count only, no API calls
//   LIBRETRANSLATE_URL=http://localhost:5000 node scripts/retranslate.mjs --engine libre
//   node scripts/retranslate.mjs --engine apertium --langs es  # free, no key (Spanish)

import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'docs/review/retranslate')

const NAMES = { es: 'Spanish', zh: 'Chinese', vi: 'Vietnamese', tl: 'Tagalog' }
const LANGS = Object.keys(NAMES)

// Default engine per language; override every language with --engine <name>.
const DEFAULT_ENGINE = { es: 'deepl', zh: 'deepl', vi: 'deepl', tl: 'google' }

// Target-language code per engine. null = that engine can't do that language.
//   deepl    — most accurate, needs DEEPL_API_KEY (free tier ok); no Tagalog.
//   google   — covers all 5, needs GOOGLE_TRANSLATE_KEY (free tier ok).
//   libre    — LibreTranslate: free/open-source, self-host (LIBRETRANSLATE_URL) or
//              public (may need LIBRETRANSLATE_API_KEY); verify tl on your instance.
//   apertium — free, no key, but English→Spanish only here (APERTIUM_URL optional).
const CODE = {
  deepl:    { es: 'ES', zh: 'ZH', vi: 'VI', tl: null },
  google:   { es: 'es', zh: 'zh-CN', vi: 'vi', tl: 'tl' },
  libre:    { es: 'es', zh: 'zh', vi: 'vi', tl: 'tl' },
  apertium: { es: 'spa', zh: null, vi: null, tl: null },
}

// Each source declares its file, the const to read, and its shape.
const SOURCES = [
  { section: 'ui',            file: 'frontend/src/lib/translations.tsx', varName: 'STRINGS',   shape: 'parallel' },
  { section: 'org',           file: 'frontend/src/lib/translations.tsx', varName: 'ORG_I18N',  shape: 'byEnglish' },
  { section: 'res-desc',      file: 'frontend/src/pages/Resources.tsx',  varName: 'DESC_I18N', shape: 'byEnglish' },
  { section: 'res-tag',       file: 'frontend/src/pages/Resources.tsx',  varName: 'TAG_I18N',  shape: 'byEnglish' },
  { section: 'res-meta',      file: 'frontend/src/pages/Resources.tsx',  varName: 'META_I18N', shape: 'byEnglish' },
  { section: 'topic-housing', file: 'frontend/src/pages/Housing.tsx',    varName: 'CONTENT',   shape: 'parallel' },
  { section: 'topic-money',   file: 'frontend/src/pages/Money.tsx',      varName: 'CONTENT',   shape: 'parallel' },
  { section: 'topic-repairs', file: 'frontend/src/pages/Repairs.tsx',    varName: 'CONTENT',   shape: 'parallel' },
  { section: 'topic-benefits',file: 'frontend/src/pages/Benefits.tsx',   varName: 'CONTENT',   shape: 'parallel' },
]

const args = process.argv.slice(2)
const DRY = args.includes('--dry-run')
const only = (() => { const i = args.indexOf('--langs'); return i >= 0 && args[i + 1] ? args[i + 1].split(',') : LANGS })()
const engineOverride = (() => { const i = args.indexOf('--engine'); return i >= 0 ? args[i + 1] : null })()

// --- extract a `const <varName> ... = { ... }` literal via a string-aware brace scan ---
function extractVar(fileText, varName) {
  const mi = fileText.indexOf(`const ${varName}`)
  if (mi < 0) return null
  const start = fileText.indexOf('{', fileText.indexOf('=', mi))
  let depth = 0, inStr = false, q = '', esc = false, end = start
  for (let i = start; i < fileText.length; i++) {
    const c = fileText[i]
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; continue }
    if (c === "'" || c === '"' || c === '`') { inStr = true; q = c; continue }
    if (c === '{') depth++
    else if (c === '}' && --depth === 0) { end = i + 1; break }
  }
  // eslint-disable-next-line no-eval
  return eval('(' + fileText.slice(start, end) + ')')
}

// Flatten nested objects/arrays to [ {p: 'faqs.0.q', v: 'string'} ] for string leaves.
function flatten(obj, prefix = '', out = []) {
  if (typeof obj === 'string') { out.push({ p: prefix, v: obj }); return out }
  if (Array.isArray(obj)) { obj.forEach((x, i) => flatten(x, prefix ? `${prefix}.${i}` : `${i}`, out)); return out }
  if (obj && typeof obj === 'object') { for (const k of Object.keys(obj)) flatten(obj[k], prefix ? `${prefix}.${k}` : k, out) }
  return out
}

// Build items [{section, id, english, currents:{es,zh,tl,vi}}] for one source.
function itemsFor(src) {
  const data = extractVar(fs.readFileSync(path.join(ROOT, src.file), 'utf8'), src.varName)
  if (!data) return []
  const items = []
  if (src.shape === 'parallel') {
    const enLeaves = flatten(data.en || {})
    const targetMaps = {}
    for (const l of LANGS) targetMaps[l] = Object.fromEntries(flatten(data[l] || {}).map((x) => [x.p, x.v]))
    for (const { p, v } of enLeaves) {
      items.push({ section: src.section, id: p, english: v, currents: Object.fromEntries(LANGS.map((l) => [l, targetMaps[l][p] ?? ''])) })
    }
  } else { // byEnglish: keys ARE the English source (union across languages)
    const englishKeys = new Set()
    for (const l of LANGS) for (const k of Object.keys(data[l] || {})) englishKeys.add(k)
    for (const eng of englishKeys) {
      items.push({ section: src.section, id: eng.slice(0, 40), english: eng, currents: Object.fromEntries(LANGS.map((l) => [l, (data[l] || {})[eng] ?? ''])) })
    }
  }
  return items
}

const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))
const csvCell = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`

async function deepl(texts, code) {
  const key = process.env.DEEPL_API_KEY
  if (!key) throw new Error('DEEPL_API_KEY not set')
  const host = key.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com'
  const out = []
  for (const part of chunk(texts, 40)) {
    const body = new URLSearchParams()
    body.set('source_lang', 'EN'); body.set('target_lang', code)
    part.forEach((t) => body.append('text', t))
    const r = await fetch(`https://${host}/v2/translate`, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    if (!r.ok) throw new Error(`DeepL ${r.status}: ${(await r.text()).slice(0, 120)}`)
    out.push(...(await r.json()).translations.map((t) => t.text))
  }
  return out
}

async function google(texts, code) {
  const key = process.env.GOOGLE_TRANSLATE_KEY
  if (!key) throw new Error('GOOGLE_TRANSLATE_KEY not set')
  const out = []
  for (const part of chunk(texts, 100)) {
    const r = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: part, source: 'en', target: code, format: 'text' }),
    })
    if (!r.ok) throw new Error(`Google ${r.status}: ${(await r.text()).slice(0, 120)}`)
    out.push(...(await r.json()).data.translations.map((t) => t.translatedText))
  }
  return out
}
async function libre(texts, code) {
  const url = (process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com').replace(/\/$/, '')
  const key = process.env.LIBRETRANSLATE_API_KEY
  const out = []
  for (const part of chunk(texts, 40)) {
    const r = await fetch(`${url}/translate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: part, source: 'en', target: code, format: 'text', ...(key ? { api_key: key } : {}) }),
    })
    if (!r.ok) throw new Error(`LibreTranslate ${r.status}: ${(await r.text()).slice(0, 120)}`)
    const j = await r.json()
    out.push(...(Array.isArray(j.translatedText) ? j.translatedText : [j.translatedText]))
  }
  return out
}

async function apertium(texts, code) {
  const base = (process.env.APERTIUM_URL || 'https://apertium.org/apy').replace(/\/$/, '')
  const out = []
  for (const t of texts) { // Apertium APY takes one string per call
    const r = await fetch(`${base}/translate?langpair=eng|${code}&markUnknown=no&q=${encodeURIComponent(t)}`)
    if (!r.ok) throw new Error(`Apertium ${r.status}`)
    out.push((await r.json()).responseData.translatedText)
  }
  return out
}

const RUN = { deepl, google, libre, apertium }

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const items = SOURCES.flatMap(itemsFor)
  const bySection = {}
  for (const it of items) bySection[it.section] = (bySection[it.section] || 0) + 1
  console.log(`${items.length} translatable strings across ${SOURCES.length} sources:`)
  for (const [s, n] of Object.entries(bySection)) console.log(`  ${s.padEnd(15)} ${n}`)
  console.log(`langs: ${only.join(', ')}${DRY ? ' · DRY RUN (no API calls)' : ''}\n`)
  if (DRY) return

  for (const lang of only) {
    const engine = engineOverride || DEFAULT_ENGINE[lang]
    const code = CODE[engine]?.[lang]
    if (!code) { console.log(`  ${NAMES[lang]}: skipped — engine '${engine}' has no ${lang}`); continue }
    try {
      // dedupe English strings to save API calls, then map results back
      const uniq = [...new Set(items.map((it) => it.english))]
      const translated = await RUN[engine](uniq, code)
      const map = Object.fromEntries(uniq.map((e, i) => [e, translated[i]]))
      let changed = 0
      const rows = [['section', 'id', 'English (source)', `${NAMES[lang]} — current`, `${NAMES[lang]} — new (${engine})`, 'changed?']]
      for (const it of items) {
        const now = it.currents[lang] || ''
        const nw = map[it.english] ?? ''
        const diff = now.trim() !== nw.trim()
        if (diff) changed++
        rows.push([it.section, it.id, it.english, now, nw, diff ? 'YES' : ''])
      }
      fs.writeFileSync(path.join(OUT, `${lang}.csv`), rows.map((r) => r.map(csvCell).join(',')).join('\n'))
      console.log(`  ${NAMES[lang]}: ${changed}/${items.length} differ via ${engine} (${uniq.length} unique) -> docs/review/retranslate/${lang}.csv`)
    } catch (e) {
      console.log(`  ${NAMES[lang]}: SKIPPED — ${e.message}`)
    }
  }
  console.log('\nReview the CSVs (sort by changed?=YES), paste wins into the source files. Native review still recommended.')
}

main()
