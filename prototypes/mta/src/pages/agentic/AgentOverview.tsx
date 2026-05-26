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
  Divider,
  ExpandableSection,
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

const MOCK_AGENTS: Record<string, {
  name: string
  description: string
  definition: string
  provider: string
  model: string
  credentials: string
  status: 'Active' | 'Draft' | 'Disabled'
  recipes: { id: string; name: string; scope: string; description: string }[]
  archetypes: { id: string; name: string; appCount: number }[]
  recentRuns: { id: string; plan: string; status: string; duration: string; date: string }[]
}> = {
  '1': {
    name: 'Java Migration Agent',
    description: 'General-purpose agent for migrating Java applications across frameworks and runtimes.',
    definition: 'You are a Java migration expert. Your mission is to modernize legacy Java applications to cloud-native frameworks while maintaining functional correctness, test coverage, and adherence to corporate coding standards.',
    provider: 'Anthropic',
    model: 'claude-sonnet-4-20250514',
    credentials: 'anthropic-api-key',
    status: 'Active',
    recipes: [
      { id: 'r1', name: 'Corporate Coding Standards', scope: 'Agent', description: 'Commit conventions, code documentation, testing requirements' },
      { id: 'r2', name: 'Security Best Practices', scope: 'Agent', description: 'No hardcoded credentials, dependency scanning, OWASP compliance' },
      { id: 'r3', name: 'Spring Boot 3.x Migration Guide', scope: 'Archetype', description: 'javax→jakarta namespace, Spring Security 6.x patterns' },
      { id: 'r4', name: 'Quarkus Best Practices', scope: 'Target', description: 'CDI patterns, MicroProfile config, native image considerations' },
      { id: 'r5', name: 'Golang Coding Conventions', scope: 'Agent', description: 'Go module structure, error handling patterns, testing standards' },
    ],
    archetypes: [
      { id: 'a1', name: 'Spring Boot Web App', appCount: 42 },
      { id: 'a2', name: 'Legacy EJB Application', appCount: 18 },
      { id: 'a3', name: 'Microservice (Quarkus)', appCount: 25 },
    ],
    recentRuns: [
      { id: 'run-101', plan: 'EAP6 to Quarkus Migration', status: 'Running', duration: '2h 15m', date: '2026-05-25' },
      { id: 'run-098', plan: 'Fix Critical Analysis Issues', status: 'Completed', duration: '45m', date: '2026-05-23' },
      { id: 'run-095', plan: 'Spring Boot 2 → 3 Upgrade', status: 'Completed', duration: '1h 30m', date: '2026-05-20' },
    ],
  },
  '2': {
    name: 'Spring Boot Modernizer',
    description: 'Specialized agent for upgrading Spring Boot 2.x applications to Spring Boot 3.x with Jakarta EE.',
    definition: 'You are a Spring Boot migration specialist. Upgrade applications from Spring Boot 2.x to 3.x, handling namespace changes, dependency updates, and configuration migrations.',
    provider: 'OpenAI',
    model: 'gpt-4o',
    credentials: 'openai-org-token',
    status: 'Active',
    recipes: [
      { id: 'r1', name: 'Corporate Coding Standards', scope: 'Agent', description: 'Commit conventions, code documentation, testing requirements' },
      { id: 'r3', name: 'Spring Boot 3.x Migration Guide', scope: 'Archetype', description: 'javax→jakarta namespace, Spring Security 6.x patterns' },
      { id: 'r2', name: 'Security Best Practices', scope: 'Agent', description: 'No hardcoded credentials, dependency scanning, OWASP compliance' },
    ],
    archetypes: [
      { id: 'a1', name: 'Spring Boot Web App', appCount: 42 },
      { id: 'a4', name: 'Batch Processing Job', appCount: 7 },
    ],
    recentRuns: [
      { id: 'run-097', plan: 'Spring Boot 2 → 3 Upgrade', status: 'Completed', duration: '3h 10m', date: '2026-05-22' },
    ],
  },
  '3': {
    name: 'Legacy EJB Converter',
    description: 'Converts legacy EJB 2.x/3.x applications to modern CDI-based architectures.',
    definition: 'You are an EJB migration expert. Convert Enterprise JavaBeans to CDI beans, replace entity beans with JPA, and modernize deployment descriptors to annotation-based configuration.',
    provider: 'Anthropic',
    model: 'claude-sonnet-4-20250514',
    credentials: 'anthropic-api-key',
    status: 'Draft',
    recipes: [
      { id: 'r1', name: 'Corporate Coding Standards', scope: 'Agent', description: 'Commit conventions, code documentation, testing requirements' },
      { id: 'r2', name: 'Security Best Practices', scope: 'Agent', description: 'No hardcoded credentials, dependency scanning, OWASP compliance' },
      { id: 'r3', name: 'Spring Boot 3.x Migration Guide', scope: 'Archetype', description: 'javax→jakarta namespace, Spring Security 6.x patterns' },
      { id: 'r4', name: 'Quarkus Best Practices', scope: 'Target', description: 'CDI patterns, MicroProfile config, native image considerations' },
    ],
    archetypes: [
      { id: 'a2', name: 'Legacy EJB Application', appCount: 18 },
    ],
    recentRuns: [],
  },
  '4': {
    name: 'Quarkus Migration Agent',
    description: 'Migrates Java applications to Quarkus with native compilation support.',
    definition: 'You are a Quarkus specialist. Migrate applications to Quarkus, leveraging CDI, RESTEasy Reactive, and native image compilation. Optimize for cloud-native deployment.',
    provider: 'Ollama',
    model: 'llama-3.1-70b',
    credentials: 'ollama-local',
    status: 'Active',
    recipes: [
      { id: 'r4', name: 'Quarkus Best Practices', scope: 'Target', description: 'CDI patterns, MicroProfile config, native image considerations' },
      { id: 'r1', name: 'Corporate Coding Standards', scope: 'Agent', description: 'Commit conventions, code documentation, testing requirements' },
    ],
    archetypes: [
      { id: 'a3', name: 'Microservice (Quarkus)', appCount: 25 },
      { id: 'a4', name: 'Batch Processing Job', appCount: 7 },
    ],
    recentRuns: [
      { id: 'run-099', plan: 'Quarkus Native Build Prep', status: 'Failed', duration: '55m', date: '2026-05-24' },
    ],
  },
  '5': {
    name: 'Test Coverage Agent',
    description: 'Adds unit and integration test coverage to applications with low test metrics.',
    definition: 'You are a testing specialist. Your mission is to increase test coverage by writing unit tests, integration tests, and smoke tests for existing business logic.',
    provider: 'OpenAI',
    model: 'gpt-4o-mini',
    credentials: 'openai-org-token',
    status: 'Disabled',
    recipes: [
      { id: 'r1', name: 'Corporate Coding Standards', scope: 'Agent', description: 'Commit conventions, code documentation, testing requirements' },
    ],
    archetypes: [],
    recentRuns: [],
  },
  '6': {
    name: '.NET to Java Converter',
    description: 'Converts .NET/C# applications to Java equivalents with Spring Boot.',
    definition: 'You are a cross-platform migration expert. Convert .NET applications to Java, mapping C# patterns to Java equivalents, ASP.NET to Spring MVC, and Entity Framework to JPA/Hibernate.',
    provider: 'Anthropic',
    model: 'claude-opus-4-20250514',
    credentials: 'anthropic-api-key',
    status: 'Draft',
    recipes: [
      { id: 'r1', name: 'Corporate Coding Standards', scope: 'Agent', description: 'Commit conventions, code documentation, testing requirements' },
      { id: 'r2', name: 'Security Best Practices', scope: 'Agent', description: 'No hardcoded credentials, dependency scanning, OWASP compliance' },
      { id: 'r3', name: 'Spring Boot 3.x Migration Guide', scope: 'Archetype', description: 'javax→jakarta namespace, Spring Security 6.x patterns' },
      { id: 'r5', name: 'Golang Coding Conventions', scope: 'Agent', description: 'Go module structure, error handling patterns, testing standards' },
      { id: 'r4', name: 'Quarkus Best Practices', scope: 'Target', description: 'CDI patterns, MicroProfile config, native image considerations' },
      { id: 'r6', name: 'PF5-to-PF6 Migration Standards', scope: 'Target', description: 'PatternFly component migration patterns and design token mapping' },
    ],
    archetypes: [
      { id: 'a1', name: 'Spring Boot Web App', appCount: 42 },
    ],
    recentRuns: [],
  },
}

