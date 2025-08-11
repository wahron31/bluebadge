const fs = require('fs')
const path = require('path')

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n'); console.log('Wrote', path.relative(process.cwd(), p)) }
function pad(n, len = 2) { return String(n).padStart(len, '0') }

function genNumeric50() {
  const items = []
  // 1-20: grootste som
  for (let i = 1; i <= 20; i++) {
    const a = 10 + i, b = 8 + i, c = 12 + i
    const choices = [`${a}+${i}`, `${b}+${i+1}`, `${c-2}+${i+2}`]
    const evals = choices.map(expr => eval(expr.replace(/\+/g,'+')))
    const correctIndex = evals.indexOf(Math.max(...evals))
    items.push({ id: `n${pad(i)}`, type: 'numeric', prompt: 'Welke uitkomst is het grootst?', choices, correctIndex })
  }
  // 21-35: reeksen (toename met vast verschil)
  for (let i = 21; i <= 35; i++) {
    const start = i
    const d = (i % 3) + 2
    const seq = [start, start + d, start + 2*d, start + 3*d]
    const next = start + 4*d
    const choices = [String(next - 1), String(next), String(next + 1)]
    const correctIndex = 1
    items.push({ id: `n${pad(i)}`, type: 'numeric', prompt: `Reeks: ${seq.join(', ')}, … Wat is het volgende getal?`, choices, correctIndex })
  }
  // 36-50: eenvoudige breuken/percent
  for (let i = 36; i <= 50; i++) {
    const base = 100 + (i * 3)
    const prompt = `25% van ${base} is …`
    const correct = String(Math.round(base * 0.25))
    const choices = [String(Math.round(base * 0.2)), correct, String(Math.round(base * 0.3))]
    const correctIndex = 1
    items.push({ id: `n${pad(i)}`, type: 'numeric', prompt, choices, correctIndex })
  }
  return items
}

function genVerbal50() {
  const items = []
  const pairs = [
    ['arresteren','aanhouden'], ['controle','inspectie'], ['boete','sanctie'], ['getuige','ooggetuige'], ['bewijs','indicatie'],
    ['opsporing','zoektocht'], ['preventie','voorkoming'], ['veiligheid','bescherming'], ['melden','rapporteren'], ['conflict','ruzie'],
  ]
  // 1-20: synoniemen
  for (let i = 1; i <= 20; i++) {
    const [w, syn] = pairs[(i-1)%pairs.length]
    const prompt = `Synoniem voor “${w}”`
    const choices = [syn, 'tegenstelling', 'onzinwoord']
    items.push({ id: `v${pad(i)}`, type: 'verbal', prompt, choices, correctIndex: 0 })
  }
  // 21-35: antoniemen
  const anton = [['gevaarlijk','veilig'],['schuldig','onschuldig'],['druk','rustig'],['illegaal','legaal'],['open','gesloten']]
  for (let i = 21; i <= 35; i++) {
    const [w, ant] = anton[(i-21)%anton.length]
    const prompt = `Tegenstelling van “${w}”`
    const choices = [ant, 'gelijk', 'ander']
    items.push({ id: `v${pad(i)}`, type: 'verbal', prompt, choices, correctIndex: 0 })
  }
  // 36-50: analogieën
  const analogies = [
    ['politie','uniform','arts',''], ['agent','patrouille','postbode',''], ['rechter','vonnis','arts',''], ['brandweer','blussen','arts','']
  ]
  const fillers = ['stethoscoop','operatie','diagnose','patient']
  for (let i = 36; i <= 50; i++) {
    const base = analogies[(i-36)%analogies.length]
    let prompt = ''
    let correct = ''
    if (base[0]==='politie') { prompt = 'Politie : uniform = arts : …'; correct = 'stethoscoop' }
    if (base[0]==='agent') { prompt = 'Agent : patrouille = postbode : …'; correct = 'rondbrengen' }
    if (base[0]==='rechter') { prompt = 'Rechter : vonnis = arts : …'; correct = 'diagnose' }
    if (base[0]==='brandweer') { prompt = 'Brandweer : blussen = arts : …'; correct = 'behandelen' }
    const choices = [correct, fillers[(i)%fillers.length], 'zwerfwoord']
    items.push({ id: `v${pad(i)}`, type: 'verbal', prompt, choices, correctIndex: 0 })
  }
  return items
}

function genAbstract50() {
  const items = []
  // 1-25: letterreeksen
  for (let i = 1; i <= 25; i++) {
    const seq = ['AB','BC','CD','DE']
    const choices = ['EF','FG','GH']
    items.push({ id: `a${pad(i)}`, type: 'abstract', prompt: `${seq.join(', ')}, … Volgende?`, choices, correctIndex: 0 })
  }
  // 26-50: symbolen
  for (let i = 26; i <= 50; i++) {
    const k = i % 3 + 2
    const prompt = '▲'.repeat(k) + ', ' + '▲'.repeat(k+1) + ', ' + '▲'.repeat(k+2) + ', …'
    const choices = ['▲'.repeat(k+3), '▲'.repeat(k+1), '▲'.repeat(k+4)]
    items.push({ id: `a${pad(i)}`, type: 'abstract', prompt: `Reeks: ${prompt}`, choices, correctIndex: 0 })
  }
  return items
}

function genReading40() {
  const items = []
  for (let i = 1; i <= 40; i++) {
    const body = `Melding ${i}: Er is geluidsoverlast gemeld in de wijk. De politie zal extra patrouilleren en bewoners vragen geluid te beperken na 22:00.`
    items.push({ id: `rS${pad(i)}`, title: `Tekst ${i}`, body, questions: [{ prompt: 'Wat is het doel?', choices: ['Boetes uitschrijven','Overlast verminderen','Verhuizingen organiseren'], correctIndex: 1 }] })
  }
  return items
}

function genListening40() {
  const items = []
  for (let i = 1; i <= 40; i++) {
    const transcript = `Goedemiddag, routinecontrole ${i}. Mag ik uw identiteitskaart, alstublieft?`
    items.push({ id: `lS${pad(i)}`, title: `Fragment ${i}`, audioUrl: '/audio/identiteitscontrole.wav', transcript, questions: [{ prompt: 'Wat wordt gevraagd?', choices: ['Rijbewijs','Identiteitskaart','Verzekering'], correctIndex: 1 }] })
  }
  return items
}

function genGrammar40() {
  const items = []
  for (let i = 1; i <= 40; i++) {
    const sentence = `De agent ___ het rapport (${i}).`
    items.push({ id: `gS${pad(i)}`, lang: 'nl', prompt: 'Kies de juiste vorm', sentence, choices: ['schrijft','schrijven','schreef'], correctIndex: 0 })
  }
  return items
}

function main() {
  const outDir = path.resolve(__dirname, '..', 'public', 'data')
  ensureDir(outDir)
  writeJson(path.join(outDir, 'cognitive.numeric.50.sample.json'), genNumeric50())
  writeJson(path.join(outDir, 'cognitive.verbal.50.sample.json'), genVerbal50())
  writeJson(path.join(outDir, 'cognitive.abstract.50.sample.json'), genAbstract50())
  writeJson(path.join(outDir, 'reading.40.sample.json'), genReading40())
  writeJson(path.join(outDir, 'listening.40.sample.json'), genListening40())
  writeJson(path.join(outDir, 'grammar.40.sample.json'), genGrammar40())
}

if (require.main === module) main()