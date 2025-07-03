import React from 'react'
import { Card } from 'react-bootstrap'
import { useTTS } from '../contexts/TTSContext'

const MetricCard = ({ title, value, unit, icon, status = 'ok', onClick }) => {
  const { speak } = useTTS()

  const handleClick = () => {
    speak(`${title}: ${value} ${unit}`)
    if (onClick) onClick()
  }

  const getStatusColor = () => {
    switch (status) {
      case 'warning': return 'var(--cat-orange)'
      case 'danger': return 'var(--cat-red)'
      default: return 'var(--cat-yellow)'
    }
  }

  return (
    <div 
      className="metric-card" 
      onClick={handleClick}
      style={{ 
        borderColor: getStatusColor(),
        cursor: 'pointer'
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <i className={`bi ${icon}`} style={{ fontSize: '24px', color: getStatusColor() }}></i>
        <span className={`status-indicator status-${status}`}></span>
      </div>
      
      <div className="metric-value" style={{ color: getStatusColor() }}>
        {value}
        <span className="metric-unit ms-1">{unit}</span>
      </div>
      
      <div className="metric-label">{title}</div>
    </div>
  )
}

export default MetricCard