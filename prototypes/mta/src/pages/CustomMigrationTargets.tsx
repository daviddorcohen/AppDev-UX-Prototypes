import { useMemo, useState, useCallback } from 'react'
import {
  Title,
  Stack,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Pagination,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Bullseye,
  Button,
  TextInput,
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
  type ThProps,
} from '@patternfly/react-table'
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon'
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon'
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon'

type CustomTarget = {
  id: string
  name: string
  language: string
  target: string
  ruleCount: number
}

const MOCK_TARGETS: CustomTarget[] = [
  {
    id: '1',
    name: 'Jakarta EE 10 Migration',
    language: 'Java',
    target: 'Jakarta EE 10',
    ruleCount: 45,
  },
  {
    id: '2',
    name: 'Spring Boot 3.x Upgrade',
    language: 'Java',
    target: 'Spring Boot 3',
    ruleCount: 32,
  },
  {
    id: '3',
    name: 'Quarkus Migration',
    language: 'Java',
    target: 'Quarkus',
    ruleCount: 28,
  },
  {
    id: '4',
    name: '.NET Core Modernization',
    language: 'C#',
    target: '.NET 8',
    ruleCount: 51,
  },
]

type SortableColumn = 'name'

export function CustomMigrationTargets() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterText, setFilterText] = useState('')
  const [sortBy, setSortBy] = useState<SortableColumn>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const onSetPage = useCallback((_: unknown, p: number) => setPage(p), [])
  const onPerPageSelect = useCallback((_: unknown, pp: number) => {
    setPerPage(pp)
    setPage(1)
  }, [])

  const getRowActions = useCallback((_target: CustomTarget): IAction[] => [
    { title: 'Edit', onClick: () => {} },
    { title: 'Delete', onClick: () => {}, isDanger: true },
  ], [])

  const getSortParams = (column: SortableColumn): ThProps['sort'] => ({
    sortBy: {
      index: column === 'name' ? 0 : 0,
      direction: sortBy === column ? sortDirection : 'asc',
    },
    onSort: (_e, _index, direction) => {
      setSortBy(column)
      setSortDirection(direction)
    },
    columnIndex: 0,
  })

  const filtered = useMemo(() => {
    let data = [...MOCK_TARGETS]
    if (filterText.trim()) {
      const lower = filterText.toLowerCase()
      data = data.filter((t) => t.name.toLowerCase().includes(lower))
    }
    data.sort((a, b) => {
      const cmp = a[sortBy].localeCompare(b[sortBy])
      return sortDirection === 'asc' ? cmp : -cmp
    })
    return data
  }, [filterText, sortBy, sortDirection])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  return (
    <Stack hasGutter>
      <Title headingLevel="h1">Custom migration targets</Title>

      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <TextInput
              type="text"
              aria-label="Filter by name"
              placeholder="Filter by name..."
              value={filterText}
              onChange={(_e, val) => {
                setFilterText(val)
                setPage(1)
              }}
              customIcon={<SearchIcon />}
            />
          </ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Button variant="primary" icon={<PlusIcon />}>
                Create new
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      {filtered.length === 0 ? (
        <Bullseye>
          <EmptyState
            titleText="No custom migration targets"
            headingLevel="h2"
            icon={CubesIcon}
          >
            <EmptyStateBody>
              Create custom migration targets to define your own migration rules
              and analysis configurations.
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="primary">Create new</Button>
            </EmptyStateActions>
          </EmptyState>
        </Bullseye>
      ) : (
        <>
          <Table aria-label="Custom migration targets table">
            <Thead>
              <Tr>
                <Th sort={getSortParams('name')}>Name</Th>
                <Th>Language</Th>
                <Th>Target</Th>
                <Th>Rule count</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {paginated.map((target) => (
                <Tr key={target.id}>
                  <Td dataLabel="Name">{target.name}</Td>
                  <Td dataLabel="Language">{target.language}</Td>
                  <Td dataLabel="Target">{target.target}</Td>
                  <Td dataLabel="Rule count">{target.ruleCount}</Td>
                  <Td isActionCell>
                    <ActionsColumn items={getRowActions(target)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination
            itemCount={filtered.length}
            page={page}
            perPage={perPage}
            onSetPage={onSetPage}
            onPerPageSelect={onPerPageSelect}
            variant="bottom"
          />
        </>
      )}
    </Stack>
  )
}
