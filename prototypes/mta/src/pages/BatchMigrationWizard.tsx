import React, { useState } from 'react'
import {
  Modal,
  ModalVariant,
  Wizard,
  WizardStep,
  WizardHeader,
  FormGroup,
  TextInput,
  Radio,
  Switch,
  Stack,
  Flex,
  FlexItem,
  Content,
  Title,
  Icon,
  Badge,
  Progress,
  ProgressMeasureLocation,
  Label,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Card,
  CardBody,
  Grid,
  GridItem,
  Alert,
} from '@patternfly/react-core'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import InProgressIcon from '@patternfly/react-icons/dist/esm/icons/in-progress-icon'
import PendingIcon from '@patternfly/react-icons/dist/esm/icons/pending-icon'
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon'
import CodeBranchIcon from '@patternfly/react-icons/dist/esm/icons/code-branch-icon'
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table'

const inventoryApps = [
  { id: 1, name: 'bookserverApp', service: 'Retail', status: 'Analyzed', tags: 22, repo: 'https://github.com/org/bookserver.git' },
  { id: 2, name: 'dayTraderApp_S', service: 'Finance', status: 'Analyzed', tags: 18, repo: 'https://github.com/org/daytrader.git' },
  { id: 3, name: 'eap8-bookserve', service: 'Inventory', status: 'Analyzed', tags: 15, repo: 'https://github.com/org/eap8-bookserve.git' },
  { id: 4, name: 'customersApp', service: 'CRM', status: 'Analyzed', tags: 12, repo: 'https://github.com/org/customers.git' },
  { id: 5, name: 'orderService', service: 'Commerce', status: 'Analyzed', tags: 20, repo: 'https://github.com/org/order-service.git' },
  { id: 6, name: 'inventoryAPI', service: 'Inventory', status: 'Analyzed', tags: 8, repo: 'https://github.com/org/inventory-api.git' },
  { id: 7, name: 'paymentGateway', service: 'Finance', status: 'Analyzed', tags: 14, repo: 'https://github.com/org/payment-gw.git' },
  { id: 8, name: 'notificationSvc', service: 'Platform', status: 'Analyzed', tags: 6, repo: 'https://github.com/org/notifications.git' },
]

const migrationTargets = [
  { name: 'Quarkus', description: 'Migrate Java EE / Spring Boot applications to Quarkus' },
  { name: 'JBoss EAP 8', description: 'Upgrade to the latest release of JBoss EAP' },
  { name: 'Spring Boot 3', description: 'Upgrade to the latest release of Spring Boot' },
  { name: 'OpenJDK 21', description: 'Migrate to OpenJDK 21' },
  { name: 'Jakarta EE 10', description: 'Migrate from Java EE to Jakarta EE 10' },
  { name: 'Containerization', description: 'Prepare applications for deployment on Kubernetes' },
]

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed'

interface MigrationTask {
  appName: string
  status: TaskStatus
  progress: number
  branch: string
  prUrl?: string
}

interface BatchMigrationWizardProps {
  isOpen: boolean
  onClose: () => void
}

