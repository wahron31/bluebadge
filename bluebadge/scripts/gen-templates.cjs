const fs = require('fs')
const path = require('path')

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n')
  console.log('Wrote', path.relative(process.cwd(), p))
}

function pad(n, len = 4) { return String(n).padStart(len, '0') }

function genWords(count = 1000) {
  const arr = []
  for (let i = 1; i <= count; i++) {
    arr.push({ id: `w${pad(i)}`, nl: '', tr: '', category: 'politie' })
  }
  return arr
}

function genCognitive(count = 50, type = 'numeric') {
  const arr = []
  for (let i = 1; i <= count; i++) {
    const prefix = type === 'numeric' ? 'n' : type === 'verbal' ? 'v' : 'a'
    arr.push({ id: `${prefix}${pad(i)}`, type, prompt: '', choices: ['', '', ''], correctIndex: 0, explanation: '' })
  }
  return arr
}

function genReading(count = 40) {
  const arr = []
  for (let i = 1; i <= count; i++) {
    arr.push({ id: `r${pad(i)}`, title: '', body: '', questions: [{ prompt: '', choices: ['', '', ''], correctIndex: 0, explanation: '' }] })
  }
  return arr
}

function genListening(count = 40) {
  const arr = []
  for (let i = 1; i <= count; i++) {
    arr.push({ id: `l${pad(i)}`, title: '', audioUrl: '/audio/placeholder.wav', transcript: '', questions: [{ prompt: '', choices: ['', '', ''], correctIndex: 0, explanation: '' }] })
  }
  return arr
}

function genGrammar(count = 40) {
  const arr = []
  for (let i = 1; i <= count; i++) {
    arr.push({ id: `g${pad(i)}`, lang: 'nl', prompt: '', sentence: '___', choices: ['', '', ''], correctIndex: 0, explanation: '' })
  }
  return arr
}

function main() {
  const outDir = path.resolve(__dirname, '..', 'public', 'data')
  ensureDir(outDir)

  writeJson(path.join(outDir, 'words.1000.template.json'), genWords(1000))
  writeJson(path.join(outDir, 'cognitive.numeric.50.template.json'), genCognitive(50, 'numeric'))
  writeJson(path.join(outDir, 'cognitive.verbal.50.template.json'), genCognitive(50, 'verbal'))
  writeJson(path.join(outDir, 'cognitive.abstract.50.template.json'), genCognitive(50, 'abstract'))
  writeJson(path.join(outDir, 'reading.40.template.json'), genReading(40))
  writeJson(path.join(outDir, 'listening.40.template.json'), genListening(40))
  writeJson(path.join(outDir, 'grammar.40.template.json'), genGrammar(40))
}

if (require.main === module) main()