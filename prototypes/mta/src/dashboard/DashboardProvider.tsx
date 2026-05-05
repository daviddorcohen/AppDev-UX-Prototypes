import React, { createContext, useContext } from 'react'
import { DashboardContextValue, DashboardData } from './types'

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return ctx
}

interface DashboardProviderProps {
  data: DashboardData
  isLoading?: boolean
  error?: Error | null
  navigateTo: (path: string) => void
  openExternalLink?: (url: string) => void
  children: React.ReactNode
}

export function DashboardProvider({
  data,
  isLoading = false,
  error = null,
  navigateTo,
  openExternalLink = (url) => window.open(url, '_blank'),
  children,
}: DashboardProviderProps) {
  const value: DashboardContextValue = {
    data,
    isLoading,
    error,
    navigateTo,
    openExternalLink,
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}
