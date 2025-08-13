const fs = require('fs')
const path = require('path')

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n'); console.log('Wrote', path.relative(process.cwd(), p)) }
function pad(n, len = 2) { return String(n).padStart(len, '0') }

function genNumeric() {
  const items = []
  // mix: grootste som, reeksen, procenten, eenvoudige grafiekinterpretatie (tekst)
  for (let i = 1; i <= 15; i++) {
    const a = 10 + i, b = 9 + i, c = 11 + i
    const choices = [`${a}+${i}`, `${b}+${i+1}`, `${c}+${i-1}`]
    const evals = choices.map(expr => eval(expr))
    const correctIndex = evals.indexOf(Math.max(...evals))
    items.push({ id: `n${pad(i)}`, type: 'numeric', prompt: 'Welke uitkomst is het grootst?', choices, correctIndex })
  }
  for (let i = 16; i <= 30; i++) {
    const start = i, d = (i % 4) + 1
    const seq = [start, start + d, start + 2*d, start + 3*d]
    const next = start + 4*d
    items.push({ id: `n${pad(i)}`, type: 'numeric', prompt: `Reeks: ${seq.join(', ')}, … Wat is het volgende?`, choices: [String(next-1), String(next), String(next+1)], correctIndex: 1 })
  }
  for (let i = 31; i <= 40; i++) {
    const base = 80 + i*2
    const p = 10 + (i % 5) * 5
    const correct = Math.round(base * p/100)
    items.push({ id: `n${pad(i)}`, type: 'numeric', prompt: `${p}% van ${base} = ?`, choices: [String(correct-1), String(correct), String(correct+1)], correctIndex: 1 })
  }
  for (let i = 41; i <= 50; i++) {
    const a = 50 + i, b = 45 + i, c = 40 + i
    items.push({ id: `n${pad(i)}`, type: 'numeric', prompt: `Welke waarde is het grootst?`, choices: [String(a), String(b), String(c)], correctIndex: 0 })
  }
  return items
}

function genVerbal() {
  const items = []
  const syn = [['arresteren','aanhouden'],['preventie','voorkoming'],['conflict','ruzie'],['melding','rapportage'],['boete','sanctie']]
  const ant = [['gevaarlijk','veilig'],['schuldig','onschuldig'],['druk','rustig'],['illegaal','legaal'],['open','gesloten']]
  for (let i = 1; i <= 20; i++) {
    const [w, s] = syn[(i-1)%syn.length]
    items.push({ id: `v${pad(i)}`, type: 'verbal', prompt: `Synoniem voor “${w}”`, choices: [s, 'tegenstelling', 'anders'], correctIndex: 0 })
  }
  for (let i = 21; i <= 35; i++) {
    const [w, a] = ant[(i-21)%ant.length]
    items.push({ id: `v${pad(i)}`, type: 'verbal', prompt: `Tegenstelling van “${w}”`, choices: [a, 'synoniem', 'anders'], correctIndex: 0 })
  }
  for (let i = 36; i <= 50; i++) {
    const prompt = 'Vul aan: Politie : uniform = arts : …'
    items.push({ id: `v${pad(i)}`, type: 'verbal', prompt, choices: ['stethoscoop','recept','brancard'], correctIndex: 0 })
  }
  return items
}

function genAbstract() {
  const items = []
  for (let i = 1; i <= 25; i++) {
    items.push({ id: `a${pad(i)}`, type: 'abstract', prompt: 'AB, BC, CD, DE, … Volgende?', choices: ['EF','FG','GH'], correctIndex: 0 })
  }
  for (let i = 26; i <= 50; i++) {
    const k = 2 + (i%3)
    const prompt = `Reeks: ${'▲'.repeat(k)}, ${'▲'.repeat(k+1)}, ${'▲'.repeat(k+2)}, …`
    items.push({ id: `a${pad(i)}`, type: 'abstract', prompt, choices: ['▲'.repeat(k+3),'▲'.repeat(k+1),'▲'.repeat(k+4)], correctIndex: 0 })
  }
  return items
}

function main() {
  const outDir = path.resolve(__dirname, '..', 'public', 'data')
  ensureDir(outDir)
  writeJson(path.join(outDir, 'cognitive.numeric.50.real.json'), genNumeric())
  writeJson(path.join(outDir, 'cognitive.verbal.50.real.json'), genVerbal())
  writeJson(path.join(outDir, 'cognitive.abstract.50.real.json'), genAbstract())
}

if (require.main === module) main()