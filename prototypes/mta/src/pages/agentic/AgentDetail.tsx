import React, { useState } from 'react'
import {
  Title,
  Stack,
  StackItem,
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  FormSelect,
  FormSelectOption,
  ActionGroup,
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
  Checkbox,
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

const PROVIDER_MODELS: Record<string, string[]> = {
  Anthropic: ['claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'claude-3.5-haiku-20241022'],
  OpenAI: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'gpt-4-turbo'],
  Ollama: ['llama-3.1-70b', 'llama-3.1-8b', 'codellama-34b', 'mistral-7b'],
  Custom: [],
}

const MODEL_PROVIDERS = Object.keys(PROVIDER_MODELS)

const AVAILABLE_RECIPES = [
  { id: 'r1', name: 'Corporate Coding Standards', scope: 'Agent', description: 'Commit conventions, code documentation, testing requirements' },
  { id: 'r2', name: 'Security Best Practices', scope: 'Agent', description: 'No hardcoded credentials, dependency scanning, OWASP compliance' },
  { id: 'r3', name: 'Spring Boot 3.x Migration Guide', scope: 'Archetype', description: 'javax→jakarta namespace, Spring Security 6.x patterns' },
  { id: 'r4', name: 'Quarkus Best Practices', scope: 'Target', description: 'CDI patterns, MicroProfile config, native image considerations' },
  { id: 'r5', name: 'Golang Coding Conventions', scope: 'Agent', description: 'Go module structure, error handling patterns, testing standards' },
  { id: 'r6', name: 'PF5-to-PF6 Migration Standards', scope: 'Target', description: 'PatternFly component migration patterns and design token mapping' },
]

const AVAILABLE_ARCHETYPES = [
  { id: 'a1', name: 'Spring Boot Web App', appCount: 42 },
  { id: 'a2', name: 'Legacy EJB Application', appCount: 18 },
  { id: 'a3', name: 'Microservice (Quarkus)', appCount: 25 },
  { id: 'a4', name: 'Batch Processing Job', appCount: 7 },
]

const EXISTING_CREDENTIALS = ['aws-prod-key', 'anthropic-api-key', 'openai-org-token', 'ollama-local']

const scopeColor: Record<string, 'blue' | 'green' | 'orange' | 'purple'> = {
  Agent: 'blue',
  Archetype: 'green',
  Target: 'orange',
  Application: 'purple',
}

export function AgentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [name, setName] = useState(isNew ? '' : 'Java Migration Agent')
  const [description, setDescription] = useState(isNew ? '' : 'General-purpose agent for migrating Java applications across frameworks and runtimes.')
  const [definition, setDefinition] = useState(isNew ? '' : 'You are a Java migration expert. Your mission is to modernize legacy Java applications to cloud-native frameworks while maintaining functional correctness, test coverage, and adherence to corporate coding standards.')
  const [provider, setProvider] = useState('Anthropic')
  const [modelName, setModelName] = useState(isNew ? '' : 'claude-sonnet-4-20250514')

  const handleProviderChange = (_e: React.FormEvent<HTMLSelectElement>, v: string) => {
    setProvider(v)
    const models = PROVIDER_MODELS[v] || []
    setModelName(models.length > 0 ? models[0] : '')
  }
  const [credentials, setCredentials] = useState(isNew ? '' : 'anthropic-api-key')
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>(isNew ? [] : ['r1', 'r2', 'r3'])
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>(isNew ? [] : ['a1', 'a2'])

  const toggleRecipe = (id: string) => {
    setSelectedRecipes(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id])
  }

  const toggleArchetype = (id: string) => {
    setSelectedArchetypes(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const totalInheritedApps = AVAILABLE_ARCHETYPES
    .filter(a => selectedArchetypes.includes(a.id))
    .reduce((sum, a) => sum + a.appCount, 0)

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
            <Title headingLevel="h1">{isNew ? 'Create agent' : name}</Title>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Card>
        <CardTitle>Basic Information</CardTitle>
        <CardBody>
          <Form>
            <FormGroup label="Name" isRequired fieldId="agent-name">
              <TextInput id="agent-name" isRequired value={name} onChange={(_e, v) => setName(v)} placeholder="e.g., Java Migration Agent" />
            </FormGroup>
            <FormGroup label="Description" fieldId="agent-description">
              <TextInput id="agent-description" value={description} onChange={(_e, v) => setDescription(v)} placeholder="Purpose and scope of this agent" />
            </FormGroup>
            <FormGroup label="Definition / Mission" fieldId="agent-definition">
              <TextArea id="agent-definition" value={definition} onChange={(_e, v) => setDefinition(v)} rows={5} placeholder="You are a migration expert. Your mission is to..." />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Model Configuration</CardTitle>
        <CardBody>
          <Form>
            <FormGroup label="Provider" isRequired fieldId="model-provider">
              <FormSelect id="model-provider" value={provider} onChange={handleProviderChange}>
                {MODEL_PROVIDERS.map(p => <FormSelectOption key={p} value={p} label={p} />)}
              </FormSelect>
            </FormGroup>
            <FormGroup label="Model" isRequired fieldId="model-name">
              {(PROVIDER_MODELS[provider] || []).length > 0 ? (
                <FormSelect id="model-name" value={modelName} onChange={(_e, v) => setModelName(v)}>
                  {PROVIDER_MODELS[provider].map(m => <FormSelectOption key={m} value={m} label={m} />)}
                </FormSelect>
              ) : (
                <TextInput id="model-name" isRequired value={modelName} onChange={(_e, v) => setModelName(v)} placeholder="Enter model name or endpoint URL" />
              )}
            </FormGroup>
            <FormGroup label="Credentials" fieldId="model-credentials">
              <FormSelect id="model-credentials" value={credentials} onChange={(_e, v) => setCredentials(v)}>
                <FormSelectOption value="" label="-- Select credentials --" />
                {EXISTING_CREDENTIALS.map(c => <FormSelectOption key={c} value={c} label={c} />)}
              </FormSelect>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>
          <Split hasGutter>
            <SplitItem>Guidelines / Recipes</SplitItem>
            <SplitItem>
              <Label isCompact>{selectedRecipes.length} selected</Label>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          <Table aria-label="Available recipes" variant="compact">
            <Thead>
              <Tr>
                <Th screenReaderText="Select" />
                <Th>Name</Th>
                <Th>Scope Level</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {AVAILABLE_RECIPES.map(recipe => (
                <Tr key={recipe.id}>
                  <Td select={{ rowIndex: 0, onSelect: () => toggleRecipe(recipe.id), isSelected: selectedRecipes.includes(recipe.id) }} />
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
              <Label isCompact color="blue">{totalInheritedApps} applications will inherit this agent</Label>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          <Stack hasGutter>
            {AVAILABLE_ARCHETYPES.map(archetype => (
              <Checkbox
                key={archetype.id}
                id={`arch-${archetype.id}`}
                label={`${archetype.name} (${archetype.appCount} applications)`}
                isChecked={selectedArchetypes.includes(archetype.id)}
                onChange={() => toggleArchetype(archetype.id)}
              />
            ))}
          </Stack>
        </CardBody>
      </Card>

      {!isNew && (
        <Card>
          <CardTitle>Effective Configuration Preview</CardTitle>
          <CardBody>
            <DescriptionList isHorizontal>
              <DescriptionListGroup>
                <DescriptionListTerm>Agent</DescriptionListTerm>
                <DescriptionListDescription>{name}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Model</DescriptionListTerm>
                <DescriptionListDescription>{provider} / {modelName}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Agent-level recipes</DescriptionListTerm>
                <DescriptionListDescription>
                  {AVAILABLE_RECIPES.filter(r => selectedRecipes.includes(r.id) && r.scope === 'Agent').map(r => r.name).join(', ') || 'None'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Archetype-level recipes</DescriptionListTerm>
                <DescriptionListDescription>
                  {AVAILABLE_RECIPES.filter(r => selectedRecipes.includes(r.id) && r.scope === 'Archetype').map(r => r.name).join(', ') || 'None'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Target-level recipes</DescriptionListTerm>
                <DescriptionListDescription>
                  {AVAILABLE_RECIPES.filter(r => selectedRecipes.includes(r.id) && r.scope === 'Target').map(r => r.name).join(', ') || 'None'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Linked archetypes</DescriptionListTerm>
                <DescriptionListDescription>
                  {AVAILABLE_ARCHETYPES.filter(a => selectedArchetypes.includes(a.id)).map(a => a.name).join(', ') || 'None'}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      )}

      <StackItem>
        <Form>
          <ActionGroup>
            <Button variant="primary" onClick={() => navigate('/agents')}>
              {isNew ? 'Create' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/agents')}>
              Save &amp; close
            </Button>
            <Button variant="link" onClick={() => navigate('/agents')}>Cancel</Button>
          </ActionGroup>
        </Form>
      </StackItem>
    </Stack>
  )
}
