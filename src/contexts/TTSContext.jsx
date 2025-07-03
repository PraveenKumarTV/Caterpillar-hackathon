import React, { createContext, useContext, useState, useCallback } from 'react'

const TTSContext = createContext()

export const useTTS = () => {
  const context = useContext(TTSContext)
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider')
  }
  return context
}

export const TTSProvider = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState('speechSynthesis' in window)

  const speak = useCallback((text, options = {}) => {
    if (!isSupported || !text) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Configure voice settings for outdoor/noisy environments
    utterance.rate = options.rate || 0.8 // Slower for clarity
    utterance.pitch = options.pitch || 1.0
    utterance.volume = options.volume || 1.0
    
    // Try to use a clear, strong voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(options.lang || 'en') && 
      (voice.name.includes('Enhanced') || voice.name.includes('Premium'))
    ) || voices.find(voice => voice.lang.startsWith(options.lang || 'en'))
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  const readPage = useCallback((selector = 'main') => {
    const element = document.querySelector(selector) || document.body
    const text = element.innerText || element.textContent
    
    // Clean up text for better speech
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?-]/g, '')
      .trim()
    
    speak(cleanText)
  }, [speak])

  const value = {
    speak,
    stop,
    readPage,
    isSpeaking,
    isSupported
  }

  return (
    <TTSContext.Provider value={value}>
      {children}
    </TTSContext.Provider>
  )
}