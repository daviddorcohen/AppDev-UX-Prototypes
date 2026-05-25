import React, { useMemo, useState, useCallback } from 'react'
import {
  Title,
  Stack,
  StackItem,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Pagination,
  SearchInput,
  Label,
  Card,
  CardBody,
  Grid,
  GridItem,
  Content,
  Flex,
  FlexItem,
  FormSelect,
  FormSelectOption,
  DrawerContent,
  Drawer,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  DrawerContentBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import PendingIcon from '@patternfly/react-icons/dist/esm/icons/pending-icon'
import TimesCircleIcon from '@patternfly/react-icons/dist/esm/icons/times-circle-icon'

type KBStatus = 'Approved' | 'Pending' | 'Rejected'

type KBEntry = {
  id: string
  issue: string
  solution: string
  source: string
  status: KBStatus
  migrationPath: string
  fullSolution: string
  agentReasoning: string
}

const MOCK_KB_ENTRIES: KBEntry[] = [
  { id: '1', issue: 'javax.persistence → jakarta.persistence namespace migration', solution: 'Search-and-replace all javax.persistence imports to jakarta.persistence, update persistence.xml namespace', source: 'Run #42 (order-service)', status: 'Approved', migrationPath: 'EAP6 → Quarkus', fullSolution: '1. Replace all `javax.persistence.*` imports with `jakarta.persistence.*`\n2. Update persistence.xml namespace URI\n3. Update beans.xml if present\n4. Run compilation check', agentReasoning: 'This is a mechanical namespace change required by Jakarta EE 9+. No behavioral differences.' },
  { id: '2', issue: 'EJB @Stateless bean → CDI @ApplicationScoped', solution: 'Replace @Stateless with @ApplicationScoped, remove ejb-jar.xml entry, add @Transactional where needed', source: 'Run #42 (order-service)', status: 'Approved', migrationPath: 'EAP6 → Quarkus', fullSolution: '1. Replace `@Stateless` annotation with `@ApplicationScoped`\n2. Add `@Transactional` to methods that need transaction management\n3. Remove bean definition from ejb-jar.xml\n4. Verify injection points still work with CDI', agentReasoning: 'CDI @ApplicationScoped provides equivalent singleton lifecycle semantics for most stateless EJB use cases.' },
  { id: '3', issue: 'JPA EntityManagerFactory manual creation', solution: 'Replace with Quarkus Panache or @Inject EntityManager', source: 'Run #43 (payment-gateway)', status: 'Pending', migrationPath: 'EAP6 → Quarkus', fullSolution: '1. Remove `Persistence.createEntityManagerFactory()` calls\n2. Use `@Inject EntityManager` in CDI beans\n3. Or migrate to Panache for simpler repository patterns\n4. Update datasource config in application.properties', agentReasoning: 'Quarkus manages EntityManager lifecycle via CDI. Manual factory creation is an anti-pattern in Quarkus.' },
  { id: '4', issue: 'Spring @Autowired → CDI @Inject migration', solution: 'Replace @Autowired with @Inject, handle @Qualifier differences', source: 'Run #44 (inventory-manager)', status: 'Pending', migrationPath: 'Spring Boot → Quarkus', fullSolution: '1. Replace `@Autowired` with `@Inject`\n2. Replace `@Qualifier("name")` with CDI `@Named("name")`\n3. Replace `@Value` with `@ConfigProperty`\n4. Handle optional injection with `Instance<T>`', agentReasoning: 'CDI @Inject is the standard dependency injection mechanism. Most Spring patterns have direct CDI equivalents.' },
  { id: '5', issue: 'Spring Data JPA Repository → Panache Repository', solution: 'Convert Spring Data interfaces to Panache repository classes with equivalent query methods', source: 'Run #45 (user-auth)', status: 'Rejected', migrationPath: 'Spring Boot → Quarkus', fullSolution: 'The initial automated conversion did not handle custom @Query annotations correctly. Needs manual review.', agentReasoning: 'Spring Data derived query methods do not always map 1:1 to Panache. Complex queries need HQL rewrite.' },
  { id: '6', issue: 'JAX-RS endpoint path collision after migration', solution: 'Add explicit @Path annotations and ensure no duplicate paths exist', source: 'Run #42 (order-service)', status: 'Approved', migrationPath: 'EAP6 → Quarkus', fullSolution: '1. Audit all @Path annotations for duplicates\n2. Ensure @Produces/@Consumes are explicit\n3. Use RESTEasy Reactive instead of classic RESTEasy', agentReasoning: 'RESTEasy Reactive has stricter path matching. Ambiguous paths that worked in EAP6 will fail.' },
  { id: '7', issue: 'Hibernate 5 → 6 query API changes', solution: 'Update deprecated Session.createQuery() to use TypedQuery, fix HQL syntax changes', source: 'Run #46 (report-generator)', status: 'Pending', migrationPath: 'EAP6 → Quarkus', fullSolution: '1. Replace `session.createQuery(hql)` with `session.createQuery(hql, Entity.class)`\n2. Update implicit joins to explicit joins\n3. Fix deprecated `setFirstResult`/`setMaxResults` chain', agentReasoning: 'Hibernate 6 removed many deprecated query patterns. These are compile-time errors that must be addressed.' },
  { id: '8', issue: 'web.xml servlet mappings → JAX-RS Application class', solution: 'Remove web.xml, create JAX-RS Application subclass with @ApplicationPath', source: 'Run #43 (payment-gateway)', status: 'Approved', migrationPath: 'EAP6 → Quarkus', fullSolution: '1. Remove web.xml file\n2. Create `@ApplicationPath("/api")` Application class\n3. Ensure all REST resources use relative @Path', agentReasoning: 'Quarkus does not use web.xml. JAX-RS Application class is the standard approach.' },
]

const statusConfig: Record<KBStatus, { color: 'green' | 'blue' | 'red'; icon: React.ReactNode }> = {
  Approved: { color: 'green', icon: <CheckCircleIcon /> },
  Pending: { color: 'blue', icon: <PendingIcon /> },
  Rejected: { color: 'red', icon: <TimesCircleIcon /> },
}

export function KnowledgeBase() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchFilter, setSearchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [drawerEntry, setDrawerEntry] = useState<KBEntry | null>(null)

  const filtered = useMemo(() => {
    let result = [...MOCK_KB_ENTRIES]
    if (searchFilter) {
      const lower = searchFilter.toLowerCase()
      result = result.filter(e => e.issue.toLowerCase().includes(lower) || e.solution.toLowerCase().includes(lower))
    }
    if (statusFilter !== 'all') {
      result = result.filter(e => e.status === statusFilter)
    }
    return result
  }, [searchFilter, statusFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const onSetPage = useCallback((_: unknown, p: number) => setPage(p), [])
  const onPerPageSelect = useCallback((_: unknown, pp: number) => { setPerPage(pp); setPage(1) }, [])

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id])
  }

  const approvedCount = MOCK_KB_ENTRIES.filter(e => e.status === 'Approved').length
  const pendingCount = MOCK_KB_ENTRIES.filter(e => e.status === 'Pending').length
  const rejectedCount = MOCK_KB_ENTRIES.filter(e => e.status === 'Rejected').length
  const pathsCount = new Set(MOCK_KB_ENTRIES.map(e => e.migrationPath)).size

  const summaryCards = (
    <Grid hasGutter>
      <GridItem sm={6} md={3}>
        <Card isCompact>
          <CardBody>
            <Content component="p" style={{ fontSize: 28, fontWeight: 700, marginBottom: 0 }}>{MOCK_KB_ENTRIES.length}</Content>
            <Content component="small">Total Entries</Content>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem sm={6} md={3}>
        <Card isCompact>
          <CardBody>
            <Content component="p" style={{ fontSize: 28, fontWeight: 700, color: 'var(--pf-t--global--color--status--success--default)', marginBottom: 0 }}>{approvedCount}</Content>
            <Content component="small">Approved</Content>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem sm={6} md={3}>
        <Card isCompact>
          <CardBody>
            <Content component="p" style={{ fontSize: 28, fontWeight: 700, color: 'var(--pf-t--global--color--status--info--default)', marginBottom: 0 }}>{pendingCount}</Content>
            <Content component="small">Pending Review</Content>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem sm={6} md={3}>
        <Card isCompact>
          <CardBody>
            <Content component="p" style={{ fontSize: 28, fontWeight: 700, marginBottom: 0 }}>{pathsCount}</Content>
            <Content component="small">Migration Paths</Content>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  )

  const drawerPanel = drawerEntry && (
    <DrawerPanelContent widths={{ default: 'width_50' }}>
      <DrawerHead>
        <Title headingLevel="h2" size="lg">{drawerEntry.issue}</Title>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setDrawerEntry(null)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        <Stack hasGutter>
          <StackItem>
            <DescriptionList isHorizontal isCompact>
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                  <Label color={statusConfig[drawerEntry.status].color} icon={statusConfig[drawerEntry.status].icon}>{drawerEntry.status}</Label>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Migration Path</DescriptionListTerm>
                <DescriptionListDescription>{drawerEntry.migrationPath}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Source</DescriptionListTerm>
                <DescriptionListDescription>{drawerEntry.source}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </StackItem>
          <StackItem>
            <Content component="h3">Full Solution</Content>
            <CodeBlock>
              <CodeBlockCode>{drawerEntry.fullSolution}</CodeBlockCode>
            </CodeBlock>
          </StackItem>
          <StackItem>
            <Content component="h3">Agent Reasoning</Content>
            <Content component="p">{drawerEntry.agentReasoning}</Content>
          </StackItem>
          <StackItem>
            <Flex>
              <FlexItem>
                <Button variant="primary" onClick={() => setDrawerEntry(null)}>Approve</Button>
              </FlexItem>
              <FlexItem>
                <Button variant="danger" onClick={() => setDrawerEntry(null)}>Reject</Button>
              </FlexItem>
            </Flex>
          </StackItem>
        </Stack>
      </DrawerPanelBody>
    </DrawerPanelContent>
  )

  return (
    <Drawer isExpanded={!!drawerEntry} onExpand={() => {}}>
      <DrawerContent panelContent={drawerPanel}>
        <DrawerContentBody>
          <Stack hasGutter style={{ minWidth: 0 }}>
            <StackItem>
              <Title headingLevel="h1">Knowledge Base</Title>
            </StackItem>

            <StackItem>{summaryCards}</StackItem>

            <StackItem>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Search issues or solutions"
                      value={searchFilter}
                      onChange={(_e, val) => { setSearchFilter(val); setPage(1) }}
                      onClear={() => { setSearchFilter(''); setPage(1) }}
                      aria-label="Search"
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <FormSelect value={statusFilter} onChange={(_e, v) => { setStatusFilter(v); setPage(1) }} aria-label="Filter by status" style={{ minWidth: 160 }}>
                      <FormSelectOption value="all" label="All statuses" />
                      <FormSelectOption value="Approved" label="Approved" />
                      <FormSelectOption value="Pending" label="Pending" />
                      <FormSelectOption value="Rejected" label="Rejected" />
                    </FormSelect>
                  </ToolbarItem>
                  <ToolbarGroup align={{ default: 'alignEnd' }}>
                    <ToolbarItem>
                      <Button variant="primary" isDisabled={selectedRows.length === 0}>
                        Approve ({selectedRows.length})
                      </Button>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Button variant="danger" isDisabled={selectedRows.length === 0}>
                        Reject ({selectedRows.length})
                      </Button>
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarContent>
              </Toolbar>
            </StackItem>

            <StackItem>
              <Pagination
                itemCount={filtered.length}
                page={page}
                perPage={perPage}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                variant="top"
              />
              <Table aria-label="Knowledge base table">
                <Thead>
                  <Tr>
                    <Th screenReaderText="Select" />
                    <Th>Issue</Th>
                    <Th>Solution Summary</Th>
                    <Th>Source</Th>
                    <Th>Status</Th>
                    <Th>Migration Path</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginated.map(entry => (
                    <Tr key={entry.id} isClickable onRowClick={() => setDrawerEntry(entry)}>
                      <Td select={{ rowIndex: 0, onSelect: (e) => { e?.stopPropagation(); toggleRow(entry.id) }, isSelected: selectedRows.includes(entry.id) }} />
                      <Td dataLabel="Issue" modifier="breakWord">{entry.issue}</Td>
                      <Td dataLabel="Solution Summary" modifier="truncate" style={{ maxWidth: 300 }}>{entry.solution}</Td>
                      <Td dataLabel="Source">{entry.source}</Td>
                      <Td dataLabel="Status">
                        <Label color={statusConfig[entry.status].color} icon={statusConfig[entry.status].icon} isCompact>{entry.status}</Label>
                      </Td>
                      <Td dataLabel="Migration Path">
                        <Label isCompact>{entry.migrationPath}</Label>
                      </Td>
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
                variant="bottom"
              />
            </StackItem>
          </Stack>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  )
}
