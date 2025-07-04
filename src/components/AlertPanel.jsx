import React, { useEffect, useState } from 'react';
import { Card, Alert, Button, Badge } from 'react-bootstrap';

interface AlertItem {
  id: number;
  type: 'danger' | 'warning' | 'info';
  message: string;
  icon: string;
  timestamp: Date;
  priority: number;
}

interface AlertPanelProps {
  alerts: AlertItem[];
  onSpeak: (text: string) => void;
  language: string;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onSpeak, language }) => {
  const [priorityAlert, setPriorityAlert] = useState<AlertItem | null>(null);
  const [hasSpokenAlerts, setHasSpokenAlerts] = useState<Set<number>>(new Set());

  // Sort alerts by priority (higher number = higher priority)
  const sortedAlerts = [...alerts].sort((a, b) => b.priority - a.priority);

  useEffect(() => {
    // Find the highest priority alert that hasn't been spoken
    const unspokenAlerts = sortedAlerts.filter(alert => !hasSpokenAlerts.has(alert.id));
    
    if (unspokenAlerts.length > 0) {
      const highestPriority = unspokenAlerts[0];
      setPriorityAlert(highestPriority);
      
      // Auto-speak the highest priority alert
      setTimeout(() => {
        onSpeak(highestPriority.message);
        setHasSpokenAlerts(prev => new Set(prev).add(highestPriority.id));
      }, 500);
    }
  }, [alerts, hasSpokenAlerts, sortedAlerts, onSpeak]);

  const speakAlert = (alert: AlertItem) => {
    onSpeak(alert.message);
    setHasSpokenAlerts(prev => new Set(prev).add(alert.id));
  };

  const speakAllAlerts = () => {
    const alertText = sortedAlerts.map(alert => alert.message).join('. ');
    onSpeak(`${sortedAlerts.length} active alerts: ${alertText}`);
    setHasSpokenAlerts(new Set(sortedAlerts.map(alert => alert.id)));
  };

  return (
    <Card className="h-100 shadow">
      <Card.Header className="bg-danger text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <h5 className="mb-0">Safety Alerts</h5>
            <Badge bg="light" text="dark" className="ms-2">
              {alerts.length}
            </Badge>
          </div>
          <Button
            variant="outline-light"
            size="sm"
            onClick={speakAllAlerts}
            title="Read all alerts"
          >
            <i className="bi bi-volume-up"></i>
          </Button>
        </div>
      </Card.Header>

      {/* Priority Alert Banner */}
      {priorityAlert && (
        <Alert variant="danger" className="mb-0 border-0 rounded-0">
          <div className="d-flex align-items-center">
            <i className={`${priorityAlert.icon} me-3 fs-4`} style={{ animation: 'pulse 1s infinite' }}></i>
            <div className="flex-grow-1">
              <div className="fw-bold small">PRIORITY ALERT</div>
              <div>{priorityAlert.message}</div>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => speakAlert(priorityAlert)}
            >
              <i className="bi bi-volume-up"></i>
            </Button>
          </div>
        </Alert>
      )}

      <Card.Body className="p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {sortedAlerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.type}
            className="mb-2 mx-3 mt-3 cursor-pointer"
            onClick={() => speakAlert(alert)}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-start">
              <i className={`${alert.icon} me-3 fs-5`}></i>
              <div className="flex-grow-1">
                <div className="fw-medium">{alert.message}</div>
                <small className="text-muted">
                  {alert.timestamp.toLocaleString()}
                </small>
              </div>
              <div className="d-flex align-items-center">
                <Badge bg="secondary" className="me-2">
                  P{alert.priority}
                </Badge>
                <i className="bi bi-volume-up text-muted"></i>
              </div>
            </div>
          </Alert>
        ))}
      </Card.Body>
    </Card>
  );
};

export default AlertPanel;