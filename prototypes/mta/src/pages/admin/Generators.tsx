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

type Generator = {
  id: string
  name: string
  language: string
  repository: string
}

const MOCK_GENERATORS: Generator[] = [
  { id: '1', name: 'Quarkus Generator', language: 'Java', repository: 'https://github.com/konveyor/quarkus-gen' },
  { id: '2', name: 'Spring Boot Migrator', language: 'Java', repository: 'https://github.com/spring-projects/spring-boot-migrator' },
]

export function Generators() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')

  const filtered = useMemo(
    () =>
      MOCK_GENERATORS.filter((g) =>
        g.name.toLowerCase().includes(filterValue.toLowerCase())
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
      <Title headingLevel="h1">Generators</Title>

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

      <Table aria-label="Generators table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Language</Th>
            <Th>Repository</Th>
            <Th screenReaderText="Actions" />
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((gen) => (
            <Tr key={gen.id}>
              <Td dataLabel="Name">{gen.name}</Td>
              <Td dataLabel="Language">{gen.language}</Td>
              <Td dataLabel="Repository">{gen.repository}</Td>
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
