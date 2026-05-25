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
  Content,
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

type SvnRepo = {
  id: string
  name: string
  url: string
}

const MOCK_REPOS: SvnRepo[] = [
  { id: '1', name: 'Corporate SVN', url: 'https://svn.internal/repos/corporate' },
  { id: '2', name: 'Legacy Monolith', url: 'https://svn.internal/repos/legacy-monolith' },
]

export function SubversionRepositories() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')

  const filtered = useMemo(
    () =>
      MOCK_REPOS.filter((r) =>
        r.name.toLowerCase().includes(filterValue.toLowerCase())
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
      <Title headingLevel="h1">Subversion configuration</Title>
      <Content component="p">
        Manage Subversion repository credentials and configurations.
      </Content>

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

      <Table aria-label="Subversion repositories table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>URL</Th>
            <Th screenReaderText="Actions" />
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((repo) => (
            <Tr key={repo.id}>
              <Td dataLabel="Name">{repo.name}</Td>
              <Td dataLabel="URL">{repo.url}</Td>
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
