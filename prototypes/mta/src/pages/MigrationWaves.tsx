import { useMemo, useState, useCallback } from 'react'
import React from 'react'
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
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  type MenuToggleElement,
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
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import MigrationIcon from '@patternfly/react-icons/dist/esm/icons/migration-icon'

type MigrationWave = {
  id: string
  name: string
  startDate: string
  endDate: string
  applications: number
  status: string
}

const MOCK_WAVES: MigrationWave[] = [
  {
    id: '1',
    name: 'Wave 1 - Core Services',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    applications: 5,
    status: 'In progress',
  },
  {
    id: '2',
    name: 'Wave 2 - Frontend Apps',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    applications: 3,
    status: 'Not started',
  },
  {
    id: '3',
    name: 'Wave 3 - Batch & Reporting',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    applications: 2,
    status: 'Not started',
  },
]

type SortableColumn = 'name' | 'startDate' | 'endDate'
type SortDirection = 'asc' | 'desc'

const columnIndexMap: Record<number, SortableColumn> = {
  0: 'name',
  1: 'startDate',
  2: 'endDate',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function MigrationWaves() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [nameFilter, setNameFilter] = useState('')
  const [activeSortIndex, setActiveSortIndex] = useState(0)
  const [activeSortDirection, setActiveSortDirection] = useState<SortDirection>('asc')
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...MOCK_WAVES]
    if (nameFilter) {
      const lower = nameFilter.toLowerCase()
      result = result.filter((w) => w.name.toLowerCase().includes(lower))
    }
    const col = columnIndexMap[activeSortIndex]
    result.sort((a, b) => {
      const cmp = a[col].localeCompare(b[col])
      return activeSortDirection === 'asc' ? cmp : -cmp
    })
    return result
  }, [nameFilter, activeSortIndex, activeSortDirection])

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

  const getRowActions = useCallback((_wave: MigrationWave): IAction[] => [
    { title: 'Edit', onClick: () => {} },
    { title: 'Manage applications', onClick: () => {} },
    { title: 'Export to issue manager', onClick: () => {} },
    { isSeparator: true },
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
            <Title headingLevel="h1">Migration waves</Title>
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
              <Button variant="primary" icon={<PlusIcon />}>Create new migration wave</Button>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={bulkMenuOpen}
                onSelect={() => setBulkMenuOpen(false)}
                onOpenChange={setBulkMenuOpen}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
                    isExpanded={bulkMenuOpen}
                    aria-label="Bulk actions"
                  >
                    <EllipsisVIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="export-all">Export all to issue manager</DropdownItem>
                  <DropdownItem key="delete-all" isDanger>Delete all</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      {filtered.length === 0 ? (
        <Bullseye>
          <EmptyState titleText="No migration waves available" headingLevel="h2" icon={MigrationIcon}>
            <EmptyStateBody>
              Create a migration wave to group applications for phased migration.
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="primary">Create new migration wave</Button>
            </EmptyStateActions>
          </EmptyState>
        </Bullseye>
      ) : (
        <>
          {paginationComponent('top')}
          <Table aria-label="Migration waves table">
            <Thead>
              <Tr>
                <Th sort={getSortParams(0)}>Name</Th>
                <Th sort={getSortParams(1)}>Start date</Th>
                <Th sort={getSortParams(2)}>End date</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {paginated.map((wave) => (
                <Tr key={wave.id}>
                  <Td dataLabel="Name" modifier="breakWord">{wave.name}</Td>
                  <Td dataLabel="Start date">{formatDate(wave.startDate)}</Td>
                  <Td dataLabel="End date">{formatDate(wave.endDate)}</Td>
                  <Td isActionCell>
                    <ActionsColumn items={getRowActions(wave)} />
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
