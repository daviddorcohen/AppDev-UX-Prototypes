import React, { useMemo, useState, useCallback } from 'react'
import {
  Title,
  Stack,
  StackItem,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Pagination,
  SearchInput,
  Label,
  Spinner,
  Split,
  SplitItem,
  FormSelect,
  FormSelectOption,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ActionsColumn,
  ExpandableRowContent,
  type IAction,
} from '@patternfly/react-table'
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon'

type RunStatus = 'Pending' | 'Running' | 'Succeeded' | 'Failed'

type MigrationRun = {
  id: string
  plan: string
  application: string
  agent: string
  status: RunStatus
  started: string
  duration: string
  prLink: string | null
  stagesCompleted: number
  stagesTotal: number
  issuesFixed: number
  kbEntries: number
  costEstimate: string
}

const MOCK_RUNS: MigrationRun[] = [
  { id: 'R-001', plan: 'EAP6 to Quarkus Migration', application: 'order-service', agent: 'Java Migration Agent', status: 'Succeeded', started: '2026-05-20T08:00:00Z', duration: '12m 34s', prLink: 'https://github.com/acme/order-service/pull/142', stagesCompleted: 3, stagesTotal: 3, issuesFixed: 24, kbEntries: 6, costEstimate: '$2.40' },
  { id: 'R-002', plan: 'EAP6 to Quarkus Migration', application: 'payment-gateway', agent: 'Java Migration Agent', status: 'Running', started: '2026-05-20T08:05:00Z', duration: '8m 12s', prLink: null, stagesCompleted: 2, stagesTotal: 3, issuesFixed: 18, kbEntries: 4, costEstimate: '$1.80' },
  { id: 'R-003', plan: 'EAP6 to Quarkus Migration', application: 'customer-portal', agent: 'Java Migration Agent', status: 'Pending', started: '-', duration: '-', prLink: null, stagesCompleted: 0, stagesTotal: 3, issuesFixed: 0, kbEntries: 0, costEstimate: '-' },
  { id: 'R-004', plan: 'Spring Boot 2 → 3 Upgrade', application: 'user-auth', agent: 'Spring Boot Modernizer', status: 'Succeeded', started: '2026-05-19T14:00:00Z', duration: '6m 48s', prLink: 'https://github.com/acme/user-auth/pull/89', stagesCompleted: 2, stagesTotal: 2, issuesFixed: 15, kbEntries: 3, costEstimate: '$0.90' },
  { id: 'R-005', plan: 'Spring Boot 2 → 3 Upgrade', application: 'shipping-tracker', agent: 'Spring Boot Modernizer', status: 'Failed', started: '2026-05-19T14:10:00Z', duration: '3m 22s', prLink: null, stagesCompleted: 1, stagesTotal: 2, issuesFixed: 8, kbEntries: 1, costEstimate: '$0.45' },
  { id: 'R-006', plan: 'Fix Critical Analysis Issues', application: 'inventory-manager', agent: 'Java Migration Agent', status: 'Succeeded', started: '2026-05-18T10:00:00Z', duration: '4m 56s', prLink: 'https://github.com/acme/inventory-manager/pull/67', stagesCompleted: 1, stagesTotal: 1, issuesFixed: 11, kbEntries: 2, costEstimate: '$0.60' },
  { id: 'R-007', plan: 'EAP6 to Quarkus Migration', application: 'notification-service', agent: 'Java Migration Agent', status: 'Running', started: '2026-05-20T08:10:00Z', duration: '5m 30s', prLink: null, stagesCompleted: 1, stagesTotal: 3, issuesFixed: 7, kbEntries: 2, costEstimate: '$0.80' },
]

const statusConfig: Record<RunStatus, { color: 'grey' | 'blue' | 'green' | 'red'; showSpinner?: boolean }> = {
  Pending: { color: 'grey' },
  Running: { color: 'blue', showSpinner: true },
  Succeeded: { color: 'green' },
  Failed: { color: 'red' },
}

