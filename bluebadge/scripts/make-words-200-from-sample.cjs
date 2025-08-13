const fs = require('fs')
const path = require('path')

function main() {
  const dataDir = path.resolve(__dirname, '..', 'public', 'data')
  const srcPath = path.join(dataDir, 'words.b1b2.sample.json')
  const outPath = path.join(dataDir, 'words.b1b2.200.sample.json')
  const base = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
  const out = []
  for (let i = 0; i < 200; i++) {
    const b = base[i % base.length]
    out.push({ id: `${b.id}_${Math.floor(i / base.length) + 1}`.replace(/__$/, '_1'), nl: b.nl, tr: b.tr, category: b.category })
  }
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n')
  console.log('Wrote', path.relative(process.cwd(), outPath))
}

if (require.main === module) main()