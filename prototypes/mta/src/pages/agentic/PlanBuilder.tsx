import React, { useState } from 'react'
import {
  Title,
  Stack,
  StackItem,
  Button,
  Card,
  CardBody,
  Wizard,
  WizardStep,
  TextInput,
  TextArea,
  FormGroup,
  Form,
  FormSelect,
  FormSelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Label,
  Switch,
  Slider,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Alert,
  Split,
  SplitItem,
  Content,
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

const MOCK_APPS = [
  { id: 'app1', name: 'order-service', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
  { id: 'app2', name: 'payment-gateway', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
  { id: 'app3', name: 'inventory-manager', archetype: 'Legacy EJB Application', tags: ['Java', 'EJB'] },
  { id: 'app4', name: 'notification-service', archetype: 'Microservice (Quarkus)', tags: ['Java', 'Quarkus'] },
  { id: 'app5', name: 'user-auth', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
  { id: 'app6', name: 'report-generator', archetype: 'Batch Processing Job', tags: ['Java', 'Spring Batch'] },
  { id: 'app7', name: 'data-pipeline', archetype: 'Batch Processing Job', tags: ['Java', 'Spring Batch'] },
  { id: 'app8', name: 'customer-portal', archetype: 'Legacy EJB Application', tags: ['Java', 'EJB'] },
  { id: 'app9', name: 'shipping-tracker', archetype: 'Spring Boot Web App', tags: ['Java', 'Spring Boot'] },
  { id: 'app10', name: 'analytics-engine', archetype: 'Microservice (Quarkus)', tags: ['Java', 'Quarkus'] },
]

const MOCK_AGENTS = [
  { id: 'ag1', name: 'Java Migration Agent', model: 'Anthropic / claude-sonnet-4-20250514', recipes: 5 },
  { id: 'ag2', name: 'Spring Boot Modernizer', model: 'OpenAI / gpt-4o', recipes: 3 },
  { id: 'ag3', name: 'Legacy EJB Converter', model: 'Anthropic / claude-sonnet-4-20250514', recipes: 4 },
  { id: 'ag4', name: 'Quarkus Migration Agent', model: 'Ollama / llama-3.1-70b', recipes: 2 },
]

const GOAL_TEMPLATES = [
  { label: '-- Select a template (optional) --', value: '' },
  { label: 'Modernize to target framework', value: 'Modernize the selected applications to the target framework. Ensure all source code compiles, tests pass, and no regressions are introduced. Follow all attached guidelines.' },
  { label: 'Fix analysis issues', value: 'Fix all critical and mandatory issues identified by the MTA analysis engine for the selected applications. Prioritize issues by severity. Create a separate commit for each logical fix.' },
  { label: 'Add test coverage', value: 'Increase unit test coverage to at least 80% for all selected applications. Focus on business logic, API endpoints, and data access layers. Use the existing test framework.' },
]

export function PlanBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [planName, setPlanName] = useState(isNew ? '' : 'EAP6 to Quarkus Migration')
  const [selectedApps, setSelectedApps] = useState<string[]>(isNew ? [] : ['app1', 'app3', 'app8'])
  const [appFilter, setAppFilter] = useState('')
  const [selectedAgent, setSelectedAgent] = useState(isNew ? '' : 'ag1')
  const [goal, setGoal] = useState(isNew ? '' : 'Migrate the selected EAP6/EJB applications to Quarkus. For each application:\n1. Convert EJB beans to CDI beans\n2. Replace JPA/Hibernate config with Quarkus datasource config\n3. Migrate JAX-RS endpoints to RESTEasy Reactive\n4. Update pom.xml dependencies\n5. Ensure all existing tests pass\n6. Add smoke tests for migrated endpoints')
  const [stages, setStages] = useState([
    { name: 'Static Analysis', agent: 'ag1', description: 'Run MTA analysis to identify all migration issues' },
    { name: 'Code Transformation', agent: 'ag1', description: 'Apply automated code transformations based on analysis results' },
    { name: 'Test & Validate', agent: 'ag1', description: 'Run test suite, fix failures, ensure no regressions' },
  ])
  const [targetBranch, setTargetBranch] = useState(isNew ? '' : 'migration/eap6-to-quarkus')
  const [parallelism, setParallelism] = useState(3)
  const [writeToKB, setWriteToKB] = useState(true)
  const [autoCreatePR, setAutoCreatePR] = useState(true)

  const filteredApps = MOCK_APPS.filter(app =>
    !appFilter || app.name.toLowerCase().includes(appFilter.toLowerCase()) || app.archetype.toLowerCase().includes(appFilter.toLowerCase())
  )

  const toggleApp = (appId: string) => {
    setSelectedApps(prev => prev.includes(appId) ? prev.filter(a => a !== appId) : [...prev, appId])
  }

  const selectAllVisible = () => {
    const visibleIds = filteredApps.map(a => a.id)
    setSelectedApps(prev => [...new Set([...prev, ...visibleIds])])
  }

  const addStage = () => {
    setStages(prev => [...prev, { name: '', agent: selectedAgent, description: '' }])
  }

  const removeStage = (idx: number) => {
    setStages(prev => prev.filter((_, i) => i !== idx))
  }

  const updateStage = (idx: number, field: string, value: string) => {
    setStages(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  const selectedAgentObj = MOCK_AGENTS.find(a => a.id === selectedAgent)

  const stepSelectApps = (
    <Stack hasGutter>
      <StackItem>
        <Content component="p">Select the applications this plan will target. You can filter by name or archetype.</Content>
      </StackItem>
      <StackItem>
        <Split hasGutter>
          <SplitItem isFilled>
            <SearchInput
              placeholder="Filter by name or archetype"
              value={appFilter}
              onChange={(_e, val) => setAppFilter(val)}
              onClear={() => setAppFilter('')}
              aria-label="Filter applications"
            />
          </SplitItem>
          <SplitItem>
            <Button variant="secondary" onClick={selectAllVisible}>Select all visible</Button>
          </SplitItem>
          <SplitItem>
            <Label color="blue">{selectedApps.length} selected</Label>
          </SplitItem>
        </Split>
      </StackItem>
      <StackItem>
        <Table aria-label="Select applications" variant="compact">
          <Thead>
            <Tr>
              <Th screenReaderText="Select" />
              <Th>Application</Th>
              <Th>Archetype</Th>
              <Th>Tags</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredApps.map(app => (
              <Tr key={app.id}>
                <Td select={{ rowIndex: 0, onSelect: () => toggleApp(app.id), isSelected: selectedApps.includes(app.id) }} />
                <Td dataLabel="Application">{app.name}</Td>
                <Td dataLabel="Archetype">{app.archetype}</Td>
                <Td dataLabel="Tags">
                  {app.tags.map(t => <Label key={t} isCompact style={{ marginRight: 4 }}>{t}</Label>)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </StackItem>
    </Stack>
  )

  const stepChooseAgent = (
    <Stack hasGutter>
      <StackItem>
        <Content component="p">Select an agent profile to run this plan. The agent's model and recipes determine how the migration is performed.</Content>
      </StackItem>
      <StackItem>
        <Table aria-label="Select agent" variant="compact">
          <Thead>
            <Tr>
              <Th screenReaderText="Select" />
              <Th>Agent</Th>
              <Th>Model</Th>
              <Th>Recipes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {MOCK_AGENTS.map(agent => (
              <Tr key={agent.id}>
                <Td select={{ rowIndex: 0, onSelect: () => setSelectedAgent(agent.id), isSelected: selectedAgent === agent.id, variant: 'radio' }} />
                <Td dataLabel="Agent">{agent.name}</Td>
                <Td dataLabel="Model">{agent.model}</Td>
                <Td dataLabel="Recipes">{agent.recipes}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </StackItem>
      {selectedAgentObj && (
        <StackItem>
          <Alert variant="info" isInline title={`Selected: ${selectedAgentObj.name}`}>
            Model: {selectedAgentObj.model} | {selectedAgentObj.recipes} recipes attached
          </Alert>
        </StackItem>
      )}
    </Stack>
  )

  const stepDefineGoal = (
    <Stack hasGutter>
      <StackItem>
        <Content component="p">Define the migration goal. This prompt drives the agent's behavior. Use a template or write your own.</Content>
      </StackItem>
      <StackItem>
        <Form>
          <FormGroup label="Plan Name" isRequired fieldId="plan-name">
            <TextInput id="plan-name" value={planName} onChange={(_e, v) => setPlanName(v)} placeholder="e.g., EAP6 to Quarkus Migration" isRequired />
          </FormGroup>
          <FormGroup label="Goal Template" fieldId="goal-template">
            <FormSelect id="goal-template" value="" onChange={(_e, v) => { if (v) setGoal(v) }}>
              {GOAL_TEMPLATES.map(t => <FormSelectOption key={t.label} value={t.value} label={t.label} />)}
            </FormSelect>
          </FormGroup>
          <FormGroup label="Migration Goal" isRequired fieldId="plan-goal">
            <TextArea id="plan-goal" value={goal} onChange={(_e, v) => setGoal(v)} rows={10} placeholder="Describe the migration objective in detail..." isRequired />
          </FormGroup>
        </Form>
      </StackItem>
    </Stack>
  )

  const stepComposeStages = (
    <Stack hasGutter>
      <StackItem>
        <Split hasGutter>
          <SplitItem isFilled>
            <Content component="p">Define execution stages. Each stage runs sequentially. For simple plans, a single stage is sufficient.</Content>
          </SplitItem>
          <SplitItem>
            <Button variant="secondary" onClick={addStage}>Add stage</Button>
          </SplitItem>
        </Split>
      </StackItem>
      {stages.map((stage, idx) => (
        <StackItem key={idx}>
          <Card>
            <CardBody>
              <Split hasGutter>
                <SplitItem>
                  <Label isCompact color="blue">Stage {idx + 1}</Label>
                </SplitItem>
                <SplitItem isFilled />
                {stages.length > 1 && (
                  <SplitItem>
                    <Button variant="link" isDanger onClick={() => removeStage(idx)}>Remove</Button>
                  </SplitItem>
                )}
              </Split>
              <Form style={{ marginTop: 12 }}>
                <FormGroup label="Stage Name" fieldId={`stage-name-${idx}`}>
                  <TextInput id={`stage-name-${idx}`} value={stage.name} onChange={(_e, v) => updateStage(idx, 'name', v)} placeholder="e.g., Static Analysis" />
                </FormGroup>
                <FormGroup label="Description" fieldId={`stage-desc-${idx}`}>
                  <TextInput id={`stage-desc-${idx}`} value={stage.description} onChange={(_e, v) => updateStage(idx, 'description', v)} placeholder="What this stage does" />
                </FormGroup>
                <FormGroup label="Agent" fieldId={`stage-agent-${idx}`}>
                  <FormSelect id={`stage-agent-${idx}`} value={stage.agent} onChange={(_e, v) => updateStage(idx, 'agent', v)}>
                    {MOCK_AGENTS.map(a => <FormSelectOption key={a.id} value={a.id} label={a.name} />)}
                  </FormSelect>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </StackItem>
      ))}
    </Stack>
  )

  const stepConfigureExecution = (
    <Stack hasGutter>
      <StackItem>
        <Content component="p">Configure how the plan is executed.</Content>
      </StackItem>
      <StackItem>
        <Form>
          <FormGroup label="Target Branch" isRequired fieldId="target-branch">
            <TextInput id="target-branch" value={targetBranch} onChange={(_e, v) => setTargetBranch(v)} placeholder="e.g., migration/eap6-to-quarkus" isRequired />
          </FormGroup>
          <FormGroup label={`Parallelism: ${parallelism} apps simultaneously`} fieldId="parallelism">
            <Slider value={parallelism} min={1} max={10} onChange={(_e, v) => setParallelism(v)} showTicks hasTooltipOverThumb />
          </FormGroup>
          <FormGroup fieldId="write-kb">
            <Switch id="write-kb" label="Write lessons learned to Knowledge Base" isChecked={writeToKB} onChange={(_e, v) => setWriteToKB(v)} />
          </FormGroup>
          <FormGroup fieldId="auto-pr">
            <Switch id="auto-pr" label="Automatically create pull requests" isChecked={autoCreatePR} onChange={(_e, v) => setAutoCreatePR(v)} />
          </FormGroup>
        </Form>
      </StackItem>
    </Stack>
  )

  const stepReview = (
    <Stack hasGutter>
      <StackItem>
        <Alert variant="info" isInline title="Review your plan before running" />
      </StackItem>
      <StackItem>
        <Card>
          <CardBody>
            <DescriptionList isHorizontal>
              <DescriptionListGroup>
                <DescriptionListTerm>Plan Name</DescriptionListTerm>
                <DescriptionListDescription>{planName || '(not set)'}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Target Applications</DescriptionListTerm>
                <DescriptionListDescription>{selectedApps.length} applications selected</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Agent</DescriptionListTerm>
                <DescriptionListDescription>{selectedAgentObj?.name || '(not selected)'}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Stages</DescriptionListTerm>
                <DescriptionListDescription>{stages.length} stage(s): {stages.map(s => s.name || '(unnamed)').join(' → ')}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Target Branch</DescriptionListTerm>
                <DescriptionListDescription>{targetBranch || '(not set)'}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Parallelism</DescriptionListTerm>
                <DescriptionListDescription>{parallelism} apps simultaneously</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Knowledge Base</DescriptionListTerm>
                <DescriptionListDescription>{writeToKB ? 'Will write lessons learned' : 'Disabled'}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Pull Requests</DescriptionListTerm>
                <DescriptionListDescription>{autoCreatePR ? 'Auto-create PRs' : 'Manual'}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </StackItem>
      <StackItem>
        <Content component="h3">Migration Goal</Content>
        <Card>
          <CardBody>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{goal || '(not defined)'}</pre>
          </CardBody>
        </Card>
      </StackItem>
      <StackItem>
        <Split hasGutter>
          <SplitItem>
            <Button variant="secondary" onClick={() => navigate('/migration-runs')}>Test run (1-2 apps)</Button>
          </SplitItem>
          <SplitItem>
            <Button variant="primary" onClick={() => navigate('/migration-runs')}>Run all ({selectedApps.length} apps)</Button>
          </SplitItem>
        </Split>
      </StackItem>
    </Stack>
  )

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
            <Title headingLevel="h1">{isNew ? 'Create Migration Plan' : `Edit: ${planName}`}</Title>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Wizard onClose={() => navigate('/plans')}>
        <WizardStep name="Select Applications" id="step-apps">
          {stepSelectApps}
        </WizardStep>
        <WizardStep name="Choose Agent" id="step-agent">
          {stepChooseAgent}
        </WizardStep>
        <WizardStep name="Define Goal" id="step-goal">
          {stepDefineGoal}
        </WizardStep>
        <WizardStep name="Compose Stages" id="step-stages">
          {stepComposeStages}
        </WizardStep>
        <WizardStep name="Configure Execution" id="step-execution">
          {stepConfigureExecution}
        </WizardStep>
        <WizardStep name="Review" id="step-review" footer={{ nextButtonText: 'Save plan', onNext: () => navigate('/plans') }}>
          {stepReview}
        </WizardStep>
      </Wizard>
    </Stack>
  )
}
