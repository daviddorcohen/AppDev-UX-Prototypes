import React, { useState } from 'react'
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
  CodeBlock,
  CodeBlockCode,
  Alert,
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
import SyncAltIcon from '@patternfly/react-icons/dist/esm/icons/sync-alt-icon'
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon'

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  Agent: 'Applied globally to all migrations run by agents with this recipe attached.',
  Archetype: 'Applied to applications matching a specific archetype (e.g., Spring Boot, EJB).',
  Target: 'Applied when migrating to a specific target framework or runtime.',
  Application: 'Applied only to a specific application — the most granular level.',
}

const RECIPE_CONTENTS: Record<string, string> = {
  '1': `# Corporate Coding Standards

## Commit Conventions
- Use conventional commits format: \`type(scope): description\`
- Types: feat, fix, refactor, test, docs, chore
- Always reference the JIRA ticket in the commit body

## Code Documentation
- All public APIs must have JavaDoc / TSDoc
- Include @param, @returns, and @throws annotations
- Document non-obvious business logic with inline comments

## Testing Requirements
- Minimum 80% code coverage for new code
- Unit tests for all business logic
- Integration tests for API endpoints
- No test should depend on external services

## Code Style
- Follow language-specific linting rules (ESLint, Checkstyle)
- Maximum line length: 120 characters
- Use meaningful variable and function names
- Avoid deeply nested conditionals (max 3 levels)`,
  '2': `# Security Best Practices

## Credential Management
- NEVER hardcode credentials, tokens, or secrets in source code
- Use environment variables or a secrets manager (Vault, AWS Secrets Manager)
- Rotate credentials every 90 days

## Dependency Scanning
- Run OWASP dependency-check on every build
- No dependencies with known critical CVEs
- Pin dependency versions — no floating ranges

## Input Validation
- Validate all user inputs on the server side
- Use parameterized queries for all database access
- Sanitize HTML output to prevent XSS`,
  '3': `# Spring Boot 3.x Migration Guide

## Namespace Migration
- Replace all \`javax.*\` imports with \`jakarta.*\`
- Update persistence.xml and web.xml namespaces
- Migrate Spring Security from WebSecurityConfigurerAdapter to SecurityFilterChain

## Dependency Updates
- Spring Boot 3.x requires Java 17+
- Update spring-boot-starter-parent to 3.x
- Replace deprecated APIs with recommended alternatives

## Configuration Changes
- Migrate application.properties to use new property names
- Update actuator endpoint paths
- Review and update auto-configuration excludes`,
  '4': `# Quarkus Best Practices

## CDI Patterns
- Use @ApplicationScoped for stateless services
- Prefer constructor injection over field injection
- Use @ConfigProperty for configuration values

## MicroProfile Config
- Externalize all configuration via microprofile-config.properties
- Use profiles for environment-specific settings
- Support environment variable overrides

## Native Image Considerations
- Register reflection targets in reflect-config.json
- Avoid dynamic class loading where possible
- Test native builds in CI pipeline`,
  '5': `# Golang Coding Conventions

## Module Structure
- One module per repository
- Use internal/ for private packages
- Keep cmd/ for entry points

## Error Handling
- Always check errors — never use blank identifier
- Wrap errors with context using fmt.Errorf
- Use sentinel errors for expected failure modes

## Testing Standards
- Table-driven tests for multiple cases
- Use testify for assertions
- Mock external dependencies with interfaces`,
  '6': `# PF5-to-PF6 Migration Standards

## Component Migration
- Replace deprecated PF5 components with PF6 equivalents
- Update import paths from @patternfly/react-core/dist/esm to @patternfly/react-core
- Remove isFlat, isCompact props that have been deprecated

## Design Tokens
- Replace hardcoded colors with CSS custom properties
- Use --pf-v6-* token prefix instead of --pf-v5-*
- Update global CSS variable references

## Layout Changes
- Migrate from PageSection to Page layout components
- Update Toolbar and ToolbarContent usage
- Review and update Grid/Flex layouts for v6 API`,
  '7': `# Order Service Specifics

## Custom ORM Layer
- This application uses a custom ORM — do NOT replace with JPA
- Map custom @Entity annotations to the internal framework
- Preserve the existing query builder patterns

## API Versioning
- Maintain backward compatibility for v1 and v2 endpoints
- Use content negotiation for response format
- Document all breaking changes in CHANGELOG.md`,
}