function formatDate(iso: string) {
  if (iso === '-') return '-'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function MigrationRuns() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchFilter, setSearchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  const filtered = useMemo(() => {
    let result = [...MOCK_RUNS]
    if (searchFilter) {
      const lower = searchFilter.toLowerCase()
      result = result.filter(r => r.application.toLowerCase().includes(lower) || r.plan.toLowerCase().includes(lower) || r.id.toLowerCase().includes(lower))
    }
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter)
    }
    return result
  }, [searchFilter, statusFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const onSetPage = useCallback((_: unknown, p: number) => setPage(p), [])
  const onPerPageSelect = useCallback((_: unknown, pp: number) => { setPerPage(pp); setPage(1) }, [])

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id])
  }

  const getRowActions = useCallback((run: MigrationRun): IAction[] => [
    { title: 'View logs', onClick: () => {} },
    ...(run.status === 'Running' ? [{ title: 'Cancel', onClick: () => {}, isDanger: true as const }] : []),
    ...(run.status === 'Failed' ? [{ title: 'Re-run', onClick: () => {} }] : []),
  ], [])

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <StackItem>
        <Title headingLevel="h1">Migration Runs</Title>
      </StackItem>

      <StackItem>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchInput
                placeholder="Search by ID, app, or plan"
                value={searchFilter}
                onChange={(_e, val) => { setSearchFilter(val); setPage(1) }}
                onClear={() => { setSearchFilter(''); setPage(1) }}
                aria-label="Search"
              />
            </ToolbarItem>
            <ToolbarItem>
              <FormSelect value={statusFilter} onChange={(_e, v) => { setStatusFilter(v); setPage(1) }} aria-label="Filter by status" style={{ minWidth: 160 }}>
                <FormSelectOption value="all" label="All statuses" />
                <FormSelectOption value="Pending" label="Pending" />
                <FormSelectOption value="Running" label="Running" />
                <FormSelectOption value="Succeeded" label="Succeeded" />
                <FormSelectOption value="Failed" label="Failed" />
              </FormSelect>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </StackItem>

      <StackItem>
        <Pagination
          itemCount={filtered.length}
          page={page}
          perPage={perPage}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          variant="top"
        />
        <Table aria-label="Migration runs table">
          <Thead>
            <Tr>
              <Th screenReaderText="Expand" />
              <Th>ID</Th>
              <Th>Plan</Th>
              <Th>Application</Th>
              <Th>Agent</Th>
              <Th>Status</Th>
              <Th>Started</Th>
              <Th>Duration</Th>
              <Th>PR</Th>
              <Th screenReaderText="Actions" />
            </Tr>
          </Thead>
          {paginated.map((run, rowIndex) => {
            const isExpanded = expandedRows.includes(run.id)
            const cfg = statusConfig[run.status]
            return (
              <Tbody key={run.id} isExpanded={isExpanded}>
                <Tr>
                  <Td expand={{ rowIndex, isExpanded, onToggle: () => toggleExpand(run.id) }} />
                  <Td dataLabel="ID">{run.id}</Td>
                  <Td dataLabel="Plan">{run.plan}</Td>
                  <Td dataLabel="Application">{run.application}</Td>
                  <Td dataLabel="Agent">{run.agent}</Td>
                  <Td dataLabel="Status">
                    <Split hasGutter>
                      <SplitItem><Label color={cfg.color}>{run.status}</Label></SplitItem>
                      {cfg.showSpinner && <SplitItem><Spinner size="sm" /></SplitItem>}
                    </Split>
                  </Td>
                  <Td dataLabel="Started">{formatDate(run.started)}</Td>
                  <Td dataLabel="Duration">{run.duration}</Td>
                  <Td dataLabel="PR">
                    {run.prLink ? (
                      <Button variant="link" component="a" href={run.prLink} target="_blank" icon={<ExternalLinkAltIcon />} isInline>
                        View PR
                      </Button>
                    ) : '-'}
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn items={getRowActions(run)} />
                  </Td>
                </Tr>
                <Tr isExpanded={isExpanded}>
                  <Td colSpan={10}>
                    <ExpandableRowContent>
                      <DescriptionList isHorizontal isCompact>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Stages Completed</DescriptionListTerm>
                          <DescriptionListDescription>{run.stagesCompleted} / {run.stagesTotal}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Issues Fixed</DescriptionListTerm>
                          <DescriptionListDescription>{run.issuesFixed}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Knowledge Entries Created</DescriptionListTerm>
                          <DescriptionListDescription>{run.kbEntries}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Estimated Cost</DescriptionListTerm>
                          <DescriptionListDescription>{run.costEstimate}</DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              </Tbody>
            )
          })}
        </Table>
        <Pagination
          itemCount={filtered.length}
          page={page}
          perPage={perPage}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          variant="bottom"
        />
      </StackItem>
    </Stack>
  )
}
