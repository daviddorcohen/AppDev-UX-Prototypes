import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Dashboard.css'
import {
  Title,
  Content,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Stack,
  Flex,
  Badge,
  Progress,
  List,
  ListItem,
  Divider,
} from '@patternfly/react-core'
import UploadIcon from '@patternfly/react-icons/dist/esm/icons/upload-icon'
import ArrowsAltHIcon from '@patternfly/react-icons/dist/esm/icons/arrows-alt-h-icon'
import ChartBarIcon from '@patternfly/react-icons/dist/esm/icons/chart-bar-icon'
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon'
import FolderIcon from '@patternfly/react-icons/dist/esm/icons/folder-icon'
import FileAltIcon from '@patternfly/react-icons/dist/esm/icons/file-alt-icon'
import WaveSquareIcon from '@patternfly/react-icons/dist/esm/icons/wave-square-icon'
import UsersIcon from '@patternfly/react-icons/dist/esm/icons/users-icon'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon'
import SyncAltIcon from '@patternfly/react-icons/dist/esm/icons/sync-alt-icon'
import { MigrateWizard } from './MigrateWizard'
import { AnalysisWizard } from './AnalysisWizard'
import { BatchMigrationWizard } from './BatchMigrationWizard'

const summaryStats = [
  {
    icon: UsersIcon,
    value: '19',
    label: 'Total Applications',
    detail: '16 analyzed, 3 pending',
  },
  {
    icon: CheckCircleIcon,
    value: '12',
    label: 'Ready to Migrate',
    detail: '63% of total applications',
  },
  {
    icon: ExclamationTriangleIcon,
    value: '4',
    label: 'Issues Found',
    detail: 'Requiring attention before migration',
  },
  {
    icon: SyncAltIcon,
    value: '63%',
    label: 'Migration Progress',
    detail: '12 of 19 apps migrated',
  },
]

type QuickAction = {
  title: string
  description: string
  icon: React.ComponentType<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>
  to?: string
  actionId?: string
}

