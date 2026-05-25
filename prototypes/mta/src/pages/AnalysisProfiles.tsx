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
  Content,
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

type AnalysisProfile = {
  id: string
  name: string
  description: string
}

const MOCK_PROFILES: AnalysisProfile[] = [
  {
    id: '1',
    name: 'Default Java Profile',
    description: 'Standard Java analysis with all rules enabled',
  },
  {
    id: '2',
    name: 'Cloud Readiness',
    description: 'Assess cloud readiness for containerization and Kubernetes deployment',
  },
  {
    id: '3',
    name: '.NET Core Migration',
    description: 'Analyze .NET Framework applications for migration to .NET Core / .NET 6+',
  },
]

type SortableColumn = 'name'

export function AnalysisProfiles() {
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

  const getRowActions = useCallback((_profile: AnalysisProfile): IAction[] => [
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
    let data = [...MOCK_PROFILES]
    if (filterText.trim()) {
      const lower = filterText.toLowerCase()
      data = data.filter((p) => p.name.toLowerCase().includes(lower))
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
      <Title headingLevel="h1">Analysis Profiles</Title>
      <Content>
        <p>
          Create and manage analysis profiles. Analysis profiles allow you to
          save and reuse analysis configurations across multiple applications.
        </p>
      </Content>

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
            titleText="No analysis profiles available"
            headingLevel="h2"
            icon={CubesIcon}
          >
            <EmptyStateBody>
              Create an analysis profile to save and reuse analysis
              configurations.
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="primary">Create new</Button>
            </EmptyStateActions>
          </EmptyState>
        </Bullseye>
      ) : (
        <>
          <Table aria-label="Analysis profiles table">
            <Thead>
              <Tr>
                <Th sort={getSortParams('name')}>Name</Th>
                <Th>Description</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {paginated.map((profile) => (
                <Tr key={profile.id}>
                  <Td dataLabel="Name">{profile.name}</Td>
                  <Td dataLabel="Description" modifier="breakWord">
                    {profile.description}
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn items={getRowActions(profile)} />
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
