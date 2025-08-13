// Simple WAV generator for short sine tones
// Usage: node scripts/gen-audio.js

const fs = require('fs')
const path = require('path')

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function createSineWavPCM({ frequencyHz, durationSec = 1.2, sampleRate = 44100, amplitude = 0.2 }) {
  const numChannels = 1
  const bitsPerSample = 16
  const numSamples = Math.floor(durationSec * sampleRate)
  const blockAlign = (numChannels * bitsPerSample) / 8
  const byteRate = sampleRate * blockAlign

  const dataSize = numSamples * blockAlign
  const buffer = Buffer.alloc(44 + dataSize)

  // RIFF header
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)

  // fmt chunk
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16) // Subchunk1Size for PCM
  buffer.writeUInt16LE(1, 20) // AudioFormat PCM
  buffer.writeUInt16LE(numChannels, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(byteRate, 28)
  buffer.writeUInt16LE(blockAlign, 32)
  buffer.writeUInt16LE(bitsPerSample, 34)

  // data chunk
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)

  // PCM samples
  const maxAmp = Math.floor(32767 * amplitude)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const sample = Math.sin(2 * Math.PI * frequencyHz * t)
    const s = Math.max(-1, Math.min(1, sample))
    const intSample = Math.floor(s * maxAmp)
    buffer.writeInt16LE(intSample, 44 + i * 2)
  }

  return buffer
}

const targets = [
  ['verkeerscontrole', 440],
  ['fietsdiefstal', 523],
  ['geluidsoverlast', 587],
  ['ongeval_zonder_gewonden', 659],
  ['identiteitscontrole', 698],
  ['winkel_situatie', 784],
  ['snelheidscontrole', 880],
  ['huiselijk_conflict', 988],
  ['getuigenverklaring', 1046],
  ['openbaar_vervoer', 1174],
]

function main() {
  const outDir = path.resolve(__dirname, '..', 'public', 'audio')
  ensureDir(outDir)

  for (const [name, freq] of targets) {
    const wav = createSineWavPCM({ frequencyHz: freq })
    const filePath = path.join(outDir, `${name}.wav`)
    fs.writeFileSync(filePath, wav)
    console.log('Generated', path.basename(filePath))
  }
}

if (require.main === module) {
  main()
}