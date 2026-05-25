import { useMemo, useState, useCallback } from 'react'
import {
  Title,
  Stack,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  EmptyState,
  EmptyStateBody,
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
  type ThProps,
} from '@patternfly/react-table'
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon'

type Dependency = {
  id: string
  name: string
  language: string
  foundIn: number
}

const MOCK_DEPENDENCIES: Dependency[] = [
  { id: '1', name: 'spring-boot-starter-web', language: 'Java', foundIn: 3 },
  { id: '2', name: 'hibernate-core', language: 'Java', foundIn: 2 },
  { id: '3', name: 'jackson-databind', language: 'Java', foundIn: 4 },
  { id: '4', name: 'express', language: 'JavaScript', foundIn: 1 },
  { id: '5', name: 'quarkus-resteasy', language: 'Java', foundIn: 1 },
  { id: '6', name: 'lodash', language: 'JavaScript', foundIn: 2 },
  { id: '7', name: 'commons-lang3', language: 'Java', foundIn: 3 },
  { id: '8', name: 'react', language: 'JavaScript', foundIn: 2 },
]

type SortDirection = 'asc' | 'desc'

export function Dependencies() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [appNameFilter, setAppNameFilter] = useState('')
  const [activeSortIndex, setActiveSortIndex] = useState(0)
  const [activeSortDirection, setActiveSortDirection] = useState<SortDirection>('asc')

  const filtered = useMemo(() => {
    let result = [...MOCK_DEPENDENCIES]
    if (appNameFilter) {
      const lower = appNameFilter.toLowerCase()
      result = result.filter((d) => d.name.toLowerCase().includes(lower))
    }
    result.sort((a, b) => {
      let cmp: number
      if (activeSortIndex === 0) {
        cmp = a.name.localeCompare(b.name)
      } else {
        cmp = a.name.localeCompare(b.name)
      }
      return activeSortDirection === 'asc' ? cmp : -cmp
    })
    return result
  }, [appNameFilter, activeSortIndex, activeSortDirection])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const onSetPage = useCallback((_: unknown, newPage: number) => setPage(newPage), [])
  const onPerPageSelect = useCallback((_: unknown, newPerPage: number) => {
    setPerPage(newPerPage)
    setPage(1)
  }, [])

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: { index: activeSortIndex, direction: activeSortDirection },
    onSort: (_e, idx, dir) => {
      setActiveSortIndex(idx)
      setActiveSortDirection(dir as SortDirection)
    },
    columnIndex,
  })

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
            <Title headingLevel="h1">Dependencies</Title>
          </ToolbarItem>
          <ToolbarItem>
            <SearchInput
              placeholder="Filter by application name"
              value={appNameFilter}
              onChange={(_e, val) => { setAppNameFilter(val); setPage(1) }}
              onClear={() => { setAppNameFilter(''); setPage(1) }}
              aria-label="Filter by application name"
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      {filtered.length === 0 ? (
        <Bullseye>
          <EmptyState titleText="No data available" headingLevel="h2" icon={CubesIcon}>
            <EmptyStateBody>
              No dependencies have been found. Run an analysis on your applications to discover dependencies.
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      ) : (
        <>
          {paginationComponent('top')}
          <Table aria-label="Dependencies table">
            <Thead>
              <Tr>
                <Th sort={getSortParams(0)}>Dependency name</Th>
                <Th>Language</Th>
                <Th>Found in</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginated.map((dep) => (
                <Tr key={dep.id}>
                  <Td dataLabel="Dependency name" modifier="breakWord">{dep.name}</Td>
                  <Td dataLabel="Language">{dep.language}</Td>
                  <Td dataLabel="Found in">{dep.foundIn} application{dep.foundIn !== 1 ? 's' : ''}</Td>
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
