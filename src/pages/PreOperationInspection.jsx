import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Form, Alert, ProgressBar, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useTTS } from '../contexts/TTSContext'
import { useOffline } from '../contexts/OfflineContext'

const PreOperationInspection = () => {
  const { t } = useTranslation()
  const { speak } = useTTS()
  const { saveOfflineData } = useOffline()
  
  const [currentSection, setCurrentSection] = useState(0)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [currentNote, setCurrentNote] = useState('')
  const [voiceGuideActive, setVoiceGuideActive] = useState(false)

  const sections = [
    {
      id: 'tires',
      title: t('inspection.sections.tires'),
      icon: 'bi-circle',
      checks: [
        { id: 'tire_pressure', text: t('inspection.checks.tire_pressure') },
        { id: 'tire_damage', text: t('inspection.checks.tire_damage') }
      ]
    },
    {
      id: 'hydraulics',
      title: t('inspection.sections.hydraulics'),
      icon: 'bi-droplet-fill',
      checks: [
        { id: 'hydraulic_fluid', text: t('inspection.checks.hydraulic_fluid') },
        { id: 'hydraulic_leaks', text: t('inspection.checks.hydraulic_leaks') }
      ]
    },
    {
      id: 'engine',
      title: t('inspection.sections.engine'),
      icon: 'bi-gear-fill',
      checks: [
        { id: 'oil_level', text: t('inspection.checks.oil_level') },
        { id: 'coolant_level', text: t('inspection.checks.coolant_level') }
      ]
    },
    {
      id: 'fuel',
      title: t('inspection.sections.fuel'),
      icon: 'bi-fuel-pump',
      checks: [
        { id: 'fuel_level', text: t('inspection.checks.fuel_level') },
        { id: 'fuel_leaks', text: t('inspection.checks.fuel_leaks') }
      ]
    },
    {
      id: 'electrical',
      title: t('inspection.sections.electrical'),
      icon: 'bi-lightning-fill',
      checks: [
        { id: 'battery', text: t('inspection.checks.battery') },
        { id: 'lights', text: t('inspection.checks.lights') }
      ]
    }
  ]

  const [inspectionData, setInspectionData] = useState(() => {
    const initialData = {}
    sections.forEach(section => {
      section.checks.forEach(check => {
        initialData[check.id] = {
          status: 'not_started',
          note: '',
          timestamp: null
        }
      })
    })
    return initialData
  })

  const currentSectionData = sections[currentSection]
  const totalChecks = sections.reduce((total, section) => total + section.checks.length, 0)
  const completedChecks = Object.values(inspectionData).filter(
    item => item.status === 'completed' || item.status === 'failed'
  ).length
  const progress = (completedChecks / totalChecks) * 100

  const handleCheckResult = (checkId, status) => {
    setInspectionData(prev => ({
      ...prev,
      [checkId]: {
        ...prev[checkId],
        status,
        timestamp: new Date().toISOString()
      }
    }))

    // Save offline
    saveOfflineData('inspection_current', {
      ...inspectionData,
      [checkId]: {
        ...inspectionData[checkId],
        status,
        timestamp: new Date().toISOString()
      }
    })

    // Voice feedback
    const statusText = status === 'completed' ? 'passed' : 'failed'
    speak(`Check ${statusText}`)
  }

  const handleAddNote = (checkId) => {
    setCurrentNote(inspectionData[checkId]?.note || '')
    setShowNoteModal(checkId)
  }

  const saveNote = () => {
    if (showNoteModal) {
      setInspectionData(prev => ({
        ...prev,
        [showNoteModal]: {
          ...prev[showNoteModal],
          note: currentNote
        }
      }))
    }
    setShowNoteModal(false)
    setCurrentNote('')
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
      speak(sections[currentSection + 1].title)
    }
  }

  const previousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      speak(sections[currentSection - 1].title)
    }
  }

  const startVoiceGuide = () => {
    setVoiceGuideActive(true)
    speak(`Starting voice guided inspection. Section: ${currentSectionData.title}`)
    
    // Guide through each check
    currentSectionData.checks.forEach((check, index) => {
      setTimeout(() => {
        speak(check.text)
      }, (index + 1) * 3000)
    })
  }

  const completeInspection = async () => {
    const completionData = {
      timestamp: new Date().toISOString(),
      sections: inspectionData,
      overallStatus: Object.values(inspectionData).some(item => item.status === 'failed') ? 'failed' : 'passed'
    }
    
    await saveOfflineData('inspection_completed', completionData)
    speak('Inspection completed and saved')
  }

  useEffect(() => {
    speak(`${t('inspection.title')}. Section ${currentSection + 1} of ${sections.length}: ${currentSectionData.title}`)
  }, [currentSection])

  return (
    <main>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-warning mb-1">{t('inspection.title')}</h1>
          <p className="text-muted mb-0">{t('inspection.subtitle')}</p>
        </div>
        <Button variant="outline-warning" onClick={startVoiceGuide}>
          <i className="bi bi-volume-up me-2"></i>
          {t('inspection.actions.start_voice_guide')}
        </Button>
      </div>

      {/* Progress Bar */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Progress: {completedChecks}/{totalChecks} checks</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar 
            now={progress} 
            variant={progress === 100 ? 'success' : 'warning'}
            style={{ height: '12px' }}
          />
        </Card.Body>
      </Card>

      {/* Section Navigation */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            {sections.map((section, index) => (
              <Button
                key={section.id}
                variant={index === currentSection ? 'warning' : 'outline-secondary'}
                size="sm"
                onClick={() => {
                  setCurrentSection(index)
                  speak(section.title)
                }}
                className="d-flex align-items-center"
              >
                <i className={`${section.icon} me-1`}></i>
                {section.title}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Current Section */}
      <Card className="mb-4">
        <Card.Header className="d-flex align-items-center">
          <i className={`${currentSectionData.icon} me-2`}></i>
          <h3 className="mb-0">{currentSectionData.title}</h3>
        </Card.Header>
        <Card.Body>
          {currentSectionData.checks.map((check) => {
            const checkData = inspectionData[check.id]
            const isCompleted = checkData.status === 'completed'
            const isFailed = checkData.status === 'failed'
            
            return (
              <div 
                key={check.id} 
                className={`checklist-item ${isCompleted ? 'completed' : ''} ${isFailed ? 'failed' : ''}`}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <h5 className="mb-2">{check.text}</h5>
                    {checkData.note && (
                      <div className="text-muted small">
                        <i className="bi bi-sticky me-1"></i>
                        {checkData.note}
                      </div>
                    )}
                  </div>
                  <div className="d-flex align-items-center">
                    <span className={`status-indicator status-${
                      isCompleted ? 'ok' : isFailed ? 'danger' : 'pending'
                    }`}></span>
                    <span className="ms-2 small text-muted">
                      {t(`inspection.status.${checkData.status}`)}
                    </span>
                  </div>
                </div>
                
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={() => handleCheckResult(check.id, 'completed')}
                    disabled={isCompleted}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    {t('inspection.actions.pass')}
                  </Button>
                  
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => handleCheckResult(check.id, 'failed')}
                    disabled={isFailed}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    {t('inspection.actions.fail')}
                  </Button>
                  
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => handleAddNote(check.id)}
                  >
                    <i className="bi bi-sticky me-2"></i>
                    {t('inspection.actions.add_note')}
                  </Button>
                  
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => speak('Camera feature not implemented')}
                  >
                    <i className="bi bi-camera me-2"></i>
                    {t('inspection.actions.take_photo')}
                  </Button>
                  
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => speak(check.text)}
                  >
                    <i className="bi bi-mic me-2"></i>
                    {t('inspection.actions.voice_memo')}
                  </Button>
                </div>
              </div>
            )
          })}
        </Card.Body>
      </Card>

      {/* Navigation Buttons */}
      <Row>
        <Col className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            size="lg"
            onClick={previousSection}
            disabled={currentSection === 0}
          >
            <i className="bi bi-arrow-left me-2"></i>
            {t('common.previous')}
          </Button>
          
          {currentSection === sections.length - 1 ? (
            <Button
              variant="success"
              size="lg"
              onClick={completeInspection}
              disabled={progress < 100}
            >
              <i className="bi bi-check-circle me-2"></i>
              {t('inspection.actions.complete')}
            </Button>
          ) : (
            <Button
              variant="warning"
              size="lg"
              onClick={nextSection}
            >
              {t('inspection.actions.next_section')}
              <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          )}
        </Col>
      </Row>

      {/* Note Modal */}
      <Modal show={!!showNoteModal} onHide={() => setShowNoteModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Add your inspection notes here..."
              style={{ fontSize: '18px' }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNoteModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={saveNote}>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  )
}

export default PreOperationInspection