const quickActions: QuickAction[] = [
  {
    title: 'Import / Create Application',
    description: 'Add new applications to your inventory for analysis and migration',
    icon: UploadIcon,
    to: '/applications',
  },
  {
    title: 'Migrate Applications',
    description: "We'll help you generate the assets needed to migrate your application to OpenShift",
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
]

const myApplications = [
  { name: 'bookserverApp', status: 'Analyzed', statusVariant: 'info' as const, category: 'Retail' },
  { name: 'dayTraderApp_S', status: 'Analyzed', statusVariant: 'info' as const, category: 'Finance' },
  { name: 'eap8-bookserve', status: 'Analyzed', statusVariant: 'info' as const, category: 'Inventory' },
  { name: 'pythonApp_Source', status: 'Pending', statusVariant: 'read' as const, category: 'Analytics' },
]
const totalApplications = 19

const latestReports = [
  { id: 1247, date: 'Jan 12, 2026', apps: 5, status: 'completed' as const },
  { id: 1246, date: 'Jan 10, 2026', apps: 3, status: 'completed' as const },
  { id: 1245, date: 'Jan 8, 2026', apps: 2, status: 'failed' as const },
  { id: 1244, date: 'Jan 5, 2026', apps: 8, status: 'completed' as const },
]

const migrationWaves = [
  { name: 'Wave 1 - Core Services', status: 'Completed', statusVariant: 'success' as const, apps: 5, progress: 100 },
  { name: 'Wave 2 - API Gateway', status: 'In Progress', statusVariant: 'info' as const, apps: 8, progress: 75 },
  { name: 'Wave 3 - Legacy Apps', status: 'In Progress', statusVariant: 'info' as const, apps: 6, progress: 20 },
]

export function Dashboard() {
  const navigate = useNavigate()
  const [isMigrateWizardOpen, setIsMigrateWizardOpen] = useState(false)
  const [isAnalysisWizardOpen, setIsAnalysisWizardOpen] = useState(false)
  const [isBatchMigrationOpen, setIsBatchMigrationOpen] = useState(false)

  const handleQuickAction = (action: QuickAction) => {
    if (action.actionId === 'migrate') {
      setIsMigrateWizardOpen(true)
    } else if (action.actionId === 'analysis') {
      setIsAnalysisWizardOpen(true)
    } else if (action.actionId === 'batch-migrate') {
      setIsBatchMigrationOpen(true)
    } else if (action.to) {
      navigate(action.to)
    }
  }

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <MigrateWizard
        isOpen={isMigrateWizardOpen}
        onClose={() => setIsMigrateWizardOpen(false)}
      />
      <AnalysisWizard
        isOpen={isAnalysisWizardOpen}
        onClose={() => setIsAnalysisWizardOpen(false)}
      />
      <BatchMigrationWizard
        isOpen={isBatchMigrationOpen}
        onClose={() => setIsBatchMigrationOpen(false)}
      />
      <div>
        <Title headingLevel="h1">Welcome to Konveyor</Title>
        <Content>
          <p style={{ marginTop: 8, color: 'var(--pf-v6-global--Color--200)' }}>
            Accelerate your application modernization and migration journey
          </p>
        </Content>
      </div>

      <Grid hasGutter>
        {summaryStats.map(({ icon: Icon, value, label, detail }) => (
          <GridItem key={label} span={12} sm={6} lg={3}>
            <Card isFlat isCompact>
              <CardBody>
                <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <Icon />
                  <Stack>
                    <Title headingLevel="h3" size="2xl">{value}</Title>
                    <Content component="p">{label}</Content>
                    <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                      {detail}
                    </Content>
                  </Stack>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>

      <div>
        <Title headingLevel="h2" style={{ marginBottom: 16 }}>
          Quick Actions
        </Title>
        <Grid hasGutter>
          {quickActions.map((action) => {
            const { title, description, icon: Icon } = action
            return (
            <GridItem key={title} span={12} sm={6} lg={3}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleQuickAction(action)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickAction(action)}
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
                    <Content>
                      <p>{description}</p>
                    </Content>
                  </CardBody>
                </Card>
              </div>
            </GridItem>
            )
          })}
        </Grid>
      </div>

      <div>
        <Title headingLevel="h2" style={{ marginBottom: 16 }}>
          Overview
        </Title>
        <Grid hasGutter>
          <GridItem span={12} lg={6}>
            <Card isFullHeight>
              <CardHeader>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }} style={{ gap: 8 }}>
                  <CardTitle>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FolderIcon /> Applications
                    </span>
                  </CardTitle>
                  <NavLink to="/applications">View all</NavLink>
                </Flex>
              </CardHeader>
              <CardBody>
                <List isPlain>
                  {myApplications.map((app) => (
                    <ListItem key={app.name} style={{ paddingTop: 8, paddingBottom: 8 }}>
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }} style={{ gap: 8 }}>
                        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.name}</span>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ gap: 8 }} flexWrap={{ default: 'wrap' }}>
                          <Badge key={app.name} isRead={app.statusVariant === 'read'}>
                            {app.status}
                          </Badge>
                          <span style={{ fontSize: 'var(--pf-v6-global--FontSize--sm)', color: 'var(--pf-v6-global--Color--200)' }}>
                            {app.category}
                          </span>
                        </Flex>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
                <Divider style={{ margin: '12px 0' }} />
                <Content>
                  <p style={{ margin: 0 }}>
                    <strong>Total applications</strong> {totalApplications}
                  </p>
                </Content>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={12} lg={6}>
            <Card isFullHeight>
              <CardHeader>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }} style={{ gap: 8 }}>
                  <CardTitle>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileAltIcon /> Latest Analysis Reports
                    </span>
                  </CardTitle>
                  <NavLink to="/reports">View all</NavLink>
                </Flex>
              </CardHeader>
              <CardBody>
                <List isPlain>
                  {latestReports.map((r) => (
                    <ListItem key={r.id} style={{ paddingTop: 8, paddingBottom: 8 }}>
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }} style={{ gap: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <FileAltIcon />
                          Analysis #{r.id}
                        </span>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ gap: 12 }} flexWrap={{ default: 'wrap' }}>
                          <span style={{ fontSize: 'var(--pf-v6-global--FontSize--sm)', color: 'var(--pf-v6-global--Color--200)' }}>
                            {r.date}
                          </span>
                          <span style={{ fontSize: 'var(--pf-v6-global--FontSize--sm)' }}>{r.apps} apps</span>
                          <Badge key={r.id}>{r.status}</Badge>
                        </Flex>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </div>

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
          <NavLink to="/migration-waves">View all waves</NavLink>
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
                <strong>19 Total Apps</strong>
                <span aria-hidden>&rarr;</span>
                <span style={{ color: 'var(--pf-v6-global--success-color--100)', fontWeight: 500 }}>12 Migrated</span>
                <span style={{ color: 'var(--pf-v6-global--info-color--100)', fontWeight: 500 }}>5 In Progress</span>
                <span style={{ color: 'var(--pf-v6-global--Color--200)', fontWeight: 500 }}>2 Pending</span>
              </Flex>
              <div style={{ fontSize: 'var(--pf-v6-global--FontSize--xl)', fontWeight: 700, color: 'var(--pf-v6-global--info-color--100)' }}>
                Overall Progress 63%
              </div>
            </Flex>
          </CardBody>
        </Card>
      </div>
    </Stack>
  )
}
