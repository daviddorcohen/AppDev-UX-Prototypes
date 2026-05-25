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
  Icon,
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
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import UploadIcon from '@patternfly/react-icons/dist/esm/icons/upload-icon'

type Questionnaire = {
  id: string
  name: string
  description: string
  questions: number
  required: boolean
}

const MOCK_QUESTIONNAIRES: Questionnaire[] = [
  { id: '1', name: 'Cloud Readiness', description: 'Assess application cloud readiness', questions: 25, required: true },
  { id: '2', name: 'Risk Assessment', description: 'Evaluate migration risk', questions: 15, required: false },
  { id: '3', name: 'Containerization', description: 'Container compatibility check', questions: 20, required: false },
]

export function AssessmentQuestionnaires() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')

  const filtered = useMemo(
    () =>
      MOCK_QUESTIONNAIRES.filter((q) =>
        q.name.toLowerCase().includes(filterValue.toLowerCase())
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
    { title: 'Export', onClick: () => {} },
    { title: 'Delete', onClick: () => {}, isDanger: true },
  ], [])

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Title headingLevel="h1">Assessment questionnaires</Title>

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
              <Button variant="primary" icon={<UploadIcon />}>Import questionnaire</Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Assessment questionnaires table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Questions</Th>
            <Th>Required</Th>
            <Th screenReaderText="Actions" />
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((q) => (
            <Tr key={q.id}>
              <Td dataLabel="Name">{q.name}</Td>
              <Td dataLabel="Description">{q.description}</Td>
              <Td dataLabel="Questions">{q.questions}</Td>
              <Td dataLabel="Required">
                {q.required && (
                  <Icon status="success">
                    <CheckCircleIcon />
                  </Icon>
                )}
              </Td>
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
