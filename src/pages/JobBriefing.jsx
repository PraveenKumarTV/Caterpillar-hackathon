import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useTTS } from '../contexts/TTSContext'
import { useOffline } from '../contexts/OfflineContext'
import MapNavigator from '../components/MapNavigator'

const JobBriefing = () => {
  const { t } = useTranslation()
  const { speak } = useTTS()
  const { saveOfflineData } = useOffline()
  
  const [selectedJob, setSelectedJob] = useState(null)
  const [showMapModal, setShowMapModal] = useState(false)

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Excavation Site A - Load Transport',
      location: 'North Quarry Section 3',
      destination: 'Processing Plant B',
      status: 'pending',
      priority: 'high',
      eta: '08:30 AM',
      loadType: 'Limestone',
      estimatedWeight: '25 tons',
      description: 'Transport limestone from excavation site to processing plant',
      coordinates: { lat: 9.9210, lng: 78.0967 }
    },
    {
      id: 2,
      title: 'Equipment Maintenance Area',
      location: 'Service Bay 2',
      destination: 'Field Station C',
      status: 'in_progress',
      priority: 'medium',
      eta: '10:15 AM',
      loadType: 'Maintenance Equipment',
      estimatedWeight: '8 tons',
      description: 'Transport maintenance equipment to field station',
      coordinates: { lat: 9.9215, lng: 78.0970 }
    },
    {
      id: 3,
      title: 'Aggregate Delivery',
      location: 'Storage Yard D',
      destination: 'Construction Site E',
      status: 'completed',
      priority: 'low',
      eta: '02:00 PM',
      loadType: 'Gravel Mix',
      estimatedWeight: '30 tons',
      description: 'Deliver gravel mix to construction site',
      coordinates: { lat: 9.9205, lng: 78.0965 }
    },
    {
      id: 4,
      title: 'Waste Material Removal',
      location: 'Demolition Site F',
      destination: 'Disposal Facility',
      status: 'pending',
      priority: 'high',
      eta: '03:30 PM',
      loadType: 'Concrete Debris',
      estimatedWeight: '22 tons',
      description: 'Remove concrete debris from demolition site',
      coordinates: { lat: 9.9200, lng: 78.0975 }
    },
    {
      id: 5,
      title: 'Sand Transport',
      location: 'Riverside Quarry',
      destination: 'Concrete Plant',
      status: 'pending',
      priority: 'medium',
      eta: '04:00 PM',
      loadType: 'Fine Sand',
      estimatedWeight: '18 tons',
      description: 'Transport fine sand for concrete production',
      coordinates: { lat: 9.9220, lng: 78.0960 }
    },
    {
      id: 6,
      title: 'Rock Crushing Site',
      location: 'Mountain Quarry A',
      destination: 'Storage Facility B',
      status: 'pending',
      priority: 'low',
      eta: '05:30 PM',
      loadType: 'Crushed Rock',
      estimatedWeight: '35 tons',
      description: 'Move crushed rock to storage facility',
      coordinates: { lat: 9.9225, lng: 78.0955 }
    }
  ])

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning'
      case 'pending': return 'secondary'
      default: return 'secondary'
    }
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'secondary'
    }
  }

  const handleJobAction = async (jobId, action) => {
    const job = jobs.find(j => j.id === jobId)
    
    if (action === 'start') {
      setJobs(prev => prev.map(j => 
        j.id === jobId ? { ...j, status: 'in_progress' } : j
      ))
      speak(`Started job: ${job.title}`)
    } else if (action === 'complete') {
      setJobs(prev => prev.map(j => 
        j.id === jobId ? { ...j, status: 'completed' } : j
      ))
      speak(`Completed job: ${job.title}`)
    }

    // Save job update offline
    await saveOfflineData('jobUpdates', {
      jobId,
      action,
      timestamp: new Date().toISOString()
    })
  }

  const handleJobClick = (job) => {
    setSelectedJob(job)
    speak(`Job details: ${job.title}. Location: ${job.location}. Destination: ${job.destination}. Load type: ${job.loadType}. Priority: ${job.priority}`)
  }

  const showMap = (job) => {
    setSelectedJob(job)
    setShowMapModal(true)
    speak(`Starting navigation to ${job.title}`)
  }

  const readJobSummary = () => {
    const pendingJobs = jobs.filter(job => job.status === 'pending').length
    const inProgressJobs = jobs.filter(job => job.status === 'in_progress').length
    const completedJobs = jobs.filter(job => job.status === 'completed').length
    
    const summary = `
      Job briefing summary: 
      ${pendingJobs} pending jobs, 
      ${inProgressJobs} jobs in progress, 
      ${completedJobs} completed jobs.
      Next priority job: ${jobs.find(job => job.status === 'pending' && job.priority === 'high')?.title || 'None'}
    `
    speak(summary)
  }

  useEffect(() => {
    speak(t('jobs.title'))
  }, [])

  return (
    <main>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-warning mb-1">{t('jobs.title')}</h1>
          <p className="text-muted mb-0">{t('jobs.subtitle')}</p>
        </div>
        <Button variant="outline-warning" onClick={readJobSummary}>
          <i className="bi bi-volume-up me-2"></i>
          Read Summary
        </Button>
      </div>

      {/* Job Statistics */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-warning">{jobs.filter(j => j.status === 'pending').length}</h2>
              <p className="mb-0">{t('jobs.status.pending')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-info">{jobs.filter(j => j.status === 'in_progress').length}</h2>
              <p className="mb-0">{t('jobs.status.in_progress')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-success">{jobs.filter(j => j.status === 'completed').length}</h2>
              <p className="mb-0">{t('jobs.status.completed')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-danger">{jobs.filter(j => j.priority === 'high').length}</h2>
              <p className="mb-0">High Priority</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Job List */}
      <Row>
        {jobs.map((job) => (
          <Col lg={6} key={job.id} className="mb-4">
            <Card 
              className="h-100"
              style={{ 
                cursor: 'pointer',
                border: job.priority === 'high' ? '3px solid var(--cat-red)' : undefined
              }}
              onClick={() => handleJobClick(job)}
            >
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Badge bg={getStatusVariant(job.status)} className="me-2">
                    {t(`jobs.status.${job.status}`)}
                  </Badge>
                  <Badge bg={getPriorityVariant(job.priority)}>
                    {job.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {job.eta}
                </div>
              </Card.Header>
              
              <Card.Body>
                <h5 className="card-title mb-3">{job.title}</h5>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-geo-alt text-warning me-2"></i>
                    <strong>{t('jobs.details.location')}:</strong>
                    <span className="ms-2">{job.location}</span>
                  </div>
                  
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-arrow-right text-info me-2"></i>
                    <strong>{t('jobs.details.destination')}:</strong>
                    <span className="ms-2">{job.destination}</span>
                  </div>
                  
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-box-seam text-success me-2"></i>
                    <strong>{t('jobs.details.load_type')}:</strong>
                    <span className="ms-2">{job.loadType}</span>
                  </div>
                  
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-speedometer text-secondary me-2"></i>
                    <strong>Weight:</strong>
                    <span className="ms-2">{job.estimatedWeight}</span>
                  </div>

                  <div className="d-flex align-items-center">
                    <i className="bi bi-geo text-primary me-2"></i>
                    <strong>Coordinates:</strong>
                    <span className="ms-2 small">{job.coordinates.lat.toFixed(4)}, {job.coordinates.lng.toFixed(4)}</span>
                  </div>
                </div>
                
                <p className="text-muted small">{job.description}</p>
              </Card.Body>
              
              <Card.Footer>
                <div className="d-flex flex-wrap gap-2">
                  {job.status === 'pending' && (
                    <Button
                      variant="success"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleJobAction(job.id, 'start')
                      }}
                    >
                      <i className="bi bi-play-fill me-2"></i>
                      {t('jobs.actions.start_job')}
                    </Button>
                  )}
                  
                  {job.status === 'in_progress' && (
                    <Button
                      variant="warning"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleJobAction(job.id, 'complete')
                      }}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      {t('jobs.actions.complete_job')}
                    </Button>
                  )}
                  
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      showMap(job)
                    }}
                  >
                    <i className="bi bi-navigation me-2"></i>
                    Start Navigation
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Map Navigation Modal */}
      {selectedJob && (
        <MapNavigator
          show={showMapModal}
          onHide={() => setShowMapModal(false)}
          destination={selectedJob.coordinates}
          jobTitle={selectedJob.title}
        />
      )}
    </main>
  )
}

export default JobBriefing