import { useState, useMemo } from 'react'
import {
  Title,
  Stack,
  Card,
  CardBody,
  Form,
  FormGroup,
  Switch,
  Content,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'

type MavenRepo = {
  id: string
  name: string
  url: string
  type: 'Release' | 'Snapshot'
}

const MOCK_REPOS: MavenRepo[] = [
  { id: '1', name: 'Corporate Nexus', url: 'https://nexus.internal/repository/maven-public', type: 'Release' },
  { id: '2', name: 'Snapshots', url: 'https://nexus.internal/repository/maven-snapshots', type: 'Snapshot' },
]

export function MavenRepositories() {
  const [useLocalBinary, setUseLocalBinary] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(false)
  const [page] = useState(1)
  const [perPage] = useState(10)

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return MOCK_REPOS.slice(start, start + perPage)
  }, [page, perPage])

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Title headingLevel="h1">Maven configuration</Title>
      <Content component="p">
        Configure Maven settings for dependency resolution.
      </Content>

      <Card>
        <CardBody>
          <Form>
            <FormGroup fieldId="use-local-binary">
              <Switch
                id="use-local-binary"
                label="Use local Maven binary"
                labelOff="Use local Maven binary"
                isChecked={useLocalBinary}
                onChange={(_e, checked) => setUseLocalBinary(checked)}
                aria-label="Use local Maven binary"
              />
            </FormGroup>
            <FormGroup fieldId="force-update">
              <Switch
                id="force-update"
                label="Force update of dependencies"
                labelOff="Force update of dependencies"
                isChecked={forceUpdate}
                onChange={(_e, checked) => setForceUpdate(checked)}
                aria-label="Force update of dependencies"
              />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>

      <Title headingLevel="h2" size="lg">Custom repositories</Title>

      <Table aria-label="Maven repositories table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>URL</Th>
            <Th>Type</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((repo) => (
            <Tr key={repo.id}>
              <Td dataLabel="Name">{repo.name}</Td>
              <Td dataLabel="URL">{repo.url}</Td>
              <Td dataLabel="Type">{repo.type}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  )
}
