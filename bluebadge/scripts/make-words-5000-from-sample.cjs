const fs = require('fs')
const path = require('path')

function main() {
  const dataDir = path.resolve(__dirname, '..', 'public', 'data')
  const srcPath = path.join(dataDir, 'words.b1b2.sample.json')
  const outPath = path.join(dataDir, 'words.b1c2.5000.sample.json')
  const base = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
  const out = []
  const count = 5000
  for (let i = 0; i < count; i++) {
    const b = base[i % base.length]
    const suffix = String(Math.floor(i / base.length) + 1).padStart(3, '0')
    out.push({ id: `${b.id}_${suffix}`, nl: b.nl, tr: b.tr, category: b.category })
  }
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n')
  console.log('Wrote', path.relative(process.cwd(), outPath))
}

if (require.main === module) main()