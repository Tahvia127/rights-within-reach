// Export UI strings to per-language review CSVs for native-speaker review.
// Re-run whenever translations change:  node scripts/export_translations.mjs
//
// Output: docs/review/translations/<lang>.csv with columns
//   key | English | <Language> | status (OK / FIX) | suggested correction | notes
// Missing translations are flagged so reviewers can supply them.
//
// Note: this covers the shared UI strings in translations.tsx. The topic-page
// legal content and Resources org cards live in their own per-language files and
// are best reviewed in-context on the live site (see REVIEW-language.md).

import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'frontend/src/lib/translations.tsx')
const OUT = path.join(ROOT, 'docs/review/translations')

const src = fs.readFileSync(SRC, 'utf8')

// Extract the STRINGS object literal via a string-aware brace scan, then eval it
// (the literal is valid JS once isolated from the surrounding TS/JSX).
const mi = src.indexOf('const STRINGS')
const start = src.indexOf('{', src.indexOf('=', mi))
let depth = 0, inStr = false, q = '', esc = false, end = start
for (let i = start; i < src.length; i++) {
  const c = src[i]
  if (inStr) {
    if (esc) esc = false
    else if (c === '\\') esc = true
    else if (c === q) inStr = false
    continue
  }
  if (c === "'" || c === '"' || c === '`') { inStr = true; q = c; continue }
  if (c === '{') depth++
  else if (c === '}' && --depth === 0) { end = i + 1; break }
}
// eslint-disable-next-line no-eval
const STRINGS = eval('(' + src.slice(start, end) + ')')

const LANGS = { es: 'Spanish', zh: 'Chinese', tl: 'Tagalog', vi: 'Vietnamese' }
const en = STRINGS.en

const csvCell = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`

fs.mkdirSync(OUT, { recursive: true })
let missingTotal = 0
for (const [code, name] of Object.entries(LANGS)) {
  const t = STRINGS[code] || {}
  const rows = [['key', 'English (source)', name, 'status (OK / FIX)', 'suggested correction', 'notes']]
  let missing = 0
  for (const key of Object.keys(en)) {
    const has = Object.prototype.hasOwnProperty.call(t, key)
    if (!has) missing++
    rows.push([key, en[key], has ? t[key] : '', has ? '' : 'MISSING', '', ''])
  }
  fs.writeFileSync(path.join(OUT, `${code}.csv`), rows.map((r) => r.map(csvCell).join(',')).join('\n'), 'utf8')
  missingTotal += missing
  console.log(`${name.padEnd(11)} ${Object.keys(en).length} keys, ${missing} missing -> docs/review/translations/${code}.csv`)
}
console.log(`\nTotal source keys: ${Object.keys(en).length}. Missing across languages: ${missingTotal}.`)
