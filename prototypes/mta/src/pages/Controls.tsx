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
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  Badge,
  SearchInput,
  Flex,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon'

type Stakeholder = {
  email: string
  name: string
  jobFunction: string
}

type StakeholderGroup = {
  name: string
  description: string
  membersCount: number
}

type JobFunction = {
  name: string
}

type BusinessService = {
  name: string
  description: string
  owner: string
}

type TagCategory = {
  name: string
  tagCount: number
  tags: string[]
}

const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { email: 'jsmith@example.com', name: 'John Smith', jobFunction: 'CTO' },
  { email: 'agarcia@example.com', name: 'Ana Garcia', jobFunction: 'Developer Lead' },
  { email: 'mchen@example.com', name: 'Mike Chen', jobFunction: 'Architect' },
  { email: 'sjones@example.com', name: 'Sarah Jones', jobFunction: 'QA Engineer' },
]

const MOCK_GROUPS: StakeholderGroup[] = [
  { name: 'Engineering', description: 'Core engineering team', membersCount: 12 },
  { name: 'Management', description: 'Senior leadership', membersCount: 5 },
  { name: 'QA', description: 'Quality assurance and testing', membersCount: 8 },
]

const MOCK_JOB_FUNCTIONS: JobFunction[] = [
  { name: 'CTO' },
  { name: 'Developer Lead' },
  { name: 'Architect' },
  { name: 'QA Engineer' },
  { name: 'Product Manager' },
]

const MOCK_BUSINESS_SERVICES: BusinessService[] = [
  { name: 'Supply Chain', description: 'Supply chain management', owner: 'John Smith' },
  { name: 'Sales', description: 'Sales operations', owner: 'Ana Garcia' },
  { name: 'Finance', description: 'Financial reporting and analytics', owner: 'Mike Chen' },
  { name: 'IT Security', description: 'Identity and access management', owner: 'Sarah Jones' },
]

const MOCK_TAG_CATEGORIES: TagCategory[] = [
  { name: 'Application Type', tagCount: 3, tags: ['COTS', 'Custom', 'In-house'] },
  { name: 'Data Center', tagCount: 2, tags: ['Boston', 'London'] },
  { name: 'Runtime', tagCount: 4, tags: ['Java', 'Node', 'Python', 'Go'] },
  { name: 'Operating System', tagCount: 3, tags: ['RHEL', 'Windows', 'Ubuntu'] },
]

type TabKey = 'stakeholders' | 'groups' | 'jobFunctions' | 'businessServices' | 'tags'

