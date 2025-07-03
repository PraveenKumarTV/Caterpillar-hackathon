import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Alert, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useTTS } from '../contexts/TTSContext'
import MetricCard from '../components/MetricCard'

const Dashboard = () => {
  const { t } = useTranslation()
  const { speak, readPage } = useTTS()
  
  // Mock real-time data
  const [metrics, setMetrics] = useState({
    fuel: { value: 75, status: 'ok' },
    engineTemp: { value: 85, status: 'ok' },
    hydraulicPressure: { value: 2800, status: 'warning' },
    loadWeight: { value: 12.5, status: 'ok' },
    tiltAngle: { value: 15, status: 'ok' },
    operatingHours: { value: 1247, status: 'ok' }
  })

  const [alerts] = useState([
    {
      id: 1,
      type: 'danger',
      message: t('dashboard.alerts.engine_overheat'),
      icon: 'bi-thermometer-high'
    },
    {
      id: 2,
      type: 'warning',
      message: t('dashboard.alerts.hydraulic_low'),
      icon: 'bi-droplet'
    },
    {
      id: 3,
      type: 'warning',
      message: t('dashboard.alerts.maintenance_due'),
      icon: 'bi-wrench'
    }
  ])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        fuel: { 
          ...prev.fuel, 
          value: Math.max(0, prev.fuel.value - Math.random() * 0.5),
          status: prev.fuel.value < 20 ? 'danger' : prev.fuel.value < 40 ? 'warning' : 'ok'
        },
        engineTemp: { 
          ...prev.engineTemp, 
          value: 80 + Math.random() * 20,
          status: prev.engineTemp.value > 95 ? 'danger' : prev.engineTemp.value > 90 ? 'warning' : 'ok'
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleReadAloud = () => {
    const summary = `
      ${t('dashboard.title')}. 
      Current status: 
      Fuel level ${Math.round(metrics.fuel.value)} percent. 
      Engine temperature ${Math.round(metrics.engineTemp.value)} degrees celsius. 
      Hydraulic pressure ${metrics.hydraulicPressure.value} PSI. 
      Load weight ${metrics.loadWeight.value} tons.
      ${alerts.length} active alerts.
    `
    speak(summary)
  }

  return (
    <main>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-warning mb-1">{t('dashboard.title')}</h1>
          <p className="text-muted mb-0">{t('dashboard.subtitle')}</p>
        </div>
        <Button variant="outline-warning" onClick={handleReadAloud}>
          <i className="bi bi-volume-up me-2"></i>
          Read Aloud
        </Button>
      </div>

      {/* Real-time Metrics */}
      <Row className="mb-4">
        <Col md={4} sm={6} className="mb-3">
          <MetricCard
            title={t('dashboard.metrics.fuel')}
            value={Math.round(metrics.fuel.value)}
            unit={t('dashboard.units.percent')}
            icon="bi-fuel-pump"
            status={metrics.fuel.status}
          />
        </Col>
        
        <Col md={4} sm={6} className="mb-3">
          <MetricCard
            title={t('dashboard.metrics.engine_temp')}
            value={Math.round(metrics.engineTemp.value)}
            unit={t('dashboard.units.celsius')}
            icon="bi-thermometer-half"
            status={metrics.engineTemp.status}
          />
        </Col>
        
        <Col md={4} sm={6} className="mb-3">
          <MetricCard
            title={t('dashboard.metrics.hydraulic_pressure')}
            value={metrics.hydraulicPressure.value}
            unit={t('dashboard.units.psi')}
            icon="bi-droplet-fill"
            status={metrics.hydraulicPressure.status}
          />
        </Col>
        
        <Col md={4} sm={6} className="mb-3">
          <MetricCard
            title={t('dashboard.metrics.load_weight')}
            value={metrics.loadWeight.value}
            unit={t('dashboard.units.tons')}
            icon="bi-box-seam"
            status={metrics.loadWeight.status}
          />
        </Col>
        
        <Col md={4} sm={6} className="mb-3">
          <MetricCard
            title={t('dashboard.metrics.tilt_angle')}
            value={metrics.tiltAngle.value}
            unit={t('dashboard.units.degrees')}
            icon="bi-compass"
            status={metrics.tiltAngle.status}
          />
        </Col>
        
        <Col md={4} sm={6} className="mb-3">
          <MetricCard
            title={t('dashboard.metrics.operating_hours')}
            value={metrics.operatingHours.value}
            unit={t('dashboard.units.hours')}
            icon="bi-clock"
            status={metrics.operatingHours.status}
          />
        </Col>
      </Row>

      {/* Safety Alerts */}
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {t('dashboard.alerts.title')}
            </Card.Header>
            <Card.Body>
              {alerts.map(alert => (
                <Alert 
                  key={alert.id} 
                  variant={alert.type}
                  className="d-flex align-items-center"
                  onClick={() => speak(alert.message)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className={`${alert.icon} me-3`} style={{ fontSize: '24px' }}></i>
                  <div>{alert.message}</div>
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header>
              <i className="bi bi-geo-alt-fill me-2"></i>
              {t('dashboard.terrain.title')}
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>{t('dashboard.terrain.current')}</strong>
              </div>
              <div className="text-muted">
                <i className="bi bi-lightbulb me-2"></i>
                {t('dashboard.terrain.suggestion')}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
  )
}

export default Dashboard