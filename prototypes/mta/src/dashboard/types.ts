import React from 'react'

export interface SummaryStat {
  icon: React.ComponentType<any>
  value: string
  label: string
  detail: string
}

export interface ApplicationSummary {
  name: string
  status: string
  statusVariant: 'info' | 'read'
  category: string
}

export interface ReportSummary {
  id: number
  date: string
  apps: number
  status: 'completed' | 'failed' | 'in-progress'
}

export interface MigrationWave {
  name: string
  status: string
  statusVariant: 'success' | 'info' | 'warning'
  apps: number
  progress: number
}

export interface QuickActionDef {
  title: string
  description: string
  icon: React.ComponentType<any>
  to?: string
  actionId?: string
}

export interface DashboardSummary {
  totalApplications: number
  readyToMigrate: number
  issuesFound: number
  migrationProgress: number
  analyzedCount: number
  pendingCount: number
  migratedCount: number
  inProgressCount: number
}

export interface DashboardData {
  summary: DashboardSummary
  summaryStats: SummaryStat[]
  quickActions: QuickActionDef[]
  applications: ApplicationSummary[]
  reports: ReportSummary[]
  migrationWaves: MigrationWave[]
}

export interface DashboardContextValue {
  data: DashboardData
  isLoading: boolean
  error: Error | null
  navigateTo: (path: string) => void
  openExternalLink: (url: string) => void
}
