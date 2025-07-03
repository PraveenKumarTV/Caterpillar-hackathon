import React, { createContext, useContext, useState, useEffect } from 'react'
import localforage from 'localforage'

const OfflineContext = createContext()

export const useOffline = () => {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineData, setOfflineData] = useState({})

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const saveOfflineData = async (key, data) => {
    try {
      await localforage.setItem(key, data)
      setOfflineData(prev => ({ ...prev, [key]: data }))
    } catch (error) {
      console.error('Failed to save offline data:', error)
    }
  }

  const getOfflineData = async (key) => {
    try {
      const data = await localforage.getItem(key)
      return data
    } catch (error) {
      console.error('Failed to get offline data:', error)
      return null
    }
  }

  const syncData = async () => {
    if (!isOnline) return

    try {
      // Sync inspection data
      const inspectionData = await localforage.getItem('inspections')
      if (inspectionData) {
        // Send to backend when online
        console.log('Syncing inspection data:', inspectionData)
      }

      // Sync job updates
      const jobUpdates = await localforage.getItem('jobUpdates')
      if (jobUpdates) {
        // Send to backend when online
        console.log('Syncing job updates:', jobUpdates)
      }
    } catch (error) {
      console.error('Failed to sync data:', error)
    }
  }

  useEffect(() => {
    if (isOnline) {
      syncData()
    }
  }, [isOnline])

  const value = {
    isOnline,
    saveOfflineData,
    getOfflineData,
    syncData,
    offlineData
  }

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  )
}