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

type Agent = {
  id: string
  name: string
  model: string
  provider: string
  recipesCount: number
  archetypesCount: number
  status: 'Active' | 'Draft' | 'Disabled'
}

const MOCK_AGENTS: Agent[] = [
  { id: '1', name: 'Java Migration Agent', model: 'claude-sonnet-4-20250514', provider: 'Anthropic', recipesCount: 5, archetypesCount: 3, status: 'Active' },
  { id: '2', name: 'Spring Boot Modernizer', model: 'gpt-4o', provider: 'OpenAI', recipesCount: 3, archetypesCount: 2, status: 'Active' },
  { id: '3', name: 'Legacy EJB Converter', model: 'claude-sonnet-4-20250514', provider: 'Anthropic', recipesCount: 4, archetypesCount: 1, status: 'Draft' },
  { id: '4', name: 'Quarkus Migration Agent', model: 'llama-3.1-70b', provider: 'Ollama', recipesCount: 2, archetypesCount: 2, status: 'Active' },
  { id: '5', name: 'Test Coverage Agent', model: 'gpt-4o-mini', provider: 'OpenAI', recipesCount: 1, archetypesCount: 0, status: 'Disabled' },
  { id: '6', name: '.NET to Java Converter', model: 'claude-opus-4-20250514', provider: 'Anthropic', recipesCount: 6, archetypesCount: 1, status: 'Draft' },
]

const statusColor: Record<string, 'green' | 'blue' | 'grey'> = {
  Active: 'green',
  Draft: 'blue',
  Disabled: 'grey',
}

export function AgentsList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [nameFilter, setNameFilter] = useState('')

  const filtered = useMemo(() => {
    let result = [...MOCK_AGENTS]
    if (nameFilter) {
      const lower = nameFilter.toLowerCase()
      result = result.filter(a => a.name.toLowerCase().includes(lower))
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

  const getRowActions = useCallback((agent: Agent): IAction[] => [
    { title: 'Edit', onClick: () => navigate(`/agents/${agent.id}/edit`) },
    { title: 'Duplicate', onClick: () => {} },
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
            <Title headingLevel="h1">Agents</Title>
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
              <Button variant="primary" icon={<PlusIcon />} onClick={() => navigate('/agents/new')}>
                Create agent
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      {filtered.length === 0 ? (
        <Bullseye>
          <EmptyState titleText="No agents have been created" headingLevel="h2" icon={CubesIcon}>
            <EmptyStateBody>
              Create an agent to define how migrations are performed.
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="primary" onClick={() => navigate('/agents/new')}>Create agent</Button>
            </EmptyStateActions>
          </EmptyState>
        </Bullseye>
      ) : (
        <>
          {pagination('top')}
          <Table aria-label="Agents table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Model</Th>
                <Th>Recipes</Th>
                <Th>Linked Archetypes</Th>
                <Th>Status</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {paginated.map(agent => (
                <Tr key={agent.id} isClickable onRowClick={(event) => {
                  if ((event?.target as HTMLElement).closest('td.pf-v6-c-table__action')) return
                  navigate(`/agents/${agent.id}`)
                }}>
                  <Td dataLabel="Name" modifier="breakWord">{agent.name}</Td>
                  <Td dataLabel="Model">{agent.provider} / {agent.model}</Td>
                  <Td dataLabel="Recipes">{agent.recipesCount}</Td>
                  <Td dataLabel="Linked Archetypes">{agent.archetypesCount}</Td>
                  <Td dataLabel="Status">
                    <Label color={statusColor[agent.status]}>{agent.status}</Label>
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn items={getRowActions(agent)} />
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