const statusColor: Record<string, 'green' | 'blue' | 'grey'> = {
  Active: 'green',
  Draft: 'blue',
  Disabled: 'grey',
}

const scopeColor: Record<string, 'blue' | 'green' | 'orange' | 'purple'> = {
  Agent: 'blue',
  Archetype: 'green',
  Target: 'orange',
  Application: 'purple',
}

const runStatusColor: Record<string, 'blue' | 'green' | 'red' | 'grey'> = {
  Running: 'blue',
  Completed: 'green',
  Failed: 'red',
  Cancelled: 'grey',
}

export function AgentOverview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [configExpanded, setConfigExpanded] = React.useState(false)

  const agent = MOCK_AGENTS[id || ''] || MOCK_AGENTS['1']
  const totalInheritedApps = agent.archetypes.reduce((sum, a) => sum + a.appCount, 0)

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Button variant="link" icon={<ArrowLeftIcon />} onClick={() => navigate('/agents')}>
              Back to Agents
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Split hasGutter>
              <SplitItem>
                <Title headingLevel="h1">{agent.name}</Title>
              </SplitItem>
              <SplitItem>
                <Label color={statusColor[agent.status]}>{agent.status}</Label>
              </SplitItem>
            </Split>
          </ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Button variant="primary" icon={<PencilAltIcon />} onClick={() => navigate(`/agents/${id}/edit`)}>
                Edit
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="secondary" onClick={() => {}}>Duplicate</Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="danger" onClick={() => navigate('/agents')}>Delete</Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Card>
        <CardTitle>Basic Information</CardTitle>
        <CardBody>
          <DescriptionList isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>Name</DescriptionListTerm>
              <DescriptionListDescription>{agent.name}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Description</DescriptionListTerm>
              <DescriptionListDescription>{agent.description}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Definition / Mission</DescriptionListTerm>
              <DescriptionListDescription>
                <Content component="p" style={{ whiteSpace: 'pre-wrap' }}>{agent.definition}</Content>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Model Configuration</CardTitle>
        <CardBody>
          <DescriptionList isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>Provider</DescriptionListTerm>
              <DescriptionListDescription>{agent.provider}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Model</DescriptionListTerm>
              <DescriptionListDescription>{agent.provider} / {agent.model}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Credentials</DescriptionListTerm>
              <DescriptionListDescription>
                <Label isCompact>{agent.credentials}</Label>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>
          <Split hasGutter>
            <SplitItem>Attached Recipes / Guidelines</SplitItem>
            <SplitItem>
              <Label isCompact color="blue">{agent.recipes.length} attached</Label>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          <Table aria-label="Attached recipes" variant="compact">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Scope Level</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {agent.recipes.map(recipe => (
                <Tr key={recipe.id} isClickable onRowClick={() => navigate(`/recipes/${recipe.id.replace('r', '')}`)}>
                  <Td dataLabel="Name">{recipe.name}</Td>
                  <Td dataLabel="Scope Level">
                    <Label color={scopeColor[recipe.scope]} isCompact>{recipe.scope}</Label>
                  </Td>
                  <Td dataLabel="Description">{recipe.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>
          <Split hasGutter>
            <SplitItem>Archetype Associations</SplitItem>
            <SplitItem>
              <Label isCompact color="blue">{totalInheritedApps} applications inherit this agent</Label>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          {agent.archetypes.length === 0 ? (
            <Content component="p">No archetypes linked to this agent.</Content>
          ) : (
            <Table aria-label="Linked archetypes" variant="compact">
              <Thead>
                <Tr>
                  <Th>Archetype</Th>
                  <Th>Applications</Th>
                </Tr>
              </Thead>
              <Tbody>
                {agent.archetypes.map(arch => (
                  <Tr key={arch.id}>
                    <Td dataLabel="Archetype">{arch.name}</Td>
                    <Td dataLabel="Applications">{arch.appCount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <ExpandableSection
            toggleText={configExpanded ? 'Hide effective configuration' : 'Show effective configuration'}
            isExpanded={configExpanded}
            onToggle={(_e, expanded) => setConfigExpanded(expanded)}
          >
            <Divider style={{ marginBottom: 16 }} />
            <DescriptionList isHorizontal>
              <DescriptionListGroup>
                <DescriptionListTerm>Agent-level recipes</DescriptionListTerm>
                <DescriptionListDescription>
                  {agent.recipes.filter(r => r.scope === 'Agent').map(r => r.name).join(', ') || 'None'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Archetype-level recipes</DescriptionListTerm>
                <DescriptionListDescription>
                  {agent.recipes.filter(r => r.scope === 'Archetype').map(r => r.name).join(', ') || 'None'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Target-level recipes</DescriptionListTerm>
                <DescriptionListDescription>
                  {agent.recipes.filter(r => r.scope === 'Target').map(r => r.name).join(', ') || 'None'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Linked archetypes</DescriptionListTerm>
                <DescriptionListDescription>
                  {agent.archetypes.map(a => a.name).join(', ') || 'None'}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </ExpandableSection>
        </CardBody>
      </Card>

      {agent.recentRuns.length > 0 && (
        <Card>
          <CardTitle>Recent Migration Runs</CardTitle>
          <CardBody>
            <Table aria-label="Recent runs" variant="compact">
              <Thead>
                <Tr>
                  <Th>Plan</Th>
                  <Th>Status</Th>
                  <Th>Duration</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {agent.recentRuns.map(run => (
                  <Tr key={run.id} isClickable onRowClick={() => navigate('/migration-runs')}>
                    <Td dataLabel="Plan">{run.plan}</Td>
                    <Td dataLabel="Status">
                      <Label color={runStatusColor[run.status] || 'grey'} isCompact>{run.status}</Label>
                    </Td>
                    <Td dataLabel="Duration">{run.duration}</Td>
                    <Td dataLabel="Date">{run.date}</Td>
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