const MOCK_RECIPES: Record<string, {
  name: string
  description: string
  repoUrl: string
  branchTag: string
  scope: string
  lastSynced: string
  usedByAgents: { id: string; name: string; archetype?: string }[]
}> = {
  '1': {
    name: 'Corporate Coding Standards',
    description: 'Commit conventions, code documentation, testing requirements, and code style guidelines for all migration agents.',
    repoUrl: 'https://github.com/acme/coding-standards',
    branchTag: 'v2.1.0',
    scope: 'Agent',
    lastSynced: '2026-05-18T14:30:00Z',
    usedByAgents: [
      { id: '1', name: 'Java Migration Agent' },
      { id: '2', name: 'Spring Boot Modernizer' },
      { id: '3', name: 'Legacy EJB Converter' },
      { id: '4', name: 'Quarkus Migration Agent' },
      { id: '5', name: 'Test Coverage Agent' },
      { id: '6', name: '.NET to Java Converter' },
    ],
  },
  '2': {
    name: 'Security Best Practices',
    description: 'No hardcoded credentials, dependency scanning, OWASP compliance, and input validation standards.',
    repoUrl: 'https://github.com/acme/security-recipes',
    branchTag: 'v1.5.2',
    scope: 'Agent',
    lastSynced: '2026-05-17T09:00:00Z',
    usedByAgents: [
      { id: '1', name: 'Java Migration Agent' },
      { id: '2', name: 'Spring Boot Modernizer' },
      { id: '3', name: 'Legacy EJB Converter' },
      { id: '6', name: '.NET to Java Converter' },
    ],
  },
  '3': {
    name: 'Spring Boot 3.x Migration Guide',
    description: 'javax→jakarta namespace migration, Spring Security 6.x patterns, and dependency update guidance.',
    repoUrl: 'https://github.com/acme/spring-migration',
    branchTag: 'v3.0.1',
    scope: 'Archetype',
    lastSynced: '2026-05-19T11:15:00Z',
    usedByAgents: [
      { id: '1', name: 'Java Migration Agent', archetype: 'Spring Boot Web App' },
      { id: '2', name: 'Spring Boot Modernizer', archetype: 'Spring Boot Web App' },
      { id: '3', name: 'Legacy EJB Converter', archetype: 'Legacy EJB Application' },
      { id: '6', name: '.NET to Java Converter', archetype: 'Spring Boot Web App' },
    ],
  },
  '4': {
    name: 'Quarkus Best Practices',
    description: 'CDI patterns, MicroProfile config, native image considerations for Quarkus migrations.',
    repoUrl: 'https://github.com/acme/quarkus-recipes',
    branchTag: 'v1.2.0',
    scope: 'Target',
    lastSynced: '2026-05-16T16:45:00Z',
    usedByAgents: [
      { id: '1', name: 'Java Migration Agent' },
      { id: '3', name: 'Legacy EJB Converter' },
      { id: '4', name: 'Quarkus Migration Agent' },
      { id: '6', name: '.NET to Java Converter' },
    ],
  },
  '5': {
    name: 'Golang Coding Conventions',
    description: 'Go module structure, error handling patterns, testing standards for Go-based migrations.',
    repoUrl: 'https://github.com/acme/go-conventions',
    branchTag: 'v1.0.0',
    scope: 'Agent',
    lastSynced: '2026-05-15T08:20:00Z',
    usedByAgents: [
      { id: '1', name: 'Java Migration Agent' },
      { id: '6', name: '.NET to Java Converter' },
    ],
  },
  '6': {
    name: 'PF5-to-PF6 Migration Standards',
    description: 'PatternFly component migration patterns and design token mapping for UI modernization.',
    repoUrl: 'https://github.com/acme/pf-migration',
    branchTag: 'v0.9.0',
    scope: 'Target',
    lastSynced: '2026-05-20T07:00:00Z',
    usedByAgents: [
      { id: '6', name: '.NET to Java Converter' },
    ],
  },
  '7': {
    name: 'Order Service Specifics',
    description: 'Application-specific rules for the order-service custom ORM and API versioning.',
    repoUrl: 'https://github.com/acme/order-service-rules',
    branchTag: 'v1.0.3',
    scope: 'Application',
    lastSynced: '2026-05-14T12:00:00Z',
    usedByAgents: [],
  },
}

