import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Title,
  Content,
} from '@patternfly/react-core'
import { useDashboard } from '../DashboardProvider'
import { QuickActionDef } from '../types'
import { MigrateWizard } from '../wizards/MigrateWizard'
import { AnalysisWizard } from '../wizards/AnalysisWizard'
import { BatchMigrationWizard } from '../wizards/BatchMigrationWizard'

export function QuickActions() {
  const { data, navigateTo } = useDashboard()
  const [isMigrateOpen, setIsMigrateOpen] = useState(false)
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)
  const [isBatchOpen, setIsBatchOpen] = useState(false)

  const handleAction = (action: QuickActionDef) => {
    if (action.actionId === 'migrate') setIsMigrateOpen(true)
    else if (action.actionId === 'analysis') setIsAnalysisOpen(true)
    else if (action.actionId === 'batch-migrate') setIsBatchOpen(true)
    else if (action.to) navigateTo(action.to)
  }

  return (
    <>
      <MigrateWizard isOpen={isMigrateOpen} onClose={() => setIsMigrateOpen(false)} />
      <AnalysisWizard isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />
      <BatchMigrationWizard isOpen={isBatchOpen} onClose={() => setIsBatchOpen(false)} />
      <div>
        <Title headingLevel="h2" style={{ marginBottom: 16 }}>Quick Actions</Title>
        <Grid hasGutter>
          {data.quickActions.map((action) => {
            const { title, description, icon: Icon } = action
            return (
              <GridItem key={title} span={12} sm={6} lg={3}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleAction(action)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAction(action)}
                  style={{ cursor: 'pointer', height: '100%' }}
                >
                  <Card isFullHeight variant="default" className="dashboard-quick-action-card">
                    <CardHeader>
                      <CardTitle>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Icon size="lg" /> {title}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Content><p>{description}</p></Content>
                    </CardBody>
                  </Card>
                </div>
              </GridItem>
            )
          })}
        </Grid>
      </div>
    </>
  )
}
