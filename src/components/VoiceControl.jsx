import React, { useState, useEffect, useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTTS } from '../contexts/TTSContext'

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { speak, readPage } = useTTS()

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      recognitionInstance.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase()
        handleVoiceCommand(command)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
    }
  }, [])

  const handleVoiceCommand = useCallback((command) => {
    console.log('Voice command:', command)
    
    if (command.includes('dashboard') || command.includes('panel')) {
      navigate('/')
      speak(t('navigation.dashboard'))
    } else if (command.includes('inspection') || command.includes('check')) {
      navigate('/inspection')
      speak(t('navigation.inspection'))
    } else if (command.includes('job') || command.includes('work')) {
      navigate('/jobs')
      speak(t('navigation.jobs'))
    } else if (command.includes('read') || command.includes('speak')) {
      readPage()
    } else {
      speak('Command not recognized. Try saying dashboard, inspection, or jobs.')
    }
  }, [navigate, speak, readPage, t])

  const toggleListening = () => {
    if (!recognition) {
      speak(t('voice.not_supported'))
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  if (!recognition) {
    return null
  }

  return (
    <Button
      className={`voice-btn ${isListening ? 'listening' : ''}`}
      onClick={toggleListening}
      title={isListening ? t('voice.listening') : 'Voice Control'}
    >
      <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'}`}></i>
    </Button>
  )
}

export default VoiceControl