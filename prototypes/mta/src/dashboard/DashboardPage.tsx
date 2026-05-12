import React from 'react'
import {
  Stack,
  Grid,
  GridItem,
  Title,
  Content,
} from '@patternfly/react-core'
import { useDashboard } from './DashboardProvider'
import { SummaryStats } from './components/SummaryStats'
import { QuickActions } from './components/QuickActions'
import { ApplicationsOverview } from './components/ApplicationsOverview'
import { ReportsOverview } from './components/ReportsOverview'
import { MigrationStatus } from './components/MigrationStatus'

export function DashboardPage() {
  const { isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <Content component="p">Loading dashboard...</Content>
      </div>
    )
  }

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Title headingLevel="h1" size="xl">Dashboard</Title>
      <SummaryStats />
      <QuickActions />

      <div>
        <Title headingLevel="h2" style={{ marginBottom: 16 }}>Overview</Title>
        <Grid hasGutter>
          <GridItem span={12} lg={6}>
            <ApplicationsOverview />
          </GridItem>
          <GridItem span={12} lg={6}>
            <ReportsOverview />
          </GridItem>
        </Grid>
      </div>

      <MigrationStatus />
    </Stack>
  )
}
