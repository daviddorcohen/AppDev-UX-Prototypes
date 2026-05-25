import { useMemo, useState, useCallback } from 'react'
import {
  Title,
  Stack,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  Label,
  NumberInput,
  Spinner,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ActionsColumn,
  type ThProps,
} from '@patternfly/react-table'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon'

type TaskStatus = 'Succeeded' | 'Running' | 'Failed' | 'Pending'

type Task = {
  id: number
  application: string
  status: TaskStatus
  kind: string
  priority: number
  createdBy: string
}

const MOCK_TASKS: Task[] = [
  { id: 1, application: 'Inventory Service', status: 'Succeeded', kind: 'analyzer', priority: 0, createdBy: 'admin' },
  { id: 2, application: 'Order Portal', status: 'Succeeded', kind: 'analyzer', priority: 0, createdBy: 'admin' },
  { id: 3, application: 'Order Portal', status: 'Failed', kind: 'analyzer', priority: 5, createdBy: 'admin' },
  { id: 4, application: 'Reporting Engine', status: 'Running', kind: 'analyzer', priority: 0, createdBy: 'admin' },
  { id: 5, application: 'Auth Gateway', status: 'Pending', kind: 'analyzer', priority: 10, createdBy: 'system' },
  { id: 6, application: 'Notification Service', status: 'Succeeded', kind: 'discovery', priority: 0, createdBy: 'admin' },
]

function StatusLabel({ status }: { status: TaskStatus }) {
  switch (status) {
    case 'Succeeded':
      return <Label color="green" icon={<CheckCircleIcon />}>{status}</Label>
    case 'Running':
      return <Label color="blue" icon={<Spinner size="sm" />}>{status}</Label>
    case 'Failed':
      return <Label color="red" icon={<ExclamationCircleIcon />}>{status}</Label>
    case 'Pending':
      return <Label color="grey">{status}</Label>
  }
}

type SortDirection = 'asc' | 'desc'

export function TaskManager() {
  const [idFilter, setIdFilter] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [sortIndex, setSortIndex] = useState<number>(0)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const onSetPage = useCallback((_: unknown, newPage: number) => setPage(newPage), [])
  const onPerPageSelect = useCallback((_: unknown, newPerPage: number) => {
    setPerPage(newPerPage)
    setPage(1)
  }, [])

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sortIndex,
      direction: sortDirection,
    },
    onSort: (_e, index, direction) => {
      setSortIndex(index)
      setSortDirection(direction)
      setPage(1)
    },
    columnIndex,
  })

  const filtered = useMemo(() => {
    if (idFilter === undefined) return MOCK_TASKS
    return MOCK_TASKS.filter((t) => t.id === idFilter)
  }, [idFilter])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    if (sortIndex === 0) {
      copy.sort((a, b) => sortDirection === 'asc' ? a.id - b.id : b.id - a.id)
    }
    return copy
  }, [filtered, sortIndex, sortDirection])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return sorted.slice(start, start + perPage)
  }, [sorted, page, perPage])

  const rowActions = [
    { title: 'Cancel', onClick: () => {} },
    { title: 'Preempt', onClick: () => {} },
    { isSeparator: true as const },
    { title: 'Delete', onClick: () => {}, isDanger: true },
  ]

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Title headingLevel="h1">Task Manager</Title>

      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <NumberInput
              value={idFilter ?? 0}
              onChange={(e) => {
                const val = (e.target as HTMLInputElement).valueAsNumber
                setIdFilter(Number.isNaN(val) ? undefined : val)
                setPage(1)
              }}
              onPlus={() => { setIdFilter((prev) => (prev ?? 0) + 1); setPage(1) }}
              onMinus={() => { setIdFilter((prev) => Math.max(0, (prev ?? 0) - 1)); setPage(1) }}
              min={0}
              inputName="Filter by ID"
              inputAriaLabel="Filter by task ID"
              widthChars={6}
            />
          </ToolbarItem>
          <ToolbarItem variant="pagination">
            <Pagination
              itemCount={sorted.length}
              page={page}
              perPage={perPage}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              isCompact
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Task manager table">
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)}>ID</Th>
            <Th>Application</Th>
            <Th>Status</Th>
            <Th>Kind</Th>
            <Th>Priority</Th>
            <Th>Created By</Th>
            <Th screenReaderText="Actions" />
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((task) => (
            <Tr key={task.id}>
              <Td dataLabel="ID">{task.id}</Td>
              <Td dataLabel="Application">{task.application}</Td>
              <Td dataLabel="Status"><StatusLabel status={task.status} /></Td>
              <Td dataLabel="Kind">{task.kind}</Td>
              <Td dataLabel="Priority">{task.priority}</Td>
              <Td dataLabel="Created By">{task.createdBy}</Td>
              <Td isActionCell><ActionsColumn items={rowActions} /></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination
        itemCount={sorted.length}
        page={page}
        perPage={perPage}
        onSetPage={onSetPage}
        onPerPageSelect={onPerPageSelect}
      />
    </Stack>
  )
}
