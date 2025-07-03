import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../contexts/TTSContext';

const PostOperationAnalytics = () => {
  const { t } = useTranslation();
  const { speak } = useTTS();
  const [activeTab, setActiveTab] = useState('summary');
  const [shiftData, setShiftData] = useState({
    duration: 8.5,
    fuelUsed: 45.2,
    loadsCompleted: 12,
    efficiency: 87,
    startTime: '06:00',
    endTime: '14:30'
  });

  const [issues, setIssues] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Hydraulic Pressure Fluctuation',
      description: 'Detected at 10:30 AM in Zone B',
      status: 'resolved',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      type: 'info',
      title: 'Fuel Efficiency Below Target',
      description: 'Average consumption 5% higher than optimal',
      status: 'pending',
      timestamp: '2:00 PM'
    }
  ]);

  const [recommendations, setRecommendations] = useState({
    fuelEfficiency: [
      'Reduce idle time by 15% to save 3.2L fuel per shift',
      'Optimize load distribution for better fuel economy',
      'Consider route optimization for Zone C operations'
    ],
    maintenance: [
      'Schedule hydraulic system inspection within 48 hours',
      'Check tire pressure - detected 2 PSI below optimal',
      'Oil change due in 15 operating hours'
    ],
    safety: [
      'Review speed limits in muddy terrain conditions',
      'Ensure proper use of differential lock on steep grades',
      'Update emergency contact procedures'
    ],
    productivity: [
      'Average cycle time can be improved by 8%',
      'Consider pre-positioning for morning startup',
      'Coordinate with dispatch for load sequencing'
    ]
  });

  const [performanceData, setPerformanceData] = useState({
    daily: {
      efficiency: [85, 87, 82, 89, 87],
      fuelConsumption: [42.1, 45.2, 48.3, 41.8, 45.2],
      loads: [10, 12, 9, 13, 12]
    },
    weekly: {
      efficiency: [86, 84, 88, 87],
      fuelConsumption: [225, 240, 210, 225],
      loads: [56, 52, 61, 58]
    }
  });

  const handleReadAloud = () => {
    const content = `${t('analytics.title')}. ${t('analytics.subtitle')}. 
      Shift summary: ${shiftData.duration} hours operated, ${shiftData.fuelUsed} liters fuel used, 
      ${shiftData.loadsCompleted} loads completed, ${shiftData.efficiency}% efficiency rating.`;
    speak(content);
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return 'success';
    if (efficiency >= 80) return 'warning';
    return 'danger';
  };

  const getIssueIcon = (type) => {
    switch (type) {
      case 'critical': return 'bi-exclamation-triangle-fill text-danger';
      case 'warning': return 'bi-exclamation-triangle text-warning';
      case 'info': return 'bi-info-circle text-info';
      default: return 'bi-check-circle text-success';
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold text-warning mb-2">
                <i className="bi bi-graph-up me-3"></i>
                {t('analytics.title')}
              </h1>
              <p className="lead text-muted">{t('analytics.subtitle')}</p>
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

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        fill
      >
        <Tab eventKey="summary" title={
          <span><i className="bi bi-clipboard-data me-2"></i>{t('analytics.summary.title')}</span>
        }>
          <Row className="g-4">
            {/* Shift Summary Cards */}
            <Col lg={3} md={6}>
              <Card className="text-center h-100 border-warning">
                <Card.Body>
                  <i className="bi bi-clock display-4 text-warning mb-3"></i>
                  <h3 className="fw-bold">{shiftData.duration}h</h3>
                  <p className="text-muted mb-0">{t('analytics.summary.duration')}</p>
                  <small className="text-muted">{shiftData.startTime} - {shiftData.endTime}</small>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className="text-center h-100 border-primary">
                <Card.Body>
                  <i className="bi bi-fuel-pump display-4 text-primary mb-3"></i>
                  <h3 className="fw-bold">{shiftData.fuelUsed}L</h3>
                  <p className="text-muted mb-0">{t('analytics.summary.fuelUsed')}</p>
                  <small className="text-muted">5.3L/hour average</small>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className="text-center h-100 border-success">
                <Card.Body>
                  <i className="bi bi-truck display-4 text-success mb-3"></i>
                  <h3 className="fw-bold">{shiftData.loadsCompleted}</h3>
                  <p className="text-muted mb-0">{t('analytics.summary.loadsCompleted')}</p>
                  <small className="text-muted">1.4 loads/hour</small>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className="text-center h-100 border-info">
                <Card.Body>
                  <i className="bi bi-speedometer2 display-4 text-info mb-3"></i>
                  <h3 className="fw-bold">{shiftData.efficiency}%</h3>
                  <p className="text-muted mb-0">{t('analytics.summary.efficiency')}</p>
                  <ProgressBar 
                    variant={getEfficiencyColor(shiftData.efficiency)} 
                    now={shiftData.efficiency} 
                    className="mt-2"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="issues" title={
          <span><i className="bi bi-exclamation-triangle me-2"></i>{t('analytics.issues.title')}</span>
        }>
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h4 className="mb-0">{t('analytics.issues.title')}</h4>
                </Card.Header>
                <Card.Body>
                  {issues.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-check-circle-fill text-success display-4 mb-3"></i>
                      <p className="text-muted">{t('analytics.issues.noIssues')}</p>
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {issues.map(issue => (
                        <ListGroup.Item key={issue.id} className="px-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-2">
                                <i className={`${getIssueIcon(issue.type)} me-2`}></i>
                                <h6 className="mb-0">{issue.title}</h6>
                                <Badge 
                                  bg={issue.status === 'resolved' ? 'success' : 'warning'} 
                                  className="ms-2"
                                >
                                  {t(`analytics.issues.${issue.status}`)}
                                </Badge>
                              </div>
                              <p className="text-muted mb-1">{issue.description}</p>
                              <small className="text-muted">{issue.timestamp}</small>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="bg-light">
                <Card.Body>
                  <h5 className="mb-3">Issue Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Issues:</span>
                    <Badge bg="secondary">{issues.length}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Resolved:</span>
                    <Badge bg="success">{issues.filter(i => i.status === 'resolved').length}</Badge>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Pending:</span>
                    <Badge bg="warning">{issues.filter(i => i.status === 'pending').length}</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="recommendations" title={
          <span><i className="bi bi-lightbulb me-2"></i>{t('analytics.recommendations.title')}</span>
        }>
          <Row className="g-4">
            <Col md={6}>
              <Card className="h-100">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-fuel-pump me-2"></i>
                    {t('analytics.recommendations.fuelEfficiency')}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {recommendations.fuelEfficiency.map((rec, index) => (
                      <ListGroup.Item key={index} className="px-0">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {rec}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0">
                    <i className="bi bi-tools me-2"></i>
                    {t('analytics.recommendations.maintenance')}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {recommendations.maintenance.map((rec, index) => (
                      <ListGroup.Item key={index} className="px-0">
                        <i className="bi bi-wrench text-warning me-2"></i>
                        {rec}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Header className="bg-danger text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-shield-check me-2"></i>
                    {t('analytics.recommendations.safety')}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {recommendations.safety.map((rec, index) => (
                      <ListGroup.Item key={index} className="px-0">
                        <i className="bi bi-shield-fill-check text-danger me-2"></i>
                        {rec}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    {t('analytics.recommendations.productivity')}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {recommendations.productivity.map((rec, index) => (
                      <ListGroup.Item key={index} className="px-0">
                        <i className="bi bi-arrow-up-circle text-info me-2"></i>
                        {rec}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="trends" title={
          <span><i className="bi bi-graph-up-arrow me-2"></i>{t('analytics.trends.title')}</span>
        }>
          <Row className="g-4">
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h4 className="mb-0">{t('analytics.trends.title')}</h4>
                </Card.Header>
                <Card.Body>
                  <div className="mb-4">
                    <h6>Efficiency Trend (Last 5 Days)</h6>
                    <div className="d-flex align-items-end gap-2 mb-3" style={{ height: '100px' }}>
                      {performanceData.daily.efficiency.map((value, index) => (
                        <div key={index} className="d-flex flex-column align-items-center">
                          <div 
                            className={`bg-${getEfficiencyColor(value)} rounded-top`}
                            style={{ 
                              width: '40px', 
                              height: `${value}px`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <small className="mt-1">{value}%</small>
                          <small className="text-muted">Day {index + 1}</small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6>Fuel Consumption (Last 5 Days)</h6>
                    <div className="d-flex align-items-end gap-2 mb-3" style={{ height: '100px' }}>
                      {performanceData.daily.fuelConsumption.map((value, index) => (
                        <div key={index} className="d-flex flex-column align-items-center">
                          <div 
                            className="bg-primary rounded-top"
                            style={{ 
                              width: '40px', 
                              height: `${value}px`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <small className="mt-1">{value}L</small>
                          <small className="text-muted">Day {index + 1}</small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h6>Loads Completed (Last 5 Days)</h6>
                    <div className="d-flex align-items-end gap-2 mb-3" style={{ height: '100px' }}>
                      {performanceData.daily.loads.map((value, index) => (
                        <div key={index} className="d-flex flex-column align-items-center">
                          <div 
                            className="bg-success rounded-top"
                            style={{ 
                              width: '40px', 
                              height: `${value * 7}px`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <small className="mt-1">{value}</small>
                          <small className="text-muted">Day {index + 1}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Performance Metrics</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Average Efficiency:</span>
                      <strong>86%</strong>
                    </div>
                    <ProgressBar variant="warning" now={86} className="mt-1" />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Fuel Economy:</span>
                      <strong>5.3L/h</strong>
                    </div>
                    <ProgressBar variant="primary" now={75} className="mt-1" />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between">
                      <span>Productivity:</span>
                      <strong>1.4 loads/h</strong>
                    </div>
                    <ProgressBar variant="success" now={82} className="mt-1" />
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>
                  <h5 className="mb-0">Goals for Tomorrow</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="px-0">
                      <i className="bi bi-target text-success me-2"></i>
                      Achieve 90%+ efficiency
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <i className="bi bi-fuel-pump text-primary me-2"></i>
                      Reduce fuel consumption by 5%
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <i className="bi bi-truck text-warning me-2"></i>
                      Complete 14+ loads
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      <style jsx>{`
        .read-aloud-btn {
          min-width: 150px;
        }
      `}</style>
    </Container>
  );
};

export default PostOperationAnalytics;