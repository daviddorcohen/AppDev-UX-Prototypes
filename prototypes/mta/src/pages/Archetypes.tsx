import { useMemo, useState, useCallback } from 'react'
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
  type IAction,
} from '@patternfly/react-table'
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon'
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon'

type Archetype = {
  id: string
  name: string
  description: string
  tags: string[]
}

const MOCK_ARCHETYPES: Archetype[] = [
  {
    id: '1',
    name: 'Spring Boot Web App',
    description: 'Standard Spring Boot web application archetype.',
    tags: ['Java', 'Spring Boot', 'Web'],
  },
  {
    id: '2',
    name: 'Legacy EJB Application',
    description: 'Enterprise JavaBeans legacy application.',
    tags: ['Java', 'EJB', 'Legacy'],
  },
  {
    id: '3',
    name: 'Microservice (Quarkus)',
    description: 'Cloud-native Quarkus microservice archetype.',
    tags: ['Java', 'Quarkus', 'Cloud-native'],
  },
  {
    id: '4',
    name: 'Batch Processing Job',
    description: 'Spring Batch scheduled processing archetype.',
    tags: ['Java', 'Spring Batch'],
  },
]

type SortDirection = 'asc' | 'desc'

export function Archetypes() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [nameFilter, setNameFilter] = useState('')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const filtered = useMemo(() => {
    let result = [...MOCK_ARCHETYPES]
    if (nameFilter) {
      const lower = nameFilter.toLowerCase()
      result = result.filter((a) => a.name.toLowerCase().includes(lower))
    }
    result.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name)
      return sortDirection === 'asc' ? cmp : -cmp
    })
    return result
  }, [nameFilter, sortDirection])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const onSetPage = useCallback((_: unknown, newPage: number) => setPage(newPage), [])
  const onPerPageSelect = useCallback((_: unknown, newPerPage: number) => {
    setPerPage(newPerPage)
    setPage(1)
  }, [])

  const getSortParams = (): ThProps['sort'] => ({
    sortBy: { index: 0, direction: sortDirection },
    onSort: (_e, _idx, dir) => setSortDirection(dir as SortDirection),
    columnIndex: 0,
  })

  const getRowActions = useCallback((_archetype: Archetype): IAction[] => [
    { title: 'Edit', onClick: () => {} },
    { title: 'Delete', onClick: () => {}, isDanger: true },
  ], [])

  const paginationComponent = (variant: 'top' | 'bottom') => (
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
            <Title headingLevel="h1">Archetypes</Title>
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
              <Button variant="primary" icon={<PlusIcon />}>Create new archetype</Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      {filtered.length === 0 ? (
        <Bullseye>
          <EmptyState titleText="No archetypes have been created" headingLevel="h2" icon={CubesIcon}>
            <EmptyStateBody>
              Create an archetype to define application profiles for assessment and analysis.
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="primary">Create new archetype</Button>
            </EmptyStateActions>
          </EmptyState>
        </Bullseye>
      ) : (
        <>
          {paginationComponent('top')}
          <Table aria-label="Archetypes table">
            <Thead>
              <Tr>
                <Th sort={getSortParams()}>Name</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {paginated.map((archetype) => (
                <Tr key={archetype.id}>
                  <Td dataLabel="Name" modifier="breakWord">{archetype.name}</Td>
                  <Td isActionCell>
                    <ActionsColumn items={getRowActions(archetype)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {paginationComponent('bottom')}
        </>
      )}
    </Stack>
  )
}