export function Controls() {
  const [activeTabKey, setActiveTabKey] = useState<TabKey>('stakeholders')
  const [filterText, setFilterText] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const onSetPage = useCallback((_: unknown, newPage: number) => setPage(newPage), [])
  const onPerPageSelect = useCallback((_: unknown, newPerPage: number) => {
    setPerPage(newPerPage)
    setPage(1)
  }, [])

  const handleTabSelect = useCallback((_: unknown, key: string | number) => {
    setActiveTabKey(key as TabKey)
    setFilterText('')
    setPage(1)
  }, [])

  const filteredStakeholders = useMemo(() => {
    const lc = filterText.toLowerCase()
    return MOCK_STAKEHOLDERS.filter(
      (s) =>
        s.email.toLowerCase().includes(lc) ||
        s.name.toLowerCase().includes(lc) ||
        s.jobFunction.toLowerCase().includes(lc)
    )
  }, [filterText])

  const filteredGroups = useMemo(() => {
    const lc = filterText.toLowerCase()
    return MOCK_GROUPS.filter(
      (g) => g.name.toLowerCase().includes(lc) || g.description.toLowerCase().includes(lc)
    )
  }, [filterText])

  const filteredJobFunctions = useMemo(() => {
    const lc = filterText.toLowerCase()
    return MOCK_JOB_FUNCTIONS.filter((j) => j.name.toLowerCase().includes(lc))
  }, [filterText])

  const filteredBusinessServices = useMemo(() => {
    const lc = filterText.toLowerCase()
    return MOCK_BUSINESS_SERVICES.filter(
      (b) =>
        b.name.toLowerCase().includes(lc) ||
        b.description.toLowerCase().includes(lc) ||
        b.owner.toLowerCase().includes(lc)
    )
  }, [filterText])

  const filteredTagCategories = useMemo(() => {
    const lc = filterText.toLowerCase()
    return MOCK_TAG_CATEGORIES.filter(
      (t) =>
        t.name.toLowerCase().includes(lc) ||
        t.tags.some((tag) => tag.toLowerCase().includes(lc))
    )
  }, [filterText])

  const paginate = useCallback(
    <T,>(items: T[]) => {
      const start = (page - 1) * perPage
      return items.slice(start, start + perPage)
    },
    [page, perPage]
  )

  const createNewLabel: Record<TabKey, string> = {
    stakeholders: 'Create new stakeholder',
    groups: 'Create new group',
    jobFunctions: 'Create new job function',
    businessServices: 'Create new business service',
    tags: 'Create new tag category',
  }

  const currentItems = useMemo(() => {
    switch (activeTabKey) {
      case 'stakeholders': return filteredStakeholders
      case 'groups': return filteredGroups
      case 'jobFunctions': return filteredJobFunctions
      case 'businessServices': return filteredBusinessServices
      case 'tags': return filteredTagCategories
    }
  }, [activeTabKey, filteredStakeholders, filteredGroups, filteredJobFunctions, filteredBusinessServices, filteredTagCategories])

  const tabToolbar = (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <SearchInput
            placeholder="Filter by name..."
            value={filterText}
            onChange={(_e, value) => { setFilterText(value); setPage(1) }}
            onClear={() => { setFilterText(''); setPage(1) }}
          />
        </ToolbarItem>
        <ToolbarGroup align={{ default: 'alignEnd' }}>
          <ToolbarItem>
            <Button variant="primary" icon={<PlusIcon />}>
              {createNewLabel[activeTabKey]}
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem variant="pagination">
          <Pagination
            itemCount={currentItems.length}
            page={page}
            perPage={perPage}
            onSetPage={onSetPage}
            onPerPageSelect={onPerPageSelect}
            isCompact
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  )

  const stakeholdersTable = useMemo(() => {
    const rows = paginate(filteredStakeholders)
    return (
      <Table aria-label="Stakeholders table">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Name</Th>
            <Th>Job function</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((s) => (
            <Tr key={s.email}>
              <Td dataLabel="Email">{s.email}</Td>
              <Td dataLabel="Name">{s.name}</Td>
              <Td dataLabel="Job function">{s.jobFunction}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }, [filteredStakeholders, paginate])

  const groupsTable = useMemo(() => {
    const rows = paginate(filteredGroups)
    return (
      <Table aria-label="Stakeholder groups table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Members count</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((g) => (
            <Tr key={g.name}>
              <Td dataLabel="Name">{g.name}</Td>
              <Td dataLabel="Description">{g.description}</Td>
              <Td dataLabel="Members count">{g.membersCount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }, [filteredGroups, paginate])

  const jobFunctionsTable = useMemo(() => {
    const rows = paginate(filteredJobFunctions)
    return (
      <Table aria-label="Job functions table">
        <Thead>
          <Tr>
            <Th>Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((j) => (
            <Tr key={j.name}>
              <Td dataLabel="Name">{j.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }, [filteredJobFunctions, paginate])

  const businessServicesTable = useMemo(() => {
    const rows = paginate(filteredBusinessServices)
    return (
      <Table aria-label="Business services table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Owner</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((b) => (
            <Tr key={b.name}>
              <Td dataLabel="Name">{b.name}</Td>
              <Td dataLabel="Description">{b.description}</Td>
              <Td dataLabel="Owner">{b.owner}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }, [filteredBusinessServices, paginate])

  const tagsTable = useMemo(() => {
    const rows = paginate(filteredTagCategories)
    return (
      <Table aria-label="Tags table">
        <Thead>
          <Tr>
            <Th>Tag category</Th>
            <Th>Tag count</Th>
            <Th>Tags</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((t) => (
            <Tr key={t.name}>
              <Td dataLabel="Tag category">{t.name}</Td>
              <Td dataLabel="Tag count">{t.tagCount}</Td>
              <Td dataLabel="Tags">
                <Flex gap={{ default: 'gapXs' }} wrap="wrap">
                  {t.tags.map((tag) => (
                    <Badge key={tag} isRead>{tag}</Badge>
                  ))}
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }, [filteredTagCategories, paginate])

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Title headingLevel="h1">Controls</Title>

      <Tabs activeKey={activeTabKey} onSelect={handleTabSelect}>
        <Tab eventKey="stakeholders" title={<TabTitleText>Stakeholders</TabTitleText>}>
          <TabContent className="pf-v6-u-pt-md">
            {tabToolbar}
            {stakeholdersTable}
          </TabContent>
        </Tab>
        <Tab eventKey="groups" title={<TabTitleText>Stakeholder groups</TabTitleText>}>
          <TabContent className="pf-v6-u-pt-md">
            {tabToolbar}
            {groupsTable}
          </TabContent>
        </Tab>
        <Tab eventKey="jobFunctions" title={<TabTitleText>Job functions</TabTitleText>}>
          <TabContent className="pf-v6-u-pt-md">
            {tabToolbar}
            {jobFunctionsTable}
          </TabContent>
        </Tab>
        <Tab eventKey="businessServices" title={<TabTitleText>Business services</TabTitleText>}>
          <TabContent className="pf-v6-u-pt-md">
            {tabToolbar}
            {businessServicesTable}
          </TabContent>
        </Tab>
        <Tab eventKey="tags" title={<TabTitleText>Tags</TabTitleText>}>
          <TabContent className="pf-v6-u-pt-md">
            {tabToolbar}
            {tagsTable}
          </TabContent>
        </Tab>
      </Tabs>
    </Stack>
  )
}
