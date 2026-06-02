/**
 * Patches the runtimeDataModel JSON in the generated Prisma client
 * to add the middleName field to the Member model.
 * This is needed because `prisma generate` can't replace the DLL while
 * the dev server holds a lock on it — but the JS files can still be updated.
 */
const fs = require('fs')
const path = require('path')

const clientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client', 'index.js')
let src = fs.readFileSync(clientPath, 'utf8')

// ── 1. Check if already patched ───────────────────────────────────────────────
const rdmStart = src.indexOf('runtimeDataModel = JSON.parse("')
if (rdmStart === -1) {
  console.error('Could not find runtimeDataModel in index.js')
  process.exit(1)
}

// Extract the JSON string (it's escaped inside JSON.parse("..."))
const jsonStart = src.indexOf('"', rdmStart + 'runtimeDataModel = JSON.parse('.length)
// Find the matching closing quote (unescaped)
let jsonEnd = jsonStart + 1
while (jsonEnd < src.length) {
  if (src[jsonEnd] === '"' && src[jsonEnd - 1] !== '\\') break
  jsonEnd++
}
const escapedJson = src.slice(jsonStart + 1, jsonEnd)
const rdmJson = JSON.parse('"' + escapedJson + '"') // unescape the JSON string

let rdm
try {
  rdm = JSON.parse(rdmJson)
} catch (e) {
  console.error('Failed to parse runtimeDataModel JSON:', e.message)
  process.exit(1)
}

// ── 2. Find the Member model ──────────────────────────────────────────────────
const memberModel = rdm.models?.Member
if (!memberModel) {
  console.error('Member model not found in runtimeDataModel')
  console.log('Available models:', Object.keys(rdm.models || {}))
  process.exit(1)
}

const fields = memberModel.fields
const alreadyHas = fields.some(f => f.name === 'middleName')
if (alreadyHas) {
  console.log('middleName already present in runtimeDataModel — no patch needed')
  process.exit(0)
}

// ── 3. Insert middleName after firstName ─────────────────────────────────────
const firstNameIdx = fields.findIndex(f => f.name === 'firstName')
if (firstNameIdx === -1) {
  console.error('firstName not found in Member fields')
  process.exit(1)
}

const middleNameField = {
  name: 'middleName',
  kind: 'scalar',
  isList: false,
  isRequired: false,
  isUnique: false,
  isId: false,
  isReadOnly: false,
  hasDefaultValue: false,
  type: 'String',
  isGenerated: false,
  isUpdatedAt: false,
}

fields.splice(firstNameIdx + 1, 0, middleNameField)
console.log(`Inserted middleName after firstName (position ${firstNameIdx + 1})`)

// ── 4. Write back ─────────────────────────────────────────────────────────────
const newRdmJson = JSON.stringify(rdm)
const newEscaped = JSON.stringify(newRdmJson).slice(1, -1) // re-escape
const newSrc = src.slice(0, jsonStart + 1) + newEscaped + src.slice(jsonEnd)

fs.writeFileSync(clientPath, newSrc, 'utf8')
console.log('Patched node_modules/.prisma/client/index.js successfully')
console.log('Restart the dev server to pick up the change.')
