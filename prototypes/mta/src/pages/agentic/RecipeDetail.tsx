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
  Label,
  Split,
  SplitItem,
  Content,
  CodeBlock,
  CodeBlockCode,
  Alert,
} from '@patternfly/react-core'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowLeftIcon from '@patternfly/react-icons/dist/esm/icons/arrow-left-icon'
import SyncAltIcon from '@patternfly/react-icons/dist/esm/icons/sync-alt-icon'

const SCOPE_LEVELS = ['Agent', 'Archetype', 'Target', 'Application']

const PREVIEW_CONTENT = `# Corporate Coding Standards

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
- Avoid deeply nested conditionals (max 3 levels)
`

export function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [name, setName] = useState(isNew ? '' : 'Corporate Coding Standards')
  const [description, setDescription] = useState(isNew ? '' : 'Commit conventions, code documentation, testing requirements, and code style guidelines for all migration agents.')
  const [repoUrl, setRepoUrl] = useState(isNew ? '' : 'https://github.com/acme/coding-standards')
  const [branchTag, setBranchTag] = useState(isNew ? '' : 'v2.1.0')
  const [scope, setScope] = useState(isNew ? 'Agent' : 'Agent')
  const [syncing, setSyncing] = useState(false)
  const lastSynced = isNew ? null : 'May 18, 2026, 02:30 PM'

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
            <Title headingLevel="h1">{isNew ? 'Create recipe' : name}</Title>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Card>
        <CardTitle>Recipe Details</CardTitle>
        <CardBody>
          <Form>
            <FormGroup label="Name" isRequired fieldId="recipe-name">
              <TextInput id="recipe-name" isRequired value={name} onChange={(_e, v) => setName(v)} placeholder="e.g., Corporate Coding Standards" />
            </FormGroup>
            <FormGroup label="Description" fieldId="recipe-description">
              <TextArea id="recipe-description" value={description} onChange={(_e, v) => setDescription(v)} rows={3} placeholder="What standards/rules this recipe defines" />
            </FormGroup>
            <FormGroup label="Repository URL" isRequired fieldId="recipe-repo">
              <TextInput id="recipe-repo" isRequired value={repoUrl} onChange={(_e, v) => setRepoUrl(v)} placeholder="https://github.com/org/repo" />
            </FormGroup>
            <FormGroup label="Branch / Tag" isRequired fieldId="recipe-branch">
              <TextInput id="recipe-branch" isRequired value={branchTag} onChange={(_e, v) => setBranchTag(v)} placeholder="e.g., v1.0.0, main, release/2.x" />
            </FormGroup>
            <FormGroup label="Scope Level" isRequired fieldId="recipe-scope">
              <FormSelect id="recipe-scope" value={scope} onChange={(_e, v) => setScope(v)}>
                {SCOPE_LEVELS.map(s => <FormSelectOption key={s} value={s} label={s} />)}
              </FormSelect>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>

      {!isNew && (
        <Card>
          <CardTitle>
            <Split hasGutter>
              <SplitItem>Sync Status</SplitItem>
              <SplitItem>
                <Button variant="secondary" icon={<SyncAltIcon />} isLoading={syncing} onClick={handleSync} isDisabled={syncing}>
                  {syncing ? 'Syncing...' : 'Sync now'}
                </Button>
              </SplitItem>
            </Split>
          </CardTitle>
          <CardBody>
            {lastSynced && (
              <Alert variant="success" isInline isPlain title={`Last synced: ${lastSynced}`} />
            )}
          </CardBody>
        </Card>
      )}

      {!isNew && (
        <Card>
          <CardTitle>Content Preview</CardTitle>
          <CardBody>
            <Content component="small" style={{ marginBottom: 8 }}>
              Read-only preview of the repository content at <Label isCompact>{branchTag}</Label>
            </Content>
            <CodeBlock>
              <CodeBlockCode>{PREVIEW_CONTENT}</CodeBlockCode>
            </CodeBlock>
          </CardBody>
        </Card>
      )}

      <StackItem>
        <ActionGroup>
          <Button variant="primary" onClick={() => navigate('/recipes')}>Save</Button>
          <Button variant="link" onClick={() => navigate('/recipes')}>Cancel</Button>
        </ActionGroup>
      </StackItem>
    </Stack>
  )
}
