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
      <div>
        <Title headingLevel="h1">Welcome to Konveyor</Title>
        <Content>
          <p style={{ marginTop: 8, color: 'var(--pf-v6-global--Color--200)' }}>
            Accelerate your application modernization and migration journey
          </p>
        </Content>
      </div>

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
