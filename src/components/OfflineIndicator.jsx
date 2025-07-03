import React from 'react'
import { useTranslation } from 'react-i18next'
import { useOffline } from '../contexts/OfflineContext'

const OfflineIndicator = () => {
  const { t } = useTranslation()
  const { isOnline } = useOffline()

  return (
    <div className={`offline-indicator ${!isOnline ? 'show' : ''}`}>
      <i className="bi bi-wifi-off me-2"></i>
      {t('offline.indicator')}
    </div>
  )
}

export default OfflineIndicator