export type WordItem = {
  id: string
  nl: string
  tr: string
  category: 'dagelijks' | 'politie' | 'verkeer'
}

export const WORDS: WordItem[] = [
  { id: 'w1', nl: 'aanhouden', tr: 'gözaltına almak', category: 'politie' },
  { id: 'w2', nl: 'identiteitskaart', tr: 'kimlik kartı', category: 'politie' },
  { id: 'w3', nl: 'boete', tr: 'ceza', category: 'verkeer' },
  { id: 'w4', nl: 'kruispunt', tr: 'kavşak', category: 'verkeer' },
  { id: 'w5', nl: 'afspraak', tr: 'randevu', category: 'dagelijks' },
  { id: 'w6', nl: 'bewijs', tr: 'delil', category: 'politie' },
  { id: 'w7', nl: 'getuige', tr: 'tanık', category: 'politie' },
  { id: 'w8', nl: 'overtreding', tr: 'ihlal', category: 'verkeer' },
  { id: 'w9', nl: 'controle', tr: 'kontrol', category: 'politie' },
  { id: 'w10', nl: 'navigatie', tr: 'navigasyon', category: 'dagelijks' },
  { id: 'w11', nl: 'proces-verbaal', tr: 'tutanak', category: 'politie' },
  { id: 'w12', nl: 'verhoor', tr: 'ifade', category: 'politie' },
  { id: 'w13', nl: 'sirene', tr: 'sireni', category: 'politie' },
  { id: 'w14', nl: 'rotonde', tr: 'dönel kavşak', category: 'verkeer' },
  { id: 'w15', nl: 'verzekering', tr: 'sigorta', category: 'verkeer' },
  { id: 'w16', nl: 'afspraak', tr: 'randevu', category: 'dagelijks' },
  { id: 'w17', nl: 'getrouwheid', tr: 'sadakat', category: 'dagelijks' },
  { id: 'w18', nl: 'hygiëne', tr: 'hijyen', category: 'dagelijks' },
]