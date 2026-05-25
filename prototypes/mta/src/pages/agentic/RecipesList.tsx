import React, { useMemo, useState, useCallback } from 'react'
import {
  Title,
  Stack,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Pagination,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Bullseye,
  SearchInput,
  Label,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ActionsColumn,
  type IAction,
} from '@patternfly/react-table'
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon'
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon'
import { useNavigate } from 'react-router-dom'

type Recipe = {
  id: string
  name: string
  repoUrl: string
  scopeLevel: 'Agent' | 'Archetype' | 'Target' | 'Application'
  versionTag: string
  lastSynced: string
}

const MOCK_RECIPES: Recipe[] = [
  { id: '1', name: 'Corporate Coding Standards', repoUrl: 'https://github.com/acme/coding-standards', scopeLevel: 'Agent', versionTag: 'v2.1.0', lastSynced: '2026-05-18T14:30:00Z' },
  { id: '2', name: 'Security Best Practices', repoUrl: 'https://github.com/acme/security-recipes', scopeLevel: 'Agent', versionTag: 'v1.5.2', lastSynced: '2026-05-17T09:00:00Z' },
  { id: '3', name: 'Spring Boot 3.x Migration Guide', repoUrl: 'https://github.com/acme/spring-migration', scopeLevel: 'Archetype', versionTag: 'v3.0.1', lastSynced: '2026-05-19T11:15:00Z' },
  { id: '4', name: 'Quarkus Best Practices', repoUrl: 'https://github.com/acme/quarkus-recipes', scopeLevel: 'Target', versionTag: 'v1.2.0', lastSynced: '2026-05-16T16:45:00Z' },
  { id: '5', name: 'Golang Coding Conventions', repoUrl: 'https://github.com/acme/go-conventions', scopeLevel: 'Agent', versionTag: 'v1.0.0', lastSynced: '2026-05-15T08:20:00Z' },
  { id: '6', name: 'PF5-to-PF6 Migration Standards', repoUrl: 'https://github.com/acme/pf-migration', scopeLevel: 'Target', versionTag: 'v0.9.0', lastSynced: '2026-05-20T07:00:00Z' },
  { id: '7', name: 'Order Service Specifics', repoUrl: 'https://github.com/acme/order-service-rules', scopeLevel: 'Application', versionTag: 'v1.0.3', lastSynced: '2026-05-14T12:00:00Z' },
]

const scopeColor: Record<string, 'blue' | 'green' | 'orange' | 'purple'> = {
  Agent: 'blue',
  Archetype: 'green',
  Target: 'orange',
  Application: 'purple',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function RecipesList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [nameFilter, setNameFilter] = useState('')

  const filtered = useMemo(() => {
    let result = [...MOCK_RECIPES]
    if (nameFilter) {
      const lower = nameFilter.toLowerCase()
      result = result.filter(r => r.name.toLowerCase().includes(lower))
    }
    result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [nameFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const onSetPage = useCallback((_: unknown, p: number) => setPage(p), [])
  const onPerPageSelect = useCallback((_: unknown, pp: number) => { setPerPage(pp); setPage(1) }, [])

  const getRowActions = useCallback((recipe: Recipe): IAction[] => [
    { title: 'Edit', onClick: () => navigate(`/recipes/${recipe.id}`) },
    { title: 'Sync now', onClick: () => {} },
    { isSeparator: true },
    { title: 'Delete', onClick: () => {}, isDanger: true },
  ], [navigate])

  const pagination = (variant: 'top' | 'bottom') => (
    <Pagination
      itemCount={filtered.length}
      page={page}
      perPage={perPage}
      onSetPage={onSetPage}
      onPerPageSelect={onPerPageSelect}
      variant={variant}
    />
  )

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Title headingLevel="h1">Recipes</Title>
          </ToolbarItem>
          <ToolbarItem>
            <SearchInput
              placeholder="Filter by name"
              value={nameFilter}
              onChange={(_e, val) => { setNameFilter(val); setPage(1) }}
              onClear={() => { setNameFilter(''); setPage(1) }}
              aria-label="Filter by name"
            />
          </ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Button variant="primary" icon={<PlusIcon />} onClick={() => navigate('/recipes/new')}>
                Create recipe
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      {filtered.length === 0 ? (
        <Bullseye>
          <EmptyState titleText="No recipes defined" headingLevel="h2" icon={CubesIcon}>
            <EmptyStateBody>
              Create a recipe to define guidelines and standards for agents.
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="primary" onClick={() => navigate('/recipes/new')}>Create recipe</Button>
            </EmptyStateActions>
          </EmptyState>
        </Bullseye>
      ) : (
        <>
          {pagination('top')}
          <Table aria-label="Recipes table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Repository URL</Th>
                <Th>Scope Level</Th>
                <Th>Version / Tag</Th>
                <Th>Last Synced</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {paginated.map(recipe => (
                <Tr key={recipe.id} isClickable onRowClick={() => navigate(`/recipes/${recipe.id}`)}>
                  <Td dataLabel="Name" modifier="breakWord">{recipe.name}</Td>
                  <Td dataLabel="Repository URL" modifier="truncate" style={{ maxWidth: 260 }}>{recipe.repoUrl}</Td>
                  <Td dataLabel="Scope Level">
                    <Label color={scopeColor[recipe.scopeLevel]} isCompact>{recipe.scopeLevel}</Label>
                  </Td>
                  <Td dataLabel="Version / Tag">{recipe.versionTag}</Td>
                  <Td dataLabel="Last Synced">{formatDate(recipe.lastSynced)}</Td>
                  <Td isActionCell>
                    <ActionsColumn items={getRowActions(recipe)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {pagination('bottom')}
        </>
      )}
    </Stack>
  )
}
