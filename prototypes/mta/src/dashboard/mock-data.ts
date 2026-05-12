import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon'
import SyncAltIcon from '@patternfly/react-icons/dist/esm/icons/sync-alt-icon'
import UploadIcon from '@patternfly/react-icons/dist/esm/icons/upload-icon'
import ArrowsAltHIcon from '@patternfly/react-icons/dist/esm/icons/arrows-alt-h-icon'
import ChartBarIcon from '@patternfly/react-icons/dist/esm/icons/chart-bar-icon'
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon'
import { DashboardData } from './types'

export const mockDashboardData: DashboardData = {
  summary: {
    totalApplications: 19,
    readyToMigrate: 12,
    issuesFound: 4,
    migrationProgress: 63,
    analyzedCount: 16,
    pendingCount: 3,
    migratedCount: 12,
    inProgressCount: 5,
  },
  summaryStats: [
    {
      icon: CubesIcon,
      value: '19',
      label: 'Total Applications',
      detail: '16 analyzed, 3 pending',
      to: '/applications',
    },
    {
      icon: CheckCircleIcon,
      value: '12',
      label: 'Ready to Migrate',
      detail: '63% of total applications',
      to: '/applications',
    },
    {
      icon: ExclamationTriangleIcon,
      value: '4',
      label: 'Issues Found',
      detail: 'Requiring attention before migration',
      to: '/issues',
    },
    {
      icon: SyncAltIcon,
      value: '63%',
      label: 'Migration Progress',
      detail: '12 of 19 apps migrated',
      to: '/migration-waves',
    },
  ],
  quickActions: [
    {
      title: 'Import / Create Application',
      description: 'Add new applications to your inventory for analysis and migration',
      icon: UploadIcon,
      to: '/applications',
    },
    {
      title: 'Generate Migration Assets',
      description: 'Generate deployment manifests and configuration to migrate your application to a target platform',
      icon: ArrowsAltHIcon,
      actionId: 'migrate',
    },
    {
      title: 'New Analysis Report',
      description: 'Run static code analysis on your applications',
      icon: ChartBarIcon,
      actionId: 'analysis',
    },
    {
      title: 'Batch Migration',
      description: 'Run AI-powered migration agents across multiple applications at once',
      icon: CodeIcon,
      actionId: 'batch-migrate',
    },
  ],
  applications: [
    { name: 'bookserverApp', status: 'Analyzed', statusVariant: 'info', category: 'Retail' },
    { name: 'dayTraderApp_S', status: 'Analyzed', statusVariant: 'info', category: 'Finance' },
    { name: 'eap8-bookserve', status: 'Analyzed', statusVariant: 'info', category: 'Inventory' },
    { name: 'pythonApp_Source', status: 'Pending', statusVariant: 'read', category: 'Analytics' },
  ],
  reports: [
    { id: 1247, date: 'Jan 12, 2026', apps: 5, status: 'completed' },
    { id: 1246, date: 'Jan 10, 2026', apps: 3, status: 'completed' },
    { id: 1245, date: 'Jan 8, 2026', apps: 2, status: 'failed' },
    { id: 1244, date: 'Jan 5, 2026', apps: 8, status: 'completed' },
  ],
  migrationWaves: [
    { name: 'Wave 1 - Core Services', status: 'Completed', statusVariant: 'success', apps: 5, progress: 100 },
    { name: 'Wave 2 - API Gateway', status: 'In Progress', statusVariant: 'info', apps: 8, progress: 75 },
    { name: 'Wave 3 - Legacy Apps', status: 'In Progress', statusVariant: 'info', apps: 6, progress: 20 },
  ],
}