const scopeColor: Record<string, 'blue' | 'green' | 'orange' | 'purple'> = {
  Agent: 'blue',
  Archetype: 'green',
  Target: 'orange',
  Application: 'purple',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

export function RecipeOverview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [syncing, setSyncing] = useState(false)

  const recipe = MOCK_RECIPES[id || ''] || MOCK_RECIPES['1']
  const content = RECIPE_CONTENTS[id || ''] || RECIPE_CONTENTS['1']

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 1500)
  }

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Button variant="link" icon={<ArrowLeftIcon />} onClick={() => navigate('/recipes')}>
              Back to Recipes
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Split hasGutter>
              <SplitItem>
                <Title headingLevel="h1">{recipe.name}</Title>
              </SplitItem>
              <SplitItem>
                <Label color={scopeColor[recipe.scope]}>{recipe.scope}</Label>
              </SplitItem>
            </Split>
          </ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Button variant="primary" icon={<PencilAltIcon />} onClick={() => navigate(`/recipes/${id}/edit`)}>
                Edit
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="secondary" icon={<SyncAltIcon />} isLoading={syncing} onClick={handleSync} isDisabled={syncing}>
                {syncing ? 'Syncing...' : 'Sync now'}
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="danger" onClick={() => navigate('/recipes')}>Delete</Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Card>
        <CardTitle>Recipe Details</CardTitle>
        <CardBody>
          <DescriptionList isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>Name</DescriptionListTerm>
              <DescriptionListDescription>{recipe.name}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Description</DescriptionListTerm>
              <DescriptionListDescription>{recipe.description}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Scope Level</DescriptionListTerm>
              <DescriptionListDescription>
                <Split hasGutter>
                  <SplitItem>
                    <Label color={scopeColor[recipe.scope]}>{recipe.scope}</Label>
                  </SplitItem>
                  <SplitItem>
                    <Content component="small">{SCOPE_DESCRIPTIONS[recipe.scope]}</Content>
                  </SplitItem>
                </Split>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Repository URL</DescriptionListTerm>
              <DescriptionListDescription>
                <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end" component="a" href={recipe.repoUrl} target="_blank">
                  {recipe.repoUrl}
                </Button>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Branch / Tag</DescriptionListTerm>
              <DescriptionListDescription>
                <Label isCompact>{recipe.branchTag}</Label>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Last Synced</DescriptionListTerm>
              <DescriptionListDescription>
                <Split hasGutter>
                  <SplitItem>{formatDate(recipe.lastSynced)}</SplitItem>
                  <SplitItem>
                    <Content component="small">({relativeTime(recipe.lastSynced)})</Content>
                  </SplitItem>
                </Split>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Content Preview</CardTitle>
        <CardBody>
          <Alert variant="info" isInline isPlain title={`Showing content from ${recipe.branchTag}`} style={{ marginBottom: 12 }} />
          <CodeBlock>
            <CodeBlockCode>{content}</CodeBlockCode>
          </CodeBlock>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>
          <Split hasGutter>
            <SplitItem>Usage / Where Used</SplitItem>
            <SplitItem>
              <Label isCompact color="blue">Used by {recipe.usedByAgents.length} agent{recipe.usedByAgents.length !== 1 ? 's' : ''}</Label>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          {recipe.usedByAgents.length === 0 ? (
            <Content component="p">This recipe is not currently used by any agents.</Content>
          ) : (
            <Table aria-label="Agents using this recipe" variant="compact">
              <Thead>
                <Tr>
                  <Th>Agent</Th>
                  <Th>Archetype</Th>
                </Tr>
              </Thead>
              <Tbody>
                {recipe.usedByAgents.map(agent => (
                  <Tr key={agent.id} isClickable onRowClick={() => navigate(`/agents/${agent.id}`)}>
                    <Td dataLabel="Agent">{agent.name}</Td>
                    <Td dataLabel="Archetype">{agent.archetype || '—'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Stack>
  )
}
