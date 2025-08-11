export function speak(text: string, lang: 'nl-NL' | 'tr-TR') {
  try {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.rate = 1
    utter.pitch = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  } catch (_e) {
    // Niet kritisch; negeren als TTS niet beschikbaar is
  }
}