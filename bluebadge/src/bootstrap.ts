import { getWords, setWords, getCognitive, setCognitive, getReading, setReading, getListening, setListening, getGrammar, setGrammar, type CognitiveItem } from './data/overrides'

const FLAG = 'bluebadge-bootstrap-v1'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  return res.json() as Promise<T>
}

export async function bootstrapSamples(): Promise<void> {
  if (localStorage.getItem(FLAG)) return
  try {
    // Woorden: laad grote set indien minder dan 5000
    if (getWords().length < 5000) {
      const words = await fetchJson('/data/words.b1c2.5000.sample.json')
      setWords(words as any)
    }
    // Cognitief: als leeg of klein, laad grote sets
    if (getCognitive().length < 150) {
      const num = await fetchJson<CognitiveItem[]>('/data/cognitive.numeric.200.large.json')
      const verb = await fetchJson<CognitiveItem[]>('/data/cognitive.verbal.200.large.json')
      const abs = await fetchJson<CognitiveItem[]>('/data/cognitive.abstract.200.large.json')
      setCognitive([...num, ...verb, ...abs])
    }
    // Lezen: laad 500 als minder dan 100
    if (getReading().length < 100) {
      const r = await fetchJson('/data/reading.500.large.json')
      setReading(r as any)
    }
    // Luisteren: laad 500 als minder dan 100
    if (getListening().length < 100) {
      const l = await fetchJson('/data/listening.500.large.json')
      setListening(l as any)
    }
    // Grammatica: laad 500 als minder dan 100
    if (getGrammar().length < 100) {
      const g = await fetchJson('/data/grammar.500.large.json')
      setGrammar(g as any)
    }
    localStorage.setItem(FLAG, '1')
  } catch (_e) {
    // negeren bij offline; user kan handmatig importeren via Admin Import
  }
}