export function BatchMigrationWizard({ isOpen, onClose }: BatchMigrationWizardProps) {
  const [selectedApps, setSelectedApps] = useState<number[]>([])
  const [selectedTarget, setSelectedTarget] = useState(0)
  const [branchPattern, setBranchPattern] = useState('migrate/{target}/{app}')
  const [createPR, setCreatePR] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [tasks, setTasks] = useState<MigrationTask[]>([])

  const resetState = () => {
    setSelectedApps([])
    setSelectedTarget(0)
    setBranchPattern('migrate/{target}/{app}')
    setCreatePR(true)
    setIsRunning(false)
    setTasks([])
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const toggleApp = (id: number) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedApps.length === inventoryApps.length) {
      setSelectedApps([])
    } else {
      setSelectedApps(inventoryApps.map((a) => a.id))
    }
  }

  const simulateMigration = () => {
    const initialTasks: MigrationTask[] = selectedApps.map((id) => {
      const app = inventoryApps.find((a) => a.id === id)!
      return {
        appName: app.name,
        status: 'pending' as TaskStatus,
        progress: 0,
        branch: branchPattern
          .replace('{target}', migrationTargets[selectedTarget].name.toLowerCase().replace(/\s+/g, '-'))
          .replace('{app}', app.name),
      }
    })
    setTasks(initialTasks)
    setIsRunning(true)

    initialTasks.forEach((_, idx) => {
      setTimeout(() => {
        setTasks((prev) => prev.map((t, i) =>
          i === idx ? { ...t, status: 'running', progress: 25 } : t
        ))
      }, idx * 1500 + 500)

      setTimeout(() => {
        setTasks((prev) => prev.map((t, i) =>
          i === idx ? { ...t, progress: 60 } : t
        ))
      }, idx * 1500 + 1500)

      setTimeout(() => {
        setTasks((prev) => prev.map((t, i) =>
          i === idx ? { ...t, progress: 90 } : t
        ))
      }, idx * 1500 + 2500)

      setTimeout(() => {
        const succeeded = Math.random() > 0.15
        setTasks((prev) => prev.map((t, i) =>
          i === idx
            ? {
                ...t,
                status: succeeded ? 'completed' : 'failed',
                progress: succeeded ? 100 : t.progress,
                prUrl: succeeded ? `https://github.com/org/${t.appName}/pull/1` : undefined,
              }
            : t
        ))
      }, idx * 1500 + 3500)
    })
  }

  const statusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <Icon status="success"><CheckCircleIcon /></Icon>
      case 'running': return <Icon status="info"><InProgressIcon /></Icon>
      case 'failed': return <Icon status="danger"><ExclamationCircleIcon /></Icon>
      default: return <Icon status="custom"><PendingIcon /></Icon>
    }
  }

  const stepSelectApps = (
    <Stack hasGutter>
      <div>
        <Title headingLevel="h2">Select applications</Title>
        <Content component="p">
          Select the applications you want to migrate. All selected applications will be processed using the same migration agent.
        </Content>
      </div>
      <div
        style={{
          border: '1px solid var(--pf-t--global--border--color--default)',
          borderRadius: 'var(--pf-t--global--border--radius--small)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 'var(--pf-t--global--spacer--md)', fontWeight: 700 }}>
          Application inventory
          <Badge isRead style={{ marginLeft: 8 }}>{selectedApps.length} selected</Badge>
        </div>
        <Table aria-label="Select applications" variant="compact" borders={false} style={{ tableLayout: 'fixed', width: '100%' }}>
          <Thead>
            <Tr>
              <Th
                select={{
                  onSelect: toggleAll,
                  isSelected: selectedApps.length === inventoryApps.length,
                }}
              />
              <Th>Name</Th>
              <Th>Business service</Th>
              <Th>Status</Th>
              <Th>Tags</Th>
            </Tr>
          </Thead>
          <Tbody>
            {inventoryApps.map((app) => (
              <Tr key={app.id}>
                <Td
                  select={{
                    rowIndex: app.id,
                    onSelect: () => toggleApp(app.id),
                    isSelected: selectedApps.includes(app.id),
                  }}
                />
                <Td dataLabel="Name">{app.name}</Td>
                <Td dataLabel="Business service">{app.service}</Td>
                <Td dataLabel="Status">
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <Icon status="success"><CheckCircleIcon /></Icon>
                    <FlexItem>{app.status}</FlexItem>
                  </Flex>
                </Td>
                <Td dataLabel="Tags">{app.tags}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </Stack>
  )

  const stepChooseTarget = (
    <Stack hasGutter>
      <div>
        <Title headingLevel="h2">Choose migration target</Title>
        <Content component="p">
          Select the target platform or framework for the migration. The migration agent will attempt to resolve all analysis violations for this target.
        </Content>
      </div>
      <div
        style={{
          border: '1px solid var(--pf-t--global--border--color--default)',
          borderRadius: 'var(--pf-t--global--border--radius--small)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 'var(--pf-t--global--spacer--md)', fontWeight: 700 }}>
          Migration targets
        </div>
        <Table aria-label="Select migration target" variant="compact" borders={false} style={{ tableLayout: 'fixed', width: '100%' }}>
          <Thead>
            <Tr>
              <Th>Target</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {migrationTargets.map((target, idx) => (
              <Tr key={target.name}>
                <Td dataLabel="Target">
                  <Radio
                    id={`batch-target-${idx}`}
                    name="batch-migration-target"
                    label={target.name}
                    isChecked={selectedTarget === idx}
                    onChange={() => setSelectedTarget(idx)}
                  />
                </Td>
                <Td dataLabel="Description">{target.description}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </Stack>
  )

  const stepConfigureOutput = (
    <Stack hasGutter>
      <div>
        <Title headingLevel="h2">Configure output</Title>
        <Content component="p">
          Define where the migration results will be pushed. Each application will get its own branch in its source repository.
        </Content>
      </div>
      <FormGroup label="Branch name pattern" fieldId="branch-pattern" helperText="Use {target} and {app} as placeholders. Example: migrate/quarkus/bookserverApp">
        <TextInput
          id="branch-pattern"
          value={branchPattern}
          onChange={(_e, val) => setBranchPattern(val)}
        />
      </FormGroup>
      <Switch
        id="create-pr-toggle"
        label="Automatically create pull requests"
        labelOff="Do not create pull requests"
        isChecked={createPR}
        onChange={(_e, checked) => setCreatePR(checked)}
      />
      <Alert variant="info" isInline isPlain title="Preview: branch names for selected applications" />
      <div
        style={{
          border: '1px solid var(--pf-t--global--border--color--default)',
          borderRadius: 'var(--pf-t--global--border--radius--small)',
          overflow: 'hidden',
        }}
      >
        <Table aria-label="Branch preview" variant="compact" borders={false} style={{ tableLayout: 'fixed', width: '100%' }}>
          <Thead>
            <Tr>
              <Th>Application</Th>
              <Th>Branch</Th>
              <Th>Repository</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedApps.map((id) => {
              const app = inventoryApps.find((a) => a.id === id)!
              const branch = branchPattern
                .replace('{target}', migrationTargets[selectedTarget].name.toLowerCase().replace(/\s+/g, '-'))
                .replace('{app}', app.name)
              return (
                <Tr key={app.id}>
                  <Td dataLabel="Application">{app.name}</Td>
                  <Td dataLabel="Branch">
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <CodeBranchIcon />
                      <FlexItem>{branch}</FlexItem>
                    </Flex>
                  </Td>
                  <Td dataLabel="Repository">
                    <Content component="small">{app.repo}</Content>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </div>
    </Stack>
  )

  const stepReview = (
    <Stack hasGutter>
      <div>
        <Title headingLevel="h2">Review and confirm</Title>
        <Content component="p">
          Review the migration configuration below. Once confirmed, the migration agent will be launched for each selected application.
        </Content>
      </div>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>Applications</DescriptionListTerm>
          <DescriptionListDescription>
            {selectedApps.length} applications selected
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Migration target</DescriptionListTerm>
          <DescriptionListDescription>
            {migrationTargets[selectedTarget].name}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Branch pattern</DescriptionListTerm>
          <DescriptionListDescription>{branchPattern}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Create pull requests</DescriptionListTerm>
          <DescriptionListDescription>{createPR ? 'Yes' : 'No'}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>LLM provider</DescriptionListTerm>
          <DescriptionListDescription>MTA LLM Proxy (cluster-configured)</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <div
        style={{
          border: '1px solid var(--pf-t--global--border--color--default)',
          borderRadius: 'var(--pf-t--global--border--radius--small)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 'var(--pf-t--global--spacer--md)', fontWeight: 700 }}>
          Applications to migrate
        </div>
        <Table aria-label="Applications to migrate" variant="compact" borders={false} style={{ tableLayout: 'fixed', width: '100%' }}>
          <Thead>
            <Tr>
              <Th>Application</Th>
              <Th>Target</Th>
              <Th>Branch</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedApps.map((id) => {
              const app = inventoryApps.find((a) => a.id === id)!
              const branch = branchPattern
                .replace('{target}', migrationTargets[selectedTarget].name.toLowerCase().replace(/\s+/g, '-'))
                .replace('{app}', app.name)
              return (
                <Tr key={app.id}>
                  <Td dataLabel="Application">{app.name}</Td>
                  <Td dataLabel="Target">{migrationTargets[selectedTarget].name}</Td>
                  <Td dataLabel="Branch">
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <CodeBranchIcon />
                      <FlexItem>{branch}</FlexItem>
                    </Flex>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </div>
    </Stack>
  )

  const stepExecution = (
    <Stack hasGutter>
      <div>
        <Title headingLevel="h2">Migration progress</Title>
        <Content component="p">
          {isRunning
            ? 'The migration agent is running for each selected application. Results will be pushed to branches as they complete.'
            : 'Click "Start migration" to begin the batch migration process.'}
        </Content>
      </div>
      {tasks.length > 0 && (
        <Grid hasGutter>
          <GridItem span={3}>
            <Card isFlat isCompact>
              <CardBody>
                <Stack>
                  <Title headingLevel="h3" size="2xl">
                    {tasks.filter((t) => t.status === 'completed').length}/{tasks.length}
                  </Title>
                  <Content component="small">Completed</Content>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={3}>
            <Card isFlat isCompact>
              <CardBody>
                <Stack>
                  <Title headingLevel="h3" size="2xl">
                    {tasks.filter((t) => t.status === 'running').length}
                  </Title>
                  <Content component="small">Running</Content>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={3}>
            <Card isFlat isCompact>
              <CardBody>
                <Stack>
                  <Title headingLevel="h3" size="2xl">
                    {tasks.filter((t) => t.status === 'pending').length}
                  </Title>
                  <Content component="small">Pending</Content>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={3}>
            <Card isFlat isCompact>
              <CardBody>
                <Stack>
                  <Title headingLevel="h3" size="2xl">
                    {tasks.filter((t) => t.status === 'failed').length}
                  </Title>
                  <Content component="small">Failed</Content>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}
      {tasks.length > 0 && (
        <div
          style={{
            border: '1px solid var(--pf-t--global--border--color--default)',
            borderRadius: 'var(--pf-t--global--border--radius--small)',
            overflow: 'hidden',
          }}
        >
          <Table aria-label="Migration tasks" variant="compact" borders={false} style={{ tableLayout: 'fixed', width: '100%' }}>
            <Thead>
              <Tr>
                <Th>Application</Th>
                <Th>Status</Th>
                <Th>Progress</Th>
                <Th>Branch</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => (
                <Tr key={task.appName}>
                  <Td dataLabel="Application">{task.appName}</Td>
                  <Td dataLabel="Status">
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      {statusIcon(task.status)}
                      <FlexItem>
                        <Label
                          color={
                            task.status === 'completed' ? 'green'
                              : task.status === 'running' ? 'blue'
                                : task.status === 'failed' ? 'red'
                                  : 'grey'
                          }
                          isCompact
                        >
                          {task.status}
                        </Label>
                      </FlexItem>
                    </Flex>
                  </Td>
                  <Td dataLabel="Progress">
                    <Progress
                      value={task.progress}
                      measureLocation={ProgressMeasureLocation.inside}
                      variant={task.status === 'failed' ? 'danger' : undefined}
                    />
                  </Td>
                  <Td dataLabel="Branch">
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <CodeBranchIcon />
                      <FlexItem>{task.branch}</FlexItem>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </Stack>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      aria-label="Batch migration wizard"
      variant={ModalVariant.large}
      hasNoBodyWrapper
      showClose={false}
      style={{ overflow: 'hidden' }}
    >
      <Wizard
        height={600}
        width="100%"
        className="migrate-wizard"
        onClose={handleClose}
        onSave={simulateMigration}
        header={
          <WizardHeader
            title="Batch migration"
            description="Run AI-powered migration agents across multiple applications"
            onClose={handleClose}
          />
        }
      >
        <WizardStep name="Select applications" id="batch-step-select">
          {stepSelectApps}
        </WizardStep>
        <WizardStep name="Migration target" id="batch-step-target">
          {stepChooseTarget}
        </WizardStep>
        <WizardStep name="Configure output" id="batch-step-output">
          {stepConfigureOutput}
        </WizardStep>
        <WizardStep name="Review" id="batch-step-review" footer={{ nextButtonText: 'Start migration' }}>
          {stepReview}
        </WizardStep>
        <WizardStep name="Execution" id="batch-step-execution" footer={{ nextButtonText: 'Done', isCancelHidden: true, isBackHidden: true }}>
          {stepExecution}
        </WizardStep>
      </Wizard>
    </Modal>
  )
}
