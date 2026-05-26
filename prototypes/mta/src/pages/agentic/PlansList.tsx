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
  Spinner,
  Split,
  SplitItem,
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

type PlanStatus = 'Draft' | 'Ready' | 'Running' | 'Completed' | 'Failed'

type Plan = {
  id: string
  name: string
  agent: string
  targetApps: number
  stages: number
  status: PlanStatus
}

const MOCK_PLANS: Plan[] = [
  { id: '1', name: 'EAP6 to Quarkus Migration', agent: 'Java Migration Agent', targetApps: 12, stages: 3, status: 'Running' },
  { id: '2', name: 'Spring Boot 2 → 3 Upgrade', agent: 'Spring Boot Modernizer', targetApps: 42, stages: 2, status: 'Completed' },
  { id: '3', name: 'Fix Critical Analysis Issues', agent: 'Java Migration Agent', targetApps: 8, stages: 1, status: 'Ready' },
  { id: '4', name: 'Legacy EJB Containerization', agent: 'Legacy EJB Converter', targetApps: 18, stages: 4, status: 'Draft' },
  { id: '5', name: 'Quarkus Native Build Prep', agent: 'Quarkus Migration Agent', targetApps: 25, stages: 2, status: 'Failed' },
  { id: '6', name: 'Add Unit Test Coverage', agent: 'Test Coverage Agent', targetApps: 50, stages: 1, status: 'Draft' },
]

const statusConfig: Record<PlanStatus, { color: 'grey' | 'blue' | 'green' | 'red'; showSpinner?: boolean }> = {
  Draft: { color: 'grey' },
  Ready: { color: 'blue' },
  Running: { color: 'blue', showSpinner: true },
  Completed: { color: 'green' },
  Failed: { color: 'red' },
}

export function PlansList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [nameFilter, setNameFilter] = useState('')

  const filtered = useMemo(() => {
    let result = [...MOCK_PLANS]
    if (nameFilter) {
      const lower = nameFilter.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(lower))
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

  const getRowActions = useCallback((plan: Plan): IAction[] => [
    { title: 'Run plan', onClick: () => navigate('/migration-runs'), isDisabled: plan.status === 'Running' },
    { title: 'Edit', onClick: () => navigate(`/plans/${plan.id}/edit`) },
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
            <Title headingLevel="h1">Migration Plans</Title>
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
              <Button variant="primary" icon={<PlusIcon />} onClick={() => navigate('/plans/new')}>
                Create plan
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      {filtered.length === 0 ? (
        <Bullseye>
          <EmptyState titleText="No migration plans created" headingLevel="h2" icon={CubesIcon}>
            <EmptyStateBody>
              Create a migration plan to define what agents should accomplish.
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="primary" onClick={() => navigate('/plans/new')}>Create plan</Button>
            </EmptyStateActions>
          </EmptyState>
        </Bullseye>
      ) : (
        <>
          {pagination('top')}
          <Table aria-label="Plans table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Agent</Th>
                <Th>Target Apps</Th>
                <Th>Stages</Th>
                <Th>Status</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {paginated.map(plan => {
                const cfg = statusConfig[plan.status]
                return (
                  <Tr key={plan.id} isClickable onRowClick={(event) => {
                    if ((event?.target as HTMLElement).closest('td.pf-v6-c-table__action')) return
                    navigate(`/plans/${plan.id}`)
                  }}>
                    <Td dataLabel="Name" modifier="breakWord">{plan.name}</Td>
                    <Td dataLabel="Agent">{plan.agent}</Td>
                    <Td dataLabel="Target Apps">{plan.targetApps}</Td>
                    <Td dataLabel="Stages">{plan.stages}</Td>
                    <Td dataLabel="Status">
                      <Split hasGutter>
                        <SplitItem>
                          <Label color={cfg.color}>{plan.status}</Label>
                        </SplitItem>
                        {cfg.showSpinner && <SplitItem><Spinner size="sm" /></SplitItem>}
                      </Split>
                    </Td>
                    <Td isActionCell>
                      <ActionsColumn items={getRowActions(plan)} />
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
          {pagination('bottom')}
        </>
      )}
    </Stack>
  )
}
