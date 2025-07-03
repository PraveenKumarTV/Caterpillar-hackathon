import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../contexts/TTSContext';

const CommunicationCenter = () => {
  const { t } = useTranslation();
  const { speak } = useTTS();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState(null); // 'ptt' or 'incident'
  const [incidentForm, setIncidentForm] = useState({
    type: 'safety',
    description: '',
    location: '',
    severity: 'medium',
    photos: [],
    voiceNotes: []
  });
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'received',
      sender: 'Dispatch',
      message: 'Weather alert: Heavy rain expected in Zone B',
      timestamp: new Date(Date.now() - 300000),
      translated: false
    },
    {
      id: 2,
      type: 'sent',
      message: 'Acknowledged. Currently in Zone A.',
      timestamp: new Date(Date.now() - 240000)
    }
  ]);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const recordingRef = useRef(null);

  const handleReadAloud = () => {
    const content = `${t('communication.title')}. ${t('communication.subtitle')}. 
      ${t('communication.pushToTalk.title')}. ${t('communication.incident.title')}.`;
    speak(content);
  };

  const startRecording = (type) => {
    setIsRecording(true);
    setRecordingType(type);
    // Simulate recording start
    if (type === 'ptt') {
      speak(t('communication.pushToTalk.recording'));
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    
    setIsRecording(false);
    
    if (recordingType === 'ptt') {
      // Simulate sending PTT message
      speak(t('communication.pushToTalk.sending'));
      setTimeout(() => {
        const newMessage = {
          id: messages.length + 1,
          type: 'sent',
          message: 'Voice message sent via Push-to-Talk',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        speak(t('communication.pushToTalk.sent'));
      }, 1500);
    } else if (recordingType === 'incident') {
      // Add voice note to incident
      const voiceNote = {
        id: Date.now(),
        duration: '0:15',
        timestamp: new Date()
      };
      setIncidentForm(prev => ({
        ...prev,
        voiceNotes: [...prev.voiceNotes, voiceNote]
      }));
    }
    
    setRecordingType(null);
  };

  const handleIncidentSubmit = (e) => {
    e.preventDefault();
    speak('Incident report submitted successfully');
    // Reset form
    setIncidentForm({
      type: 'safety',
      description: '',
      location: '',
      severity: 'medium',
      photos: [],
      voiceNotes: []
    });
  };

  const simulateTranscription = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setTranscription('Machine making unusual noise in hydraulic system');
      setIsTranscribing(false);
      simulateTranslation();
    }, 2000);
  };

  const simulateTranslation = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setTranslation('Máquina haciendo ruido inusual en sistema hidráulico');
      setIsTranslating(false);
    }, 1500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold text-warning mb-2">
                <i className="bi bi-chat-dots me-3"></i>
                {t('communication.title')}
              </h1>
              <p className="lead text-muted">{t('communication.subtitle')}</p>
            </div>
            <Button 
              variant="outline-warning" 
              size="lg"
              onClick={handleReadAloud}
              className="read-aloud-btn"
            >
              <i className="bi bi-volume-up me-2"></i>
              {t('common.readAloud')}
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Push-to-Talk Section */}
        <Col lg={6}>
          <Card className="h-100 border-warning">
            <Card.Header className="bg-warning text-dark">
              <h4 className="mb-0">
                <i className="bi bi-mic me-2"></i>
                {t('communication.pushToTalk.title')}
              </h4>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="mb-4">
                <Button
                  variant={isRecording && recordingType === 'ptt' ? 'danger' : 'warning'}
                  size="lg"
                  className="ptt-button"
                  onMouseDown={() => startRecording('ptt')}
                  onMouseUp={stopRecording}
                  onTouchStart={() => startRecording('ptt')}
                  onTouchEnd={stopRecording}
                  style={{ 
                    width: '200px', 
                    height: '200px', 
                    borderRadius: '50%',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  <i className={`bi ${isRecording && recordingType === 'ptt' ? 'bi-mic-fill' : 'bi-mic'} d-block mb-2`} style={{ fontSize: '3rem' }}></i>
                  {isRecording && recordingType === 'ptt' 
                    ? t('communication.pushToTalk.recording')
                    : t('communication.pushToTalk.hold')
                  }
                </Button>
              </div>
              <p className="text-muted">
                {t('communication.pushToTalk.release')}
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Messages */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <h4 className="mb-0">
                <i className="bi bi-chat-text me-2"></i>
                {t('communication.messages.title')}
              </h4>
            </Card.Header>
            <Card.Body>
              {messages.length === 0 ? (
                <p className="text-muted text-center">{t('communication.messages.noMessages')}</p>
              ) : (
                <ListGroup variant="flush">
                  {messages.slice(-5).map(message => (
                    <ListGroup.Item key={message.id} className="px-0">
                      <div className={`d-flex ${message.type === 'sent' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`message-bubble ${message.type === 'sent' ? 'sent' : 'received'}`}>
                          {message.sender && (
                            <small className="fw-bold d-block">{message.sender}</small>
                          )}
                          <p className="mb-1">{message.message}</p>
                          <small className="text-muted">{formatTime(message.timestamp)}</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Auto Translation */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">
                <i className="bi bi-translate me-2"></i>
                {t('communication.translation.title')}
              </h4>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="outline-primary" 
                onClick={simulateTranscription}
                disabled={isTranscribing || isTranslating}
                className="mb-3"
              >
                <i className="bi bi-mic me-2"></i>
                Start Voice Recognition
              </Button>
              
              {(isTranscribing || transcription) && (
                <div className="mb-3">
                  <label className="form-label fw-bold">{t('communication.translation.original')}</label>
                  <div className="p-3 bg-light rounded">
                    {isTranscribing ? (
                      <div className="text-center">
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        {t('communication.translation.transcribing')}
                      </div>
                    ) : (
                      transcription
                    )}
                  </div>
                </div>
              )}

              {(isTranslating || translation) && (
                <div>
                  <label className="form-label fw-bold">{t('communication.translation.translated')}</label>
                  <div className="p-3 bg-warning bg-opacity-10 rounded">
                    {isTranslating ? (
                      <div className="text-center">
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        {t('communication.translation.translating')}
                      </div>
                    ) : (
                      translation
                    )}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Incident Reporting */}
        <Col lg={6}>
          <Card>
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {t('communication.incident.title')}
              </h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleIncidentSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('communication.incident.type')}</Form.Label>
                      <Form.Select
                        value={incidentForm.type}
                        onChange={(e) => setIncidentForm(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="safety">{t('communication.incident.types.safety')}</option>
                        <option value="mechanical">{t('communication.incident.types.mechanical')}</option>
                        <option value="environmental">{t('communication.incident.types.environmental')}</option>
                        <option value="operational">{t('communication.incident.types.operational')}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('communication.incident.severity')}</Form.Label>
                      <Form.Select
                        value={incidentForm.severity}
                        onChange={(e) => setIncidentForm(prev => ({ ...prev, severity: e.target.value }))}
                      >
                        <option value="low">{t('communication.incident.severities.low')}</option>
                        <option value="medium">{t('communication.incident.severities.medium')}</option>
                        <option value="high">{t('communication.incident.severities.high')}</option>
                        <option value="critical">{t('communication.incident.severities.critical')}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>{t('communication.incident.description')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={incidentForm.description}
                    onChange={(e) => setIncidentForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the incident..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('communication.incident.location')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={incidentForm.location}
                    onChange={(e) => setIncidentForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Current location or zone"
                  />
                </Form.Group>

                <div className="d-flex gap-2 mb-3">
                  <Button variant="outline-secondary" size="sm">
                    <i className="bi bi-camera me-1"></i>
                    {t('communication.incident.addPhoto')}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onMouseDown={() => startRecording('incident')}
                    onMouseUp={stopRecording}
                    className={isRecording && recordingType === 'incident' ? 'btn-danger' : ''}
                  >
                    <i className={`bi ${isRecording && recordingType === 'incident' ? 'bi-mic-fill' : 'bi-mic'} me-1`}></i>
                    {t('communication.incident.addVoice')}
                  </Button>
                </div>

                {incidentForm.voiceNotes.length > 0 && (
                  <div className="mb-3">
                    <small className="text-muted">Voice Notes:</small>
                    {incidentForm.voiceNotes.map(note => (
                      <Badge key={note.id} bg="secondary" className="me-1">
                        <i className="bi bi-mic-fill me-1"></i>
                        {note.duration}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button type="submit" variant="danger" size="lg" className="w-100">
                  <i className="bi bi-send me-2"></i>
                  {t('communication.incident.submit')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .message-bubble {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          margin-bottom: 0.5rem;
        }
        .message-bubble.sent {
          background-color: #ffc107;
          color: #000;
          margin-left: auto;
        }
        .message-bubble.received {
          background-color: #f8f9fa;
          color: #000;
        }
        .ptt-button:active {
          transform: scale(0.95);
        }
        .read-aloud-btn {
          min-width: 150px;
        }
      `}</style>
    </Container>
  );
};

export default CommunicationCenter;