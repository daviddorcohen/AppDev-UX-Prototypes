import { useState, useMemo, useCallback } from 'react'
import {
  Title,
  Stack,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Pagination,
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
  type IAction,
} from '@patternfly/react-table'
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon'

type JiraInstance = {
  id: string
  name: string
  url: string
  type: 'Cloud' | 'Server' | 'Datacenter'
}

const MOCK_INSTANCES: JiraInstance[] = [
  { id: '1', name: 'Production Jira', url: 'https://myorg.atlassian.net', type: 'Cloud' },
  { id: '2', name: 'Internal Jira DC', url: 'https://jira.internal.myorg.com', type: 'Datacenter' },
]

export function JiraInstances() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')

  const filtered = useMemo(
    () =>
      MOCK_INSTANCES.filter((j) =>
        j.name.toLowerCase().includes(filterValue.toLowerCase())
      ),
    [filterValue]
  )

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const onSetPage = useCallback((_: unknown, p: number) => setPage(p), [])
  const onPerPageSelect = useCallback((_: unknown, pp: number) => {
    setPerPage(pp)
    setPage(1)
  }, [])

  const rowActions = useCallback((): IAction[] => [
    { title: 'Edit', onClick: () => {} },
    { title: 'Delete', onClick: () => {}, isDanger: true },
  ], [])

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Title headingLevel="h1">Jira</Title>

      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <SearchInput
              placeholder="Filter by name"
              value={filterValue}
              onChange={(_e, val) => setFilterValue(val)}
              onClear={() => setFilterValue('')}
            />
          </ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Button variant="primary" icon={<PlusIcon />}>Create new</Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Jira instances table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>URL</Th>
            <Th>Type</Th>
            <Th screenReaderText="Actions" />
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((instance) => (
            <Tr key={instance.id}>
              <Td dataLabel="Name">{instance.name}</Td>
              <Td dataLabel="URL">{instance.url}</Td>
              <Td dataLabel="Type">{instance.type}</Td>
              <Td isActionCell><ActionsColumn items={rowActions()} /></Td>
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
      />
    </Stack>
  )
}
