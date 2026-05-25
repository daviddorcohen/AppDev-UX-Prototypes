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

type GitRepo = {
  id: string
  name: string
  url: string
  branch: string
}

const MOCK_REPOS: GitRepo[] = [
  { id: '1', name: 'Main Repo', url: 'https://github.com/example/apps', branch: 'main' },
  { id: '2', name: 'Legacy Repo', url: 'https://gitlab.internal/legacy', branch: 'master' },
  { id: '3', name: 'Microservices', url: 'https://github.com/example/microservices', branch: 'develop' },
]

export function GitRepositories() {
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
      <Title headingLevel="h1">Git configuration</Title>
      <Content component="p">
        Manage Git repository credentials and configurations.
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

      <Table aria-label="Git repositories table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>URL</Th>
            <Th>Branch</Th>
            <Th screenReaderText="Actions" />
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((repo) => (
            <Tr key={repo.id}>
              <Td dataLabel="Name">{repo.name}</Td>
              <Td dataLabel="URL">{repo.url}</Td>
              <Td dataLabel="Branch">{repo.branch}</Td>
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
