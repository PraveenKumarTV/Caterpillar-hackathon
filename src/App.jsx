import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import PreOperationInspection from './pages/PreOperationInspection'
import JobBriefing from './pages/JobBriefing'
import VoiceControl from './components/VoiceControl'
import LanguageSelector from './components/LanguageSelector'
import OfflineIndicator from './components/OfflineIndicator'
import { useTranslation } from 'react-i18next'
import { TTSProvider } from './contexts/TTSContext'
import { OfflineProvider } from './contexts/OfflineContext'

function App() {
  const { i18n } = useTranslation()

  return (
    <OfflineProvider>
      <TTSProvider>
        <div className="App">
          <OfflineIndicator />
          <LanguageSelector />
          <Navigation />
          
          <Container fluid className="py-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inspection" element={<PreOperationInspection />} />
              <Route path="/jobs" element={<JobBriefing />} />
            </Routes>
          </Container>
          
          <VoiceControl />
        </div>
      </TTSProvider>
    </OfflineProvider>
  )
}

export default App