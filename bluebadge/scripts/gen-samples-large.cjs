const fs = require('fs')
const path = require('path')

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n'); console.log('Wrote', path.relative(process.cwd(), p)) }
function pad(n, len = 3) { return String(n).padStart(len, '0') }

function genReading(count = 500) {
  const items = []
  for (let i = 1; i <= count; i++) {
    const body = `Bericht ${i}: In de wijk wordt extra toezicht gehouden. Bewoners worden gevraagd na 22:00 stilte te respecteren.`
    items.push({ id: `rL${pad(i)}`, title: `Tekst ${i}`, body, questions: [{ prompt: 'Wat is het doel?', choices: ['Meer boetes', 'Minder overlast', 'Meer verkeer'], correctIndex: 1 }] })
  }
  return items
}

function genListening(count = 500) {
  const items = []
  for (let i = 1; i <= count; i++) {
    const transcript = `Goedemiddag, routinecontrole ${i}. Mag ik uw identiteitskaart, alstublieft?`
    items.push({ id: `lL${pad(i)}`, title: `Fragment ${i}`, audioUrl: '/audio/identiteitscontrole.wav', transcript, questions: [{ prompt: 'Wat wordt gevraagd?', choices: ['Rijbewijs','Identiteitskaart','Verzekering'], correctIndex: 1 }] })
  }
  return items
}

function genGrammar(count = 500) {
  const items = []
  for (let i = 1; i <= count; i++) {
    const sentence = `De agent ___ het rapport (${i}).`
    items.push({ id: `gL${pad(i)}`, lang: 'nl', prompt: 'Kies de juiste vorm', sentence, choices: ['schrijft','schrijven','schreef'], correctIndex: 0 })
  }
  return items
}

function genCognitive(count = 200, type = 'numeric') {
  const items = []
  for (let i = 1; i <= count; i++) {
    if (type === 'numeric') {
      const a = 20 + i, b = 15 + i, c = 25 + i
      const choices = [`${a}+${i}`, `${b}+${i+1}`, `${c-2}+${i+2}`]
      const evals = choices.map(expr => eval(expr.replace(/\+/g,'+')))
      const correctIndex = evals.indexOf(Math.max(...evals))
      items.push({ id: `nL${pad(i)}`, type: 'numeric', prompt: 'Welke uitkomst is het grootst?', choices, correctIndex })
    } else if (type === 'verbal') {
      const prompt = `Synoniem voor woord ${i}`
      const choices = ['alternatief', 'tegenstelling', 'onzinwoord']
      items.push({ id: `vL${pad(i)}`, type: 'verbal', prompt, choices, correctIndex: 0 })
    } else {
      const k = (i % 3) + 2
      const seq = '▲'.repeat(k) + ', ' + '▲'.repeat(k+1) + ', ' + '▲'.repeat(k+2)
      const choices = ['▲'.repeat(k+3), '▲'.repeat(k+1), '▲'.repeat(k+4)]
      items.push({ id: `aL${pad(i)}`, type: 'abstract', prompt: `Reeks: ${seq}, …`, choices, correctIndex: 0 })
    }
  }
  return items
}

function main() {
  const outDir = path.resolve(__dirname, '..', 'public', 'data')
  ensureDir(outDir)
  writeJson(path.join(outDir, 'reading.500.large.json'), genReading(500))
  writeJson(path.join(outDir, 'listening.500.large.json'), genListening(500))
  writeJson(path.join(outDir, 'grammar.500.large.json'), genGrammar(500))
  writeJson(path.join(outDir, 'cognitive.numeric.200.large.json'), genCognitive(200, 'numeric'))
  writeJson(path.join(outDir, 'cognitive.verbal.200.large.json'), genCognitive(200, 'verbal'))
  writeJson(path.join(outDir, 'cognitive.abstract.200.large.json'), genCognitive(200, 'abstract'))
}

if (require.main === module) main()