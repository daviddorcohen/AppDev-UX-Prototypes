import React from 'react'
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Stack,
  Flex,
  Badge,
  Progress,
  Divider,
  Title,
} from '@patternfly/react-core'
import WaveSquareIcon from '@patternfly/react-icons/dist/esm/icons/wave-square-icon'
import { useDashboard } from '../DashboardProvider'

export function MigrationStatus() {
  const { data, navigateTo } = useDashboard()
  const { summary, migrationWaves } = data

  return (
    <div>
      <Flex
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        alignItems={{ default: 'alignItemsCenter' }}
        flexWrap={{ default: 'wrap' }}
        style={{ marginBottom: 16, gap: 12 }}
      >
        <Title headingLevel="h2" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <WaveSquareIcon style={{ color: 'var(--pf-v6-global--info-color--100)' }} />
          Migration Status
        </Title>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/migration-waves') }} style={{ cursor: 'pointer' }}>View all waves</a>
      </Flex>
      <Card>
        <CardBody>
          <Grid hasGutter>
            {migrationWaves.map((wave) => (
              <GridItem key={wave.name} span={12} md={4}>
                <Card variant="compact" isFlat style={{ border: '1px solid var(--pf-v6-global--BorderColor--100)', height: '100%' }}>
                  <CardBody>
                    <Stack hasGutter>
                      <div style={{ fontWeight: 600 }}>{wave.name}</div>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ gap: 8 }}>
                        <Badge
                          style={
                            wave.statusVariant === 'success'
                              ? { backgroundColor: 'var(--pf-v6-global--success-color--100)', color: 'white' }
                              : { backgroundColor: 'var(--pf-v6-global--info-color--100)', color: 'white' }
                          }
                        >
                          {wave.status}
                        </Badge>
                      </Flex>
                      <div>
                        <Progress value={wave.progress} measureLocation="inside" />
                        <Flex
                          justifyContent={{ default: 'justifyContentSpaceBetween' }}
                          alignItems={{ default: 'alignItemsCenter' }}
                          style={{ marginTop: 8, fontSize: 'var(--pf-v6-global--FontSize--sm)', color: 'var(--pf-v6-global--Color--200)' }}
                        >
                          <span>{wave.apps} applications</span>
                          <span>{wave.progress}%</span>
                        </Flex>
                      </div>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
          <Divider style={{ margin: '24px 0 16px' }} />
          <Flex
            justifyContent={{ default: 'justifyContentSpaceBetween' }}
            alignItems={{ default: 'alignItemsCenter' }}
            flexWrap={{ default: 'wrap' }}
            style={{ gap: 8 }}
          >
            <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ gap: 8, flexWrap: 'wrap' }}>
              <strong>{summary.totalApplications} Total Apps</strong>
              <span aria-hidden>&rarr;</span>
              <span style={{ color: 'var(--pf-v6-global--success-color--100)', fontWeight: 500 }}>{summary.migratedCount} Migrated</span>
              <span style={{ color: 'var(--pf-v6-global--info-color--100)', fontWeight: 500 }}>{summary.inProgressCount} In Progress</span>
              <span style={{ color: 'var(--pf-v6-global--Color--200)', fontWeight: 500 }}>{summary.pendingCount} Pending</span>
            </Flex>
            <div style={{ fontSize: 'var(--pf-v6-global--FontSize--xl)', fontWeight: 700, color: 'var(--pf-v6-global--info-color--100)' }}>
              Overall Progress {summary.migrationProgress}%
            </div>
          </Flex>
        </CardBody>
      </Card>
    </div>
  )
}
