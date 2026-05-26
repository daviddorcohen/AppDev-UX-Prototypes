import React from 'react'
import {
  Title,
  Stack,
  StackItem,
  Button,
  Card,
  CardBody,
  CardTitle,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Label,
  Split,
  SplitItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Content,
  Spinner,
  Flex,
  FlexItem,
  Icon,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowLeftIcon from '@patternfly/react-icons/dist/esm/icons/arrow-left-icon'
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon'
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon'
import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon'
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon'

type PlanStatus = 'Draft' | 'Ready' | 'Running' | 'Completed' | 'Failed'

const statusConfig: Record<PlanStatus, { color: 'grey' | 'blue' | 'green' | 'red'; showSpinner?: boolean }> = {
  Draft: { color: 'grey' },
  Ready: { color: 'blue' },
  Running: { color: 'blue', showSpinner: true },
  Completed: { color: 'green' },
  Failed: { color: 'red' },
}

const runStatusColor: Record<string, 'blue' | 'green' | 'red' | 'grey'> = {
  Running: 'blue',
  Completed: 'green',
  Failed: 'red',
  'In Progress': 'blue',
  Pending: 'grey',
}

const MOCK_PLANS: Record<string, {
  name: string
  status: PlanStatus
  agent: { id: string; name: string }
  targetBranch: string
  parallelism: number
  writeToKB: boolean
  autoCreatePR: boolean
  goal: string
  stages: { name: string; agentName: string; description: string }[]
  apps: { id: string; name: string; archetype: string; tags: string[] }[]
  runs: { id: string; status: string; appsCompleted: string; duration: string; started: string; prLink?: string }[]
}> = {
  '1': {
    name: 'EAP6 to Quarkus Migration',
    status: 'Running',
    agent: { id: '1', name: 'Java Migration Agent' },
    targetBranch: 'migration/eap6-to-quarkus',
    parallelism: 3,
    writeToKB: true,
    autoCreatePR: true,
    goal: `Migrate the selected EAP6/EJB applications to Quarkus. For each application:
1. Convert EJB beans to CDI beans
2. Replace JPA/Hibernate config with Quarkus datasource config
3. Migrate JAX-RS endpoints to RESTEasy Reactive
4. Update pom.xml dependencies
5. Ensure all existing tests pass
6. Add smoke tests for migrated endpoints`,
    stages: [
      { name: 'Static Analysis', agentName: 'Java Migration Agent', description: 'Run MTA analysis to identify all migration issues' },
      { name: 'Code Transformation', agentName: 'Java Migration Agent', description: 'Apply automated code transformations based on analysis results' },
      { name: 'Test & Validate', agentName: 'Java Migration Agent', description: 'Run test suite, fix failures, ensure no regressions' },
    ],
    apps: [
      { id: 'app1', name: 'order-service', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
      { id: 'app2', name: 'payment-gateway', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
      { id: 'app3', name: 'inventory-manager', archetype: 'Legacy EJB Application', tags: ['Java', 'EJB'] },
      { id: 'app5', name: 'user-auth', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
      { id: 'app8', name: 'customer-portal', archetype: 'Legacy EJB Application', tags: ['Java', 'EJB'] },
      { id: 'app9', name: 'shipping-tracker', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
      { id: 'app4', name: 'notification-service', archetype: 'Microservice (Quarkus)', tags: ['Java', 'Quarkus'] },
      { id: 'app10', name: 'analytics-engine', archetype: 'Microservice (Quarkus)', tags: ['Java', 'Quarkus'] },
      { id: 'app6', name: 'report-generator', archetype: 'Batch Processing Job', tags: ['Java', 'Spring Batch'] },
      { id: 'app7', name: 'data-pipeline', archetype: 'Batch Processing Job', tags: ['Java', 'Spring Batch'] },
      { id: 'app11', name: 'audit-service', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
      { id: 'app12', name: 'config-server', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
    ],
    runs: [
      { id: 'run-101', status: 'Running', appsCompleted: '7 / 12', duration: '2h 15m', started: '2026-05-25 10:30', prLink: undefined },
      { id: 'run-094', status: 'Failed', appsCompleted: '3 / 12', duration: '1h 05m', started: '2026-05-24 14:00', prLink: undefined },
      { id: 'run-088', status: 'Completed', appsCompleted: '2 / 2', duration: '45m', started: '2026-05-23 09:15', prLink: 'https://github.com/acme/apps/pull/234' },
    ],
  },
  '2': {
    name: 'Spring Boot 2 → 3 Upgrade',
    status: 'Completed',
    agent: { id: '2', name: 'Spring Boot Modernizer' },
    targetBranch: 'migration/spring-boot-3',
    parallelism: 5,
    writeToKB: true,
    autoCreatePR: true,
    goal: `Upgrade all Spring Boot 2.x applications to Spring Boot 3.x:
1. Update spring-boot-starter-parent to 3.x
2. Migrate javax.* to jakarta.* namespaces
3. Update Spring Security configuration
4. Fix deprecated API usage
5. Run and fix all tests`,
    stages: [
      { name: 'Namespace Migration', agentName: 'Spring Boot Modernizer', description: 'Replace javax.* with jakarta.* across all source files' },
      { name: 'Dependency & Config Update', agentName: 'Spring Boot Modernizer', description: 'Update pom.xml, application.properties, and security config' },
    ],
    apps: Array.from({ length: 42 }, (_, i) => ({
      id: `sb-app-${i + 1}`,
      name: `spring-service-${i + 1}`,
      archetype: 'Spring Boot Web App',
      tags: ['Java', 'Spring Boot'],
    })).slice(0, 10),
    runs: [
      { id: 'run-097', status: 'Completed', appsCompleted: '42 / 42', duration: '3h 10m', started: '2026-05-22 08:00', prLink: 'https://github.com/acme/apps/pull/220' },
      { id: 'run-090', status: 'Completed', appsCompleted: '5 / 5', duration: '50m', started: '2026-05-20 11:00', prLink: 'https://github.com/acme/apps/pull/215' },
    ],
  },
  '3': {
    name: 'Fix Critical Analysis Issues',
    status: 'Ready',
    agent: { id: '1', name: 'Java Migration Agent' },
    targetBranch: 'fix/critical-issues',
    parallelism: 4,
    writeToKB: true,
    autoCreatePR: true,
    goal: `Fix all critical and mandatory issues identified by the MTA analysis engine for the selected applications. Prioritize issues by severity. Create a separate commit for each logical fix.`,
    stages: [
      { name: 'Issue Resolution', agentName: 'Java Migration Agent', description: 'Fix critical and mandatory migration issues identified by static analysis' },
    ],
    apps: [
      { id: 'app3', name: 'inventory-manager', archetype: 'Legacy EJB Application', tags: ['Java', 'EJB'] },
      { id: 'app8', name: 'customer-portal', archetype: 'Legacy EJB Application', tags: ['Java', 'EJB'] },
      { id: 'app1', name: 'order-service', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
      { id: 'app6', name: 'report-generator', archetype: 'Batch Processing Job', tags: ['Java', 'Spring Batch'] },
      { id: 'app2', name: 'payment-gateway', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
      { id: 'app9', name: 'shipping-tracker', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
      { id: 'app5', name: 'user-auth', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
      { id: 'app4', name: 'notification-service', archetype: 'Microservice (Quarkus)', tags: ['Java', 'Quarkus'] },
    ],
    runs: [],
  },
  '4': {
    name: 'Legacy EJB Containerization',
    status: 'Draft',
    agent: { id: '3', name: 'Legacy EJB Converter' },
    targetBranch: '',
    parallelism: 2,
    writeToKB: true,
    autoCreatePR: false,
    goal: `Containerize legacy EJB applications for deployment on OpenShift:
1. Create Dockerfiles with appropriate base images
2. Externalize configuration via environment variables
3. Add health check endpoints
4. Create Kubernetes/OpenShift manifests`,
    stages: [
      { name: 'Analysis', agentName: 'Legacy EJB Converter', description: 'Identify deployment dependencies and configuration' },
      { name: 'Dockerfile Creation', agentName: 'Legacy EJB Converter', description: 'Create optimized multi-stage Dockerfiles' },
      { name: 'Config Externalization', agentName: 'Legacy EJB Converter', description: 'Move hardcoded config to environment variables' },
      { name: 'Manifest Generation', agentName: 'Legacy EJB Converter', description: 'Generate OpenShift deployment manifests' },
    ],
    apps: Array.from({ length: 18 }, (_, i) => ({
      id: `ejb-app-${i + 1}`,
      name: `ejb-service-${i + 1}`,
      archetype: 'Legacy EJB Application',
      tags: ['Java', 'EJB'],
    })).slice(0, 8),
    runs: [],
  },
  '5': {
    name: 'Quarkus Native Build Prep',
    status: 'Failed',
    agent: { id: '4', name: 'Quarkus Migration Agent' },
    targetBranch: 'migration/quarkus-native',
    parallelism: 3,
    writeToKB: true,
    autoCreatePR: true,
    goal: `Prepare applications for Quarkus native compilation:
1. Add GraalVM native-image configuration
2. Replace reflection-heavy patterns
3. Configure native build plugins
4. Test native compilation`,
    stages: [
      { name: 'Native Config', agentName: 'Quarkus Migration Agent', description: 'Add reflection config and native-image properties' },
      { name: 'Code Adaptation', agentName: 'Quarkus Migration Agent', description: 'Replace patterns incompatible with native compilation' },
    ],
    apps: Array.from({ length: 25 }, (_, i) => ({
      id: `qk-app-${i + 1}`,
      name: `quarkus-svc-${i + 1}`,
      archetype: 'Microservice (Quarkus)',
      tags: ['Java', 'Quarkus'],
    })).slice(0, 8),
    runs: [
      { id: 'run-099', status: 'Failed', appsCompleted: '15 / 25', duration: '55m', started: '2026-05-24 16:00' },
    ],
  },
  '6': {
    name: 'Add Unit Test Coverage',
    status: 'Draft',
    agent: { id: '5', name: 'Test Coverage Agent' },
    targetBranch: '',
    parallelism: 10,
    writeToKB: false,
    autoCreatePR: true,
    goal: `Increase unit test coverage to at least 80% for all selected applications. Focus on business logic, API endpoints, and data access layers. Use the existing test framework.`,
    stages: [
      { name: 'Test Generation', agentName: 'Test Coverage Agent', description: 'Generate unit and integration tests to reach 80% coverage' },
    ],
    apps: Array.from({ length: 50 }, (_, i) => ({
      id: `test-app-${i + 1}`,
      name: `service-${i + 1}`,
      archetype: i % 3 === 0 ? 'Spring Boot Web App' : i % 3 === 1 ? 'Microservice (Quarkus)' : 'Batch Processing Job',
      tags: ['Java'],
    })).slice(0, 10),
    runs: [],
  },
}

export function PlanOverview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const plan = MOCK_PLANS[id || ''] || MOCK_PLANS['1']
  const cfg = statusConfig[plan.status]

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Button variant="link" icon={<ArrowLeftIcon />} onClick={() => navigate('/plans')}>
              Back to Plans
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Split hasGutter>
              <SplitItem>
                <Title headingLevel="h1">{plan.name}</Title>
              </SplitItem>
              <SplitItem>
                <Split hasGutter>
                  <SplitItem>
                    <Label color={cfg.color}>{plan.status}</Label>
                  </SplitItem>
                  {cfg.showSpinner && <SplitItem><Spinner size="sm" /></SplitItem>}
                </Split>
              </SplitItem>
            </Split>
          </ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Button variant="primary" icon={<PencilAltIcon />} onClick={() => navigate(`/plans/${id}/edit`)}>
                Edit
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant="secondary"
                icon={<PlayIcon />}
                isDisabled={plan.status === 'Running'}
                onClick={() => navigate('/migration-runs')}
              >
                Run plan
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="secondary" onClick={() => {}}>Duplicate</Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="danger" onClick={() => navigate('/plans')}>Delete</Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Card>
        <CardTitle>Plan Summary</CardTitle>
        <CardBody>
          <DescriptionList isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>Name</DescriptionListTerm>
              <DescriptionListDescription>{plan.name}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Status</DescriptionListTerm>
              <DescriptionListDescription>
                <Split hasGutter>
                  <SplitItem><Label color={cfg.color}>{plan.status}</Label></SplitItem>
                  {cfg.showSpinner && <SplitItem><Spinner size="sm" /></SplitItem>}
                </Split>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Agent</DescriptionListTerm>
              <DescriptionListDescription>
                <Button variant="link" isInline onClick={() => navigate(`/agents/${plan.agent.id}`)}>
                  {plan.agent.name}
                </Button>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Target Branch</DescriptionListTerm>
              <DescriptionListDescription>
                {plan.targetBranch ? <Label isCompact>{plan.targetBranch}</Label> : <Content component="small">(not set)</Content>}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Parallelism</DescriptionListTerm>
              <DescriptionListDescription>{plan.parallelism} apps simultaneously</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Knowledge Base</DescriptionListTerm>
              <DescriptionListDescription>
                <Label color={plan.writeToKB ? 'green' : 'grey'} isCompact>
                  {plan.writeToKB ? 'Enabled' : 'Disabled'}
                </Label>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Auto-create PRs</DescriptionListTerm>
              <DescriptionListDescription>
                <Label color={plan.autoCreatePR ? 'green' : 'grey'} isCompact>
                  {plan.autoCreatePR ? 'Enabled' : 'Disabled'}
                </Label>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>
          <Split hasGutter>
            <SplitItem>Target Applications</SplitItem>
            <SplitItem>
              <Label isCompact color="blue">{plan.apps.length} applications</Label>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          <Table aria-label="Target applications" variant="compact">
            <Thead>
              <Tr>
                <Th>Application</Th>
                <Th>Archetype</Th>
                <Th>Tags</Th>
              </Tr>
            </Thead>
            <Tbody>
              {plan.apps.map(app => (
                <Tr key={app.id}>
                  <Td dataLabel="Application">{app.name}</Td>
                  <Td dataLabel="Archetype">{app.archetype}</Td>
                  <Td dataLabel="Tags">
                    {app.tags.map(t => <Label key={t} isCompact style={{ marginRight: 4 }}>{t}</Label>)}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Migration Goal</CardTitle>
        <CardBody>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--pf-v6-global--FontFamily--text)', margin: 0, lineHeight: 1.5 }}>
            {plan.goal}
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>
          <Split hasGutter>
            <SplitItem>Execution Stages</SplitItem>
            <SplitItem>
              <Label isCompact>{plan.stages.length} stage{plan.stages.length !== 1 ? 's' : ''}</Label>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: 16 }}>
            {plan.stages.map((stage, idx) => (
              <React.Fragment key={idx}>
                <FlexItem>
                  <Label color="blue">{stage.name}</Label>
                </FlexItem>
                {idx < plan.stages.length - 1 && (
                  <FlexItem>
                    <Icon size="sm"><ArrowRightIcon /></Icon>
                  </FlexItem>
                )}
              </React.Fragment>
            ))}
          </Flex>
          <Table aria-label="Execution stages" variant="compact">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Stage Name</Th>
                <Th>Agent</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {plan.stages.map((stage, idx) => (
                <Tr key={idx}>
                  <Td dataLabel="#">{idx + 1}</Td>
                  <Td dataLabel="Stage Name">{stage.name}</Td>
                  <Td dataLabel="Agent">{stage.agentName}</Td>
                  <Td dataLabel="Description">{stage.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {plan.runs.length > 0 && (
        <Card>
          <CardTitle>Execution History</CardTitle>
          <CardBody>
            <Table aria-label="Execution history" variant="compact">
              <Thead>
                <Tr>
                  <Th>Run ID</Th>
                  <Th>Status</Th>
                  <Th>Apps Completed</Th>
                  <Th>Duration</Th>
                  <Th>Started</Th>
                  <Th>PR Link</Th>
                </Tr>
              </Thead>
              <Tbody>
                {plan.runs.map(run => (
                  <Tr key={run.id}>
                    <Td dataLabel="Run ID">{run.id}</Td>
                    <Td dataLabel="Status">
                      <Label color={runStatusColor[run.status] || 'grey'} isCompact>{run.status}</Label>
                    </Td>
                    <Td dataLabel="Apps Completed">{run.appsCompleted}</Td>
                    <Td dataLabel="Duration">{run.duration}</Td>
                    <Td dataLabel="Started">{run.started}</Td>
                    <Td dataLabel="PR Link">
                      {run.prLink ? (
                        <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end" component="a" href={run.prLink} target="_blank">
                          View PR
                        </Button>
                      ) : '—'}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <StackItem style={{ marginTop: 12 }}>
              <Button variant="link" onClick={() => navigate('/migration-runs')}>View all migration runs</Button>
            </StackItem>
          </CardBody>
        </Card>
      )}
    </Stack>
  )
}
