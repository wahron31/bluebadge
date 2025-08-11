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
    // Woorden: als minder dan 200 items aanwezig
    if (getWords().length < 200) {
      const words = await fetchJson('/data/words.b1b2.1000.sample.json')
      setWords(words as any)
    }
    // Cognitief: als leeg, laad alle drie
    if (getCognitive().length < 50) {
      const num = await fetchJson<CognitiveItem[]>('/data/cognitive.numeric.50.real.json')
      const verb = await fetchJson<CognitiveItem[]>('/data/cognitive.verbal.50.real.json')
      const abs = await fetchJson<CognitiveItem[]>('/data/cognitive.abstract.50.real.json')
      setCognitive([...num, ...verb, ...abs])
    }
    // Lezen 50 als minder dan 20
    if (getReading().length < 20) {
      const r = await fetchJson('/data/reading.50.sample.json')
      setReading(r as any)
    }
    // Luisteren 50 als minder dan 10
    if (getListening().length < 10) {
      const l = await fetchJson('/data/listening.50.sample.json')
      setListening(l as any)
    }
    // Grammatica 50 als minder dan 10
    if (getGrammar().length < 10) {
      const g = await fetchJson('/data/grammar.50.sample.json')
      setGrammar(g as any)
    }
    localStorage.setItem(FLAG, '1')
  } catch (_e) {
    // negeren bij offline; user kan handmatig importeren via Admin Import
  }
}