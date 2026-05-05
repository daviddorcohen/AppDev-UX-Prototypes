export { DashboardProvider, useDashboard } from './DashboardProvider'
export { DashboardPage } from './DashboardPage'
export { mockDashboardData } from './mock-data'

export type {
  DashboardData,
  DashboardContextValue,
  DashboardSummary,
  SummaryStat,
  ApplicationSummary,
  ReportSummary,
  MigrationWave,
  QuickActionDef,
} from './types'

export { SummaryStats } from './components/SummaryStats'
export { QuickActions } from './components/QuickActions'
export { ApplicationsOverview } from './components/ApplicationsOverview'
export { ReportsOverview } from './components/ReportsOverview'
export { MigrationStatus } from './components/MigrationStatus'

export { MigrateWizard } from './wizards/MigrateWizard'
export { AnalysisWizard } from './wizards/AnalysisWizard'
export { BatchMigrationWizard } from './wizards/BatchMigrationWizard'
