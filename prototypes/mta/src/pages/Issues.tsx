import { useMemo, useState, useCallback } from 'react'
import {
  Title,
  Stack,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  Label,
  LabelGroup,
  Content,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  TextInput,
  Button,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ExpandableRowContent,
} from '@patternfly/react-table'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'

type Issue = {
  id: string
  description: string
  category: 'mandatory' | 'optional' | 'potential' | 'information'
  effort: number
  affectedApplications: string[]
  sourceTechnologies: string[]
  targetTechnologies: string[]
  ruleSet: string
  rule: string
  labels: string[]
}

const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    description:
      'Microsoft.Web.WebPages.OAuth.OAuthWebSecurity is not available in .NET Core',
    category: 'mandatory',
    effort: 1,
    affectedApplications: ['Inventory Service', 'Order Portal'],
    sourceTechnologies: ['dotnet'],
    targetTechnologies: ['dotnet-core'],
    ruleSet: 'dotnet-to-core',
    rule: 'oauth-security-migration',
    labels: ['security', 'authentication', 'breaking-change'],
  },
  {
    id: '2',
    description: 'Legacy EJB lookup pattern detected',
    category: 'optional',
    effort: 3,
    affectedApplications: ['Reporting Engine', 'Auth Gateway', 'Order Portal'],
    sourceTechnologies: ['java'],
    targetTechnologies: ['quarkus'],
    ruleSet: 'ejb-to-cdi',
    rule: 'ejb-lookup-cdi-inject',
    labels: ['ejb', 'cdi', 'dependency-injection'],
  },
  {
    id: '3',
    description: 'javax.* package references must be migrated to jakarta.*',
    category: 'mandatory',
    effort: 5,
    affectedApplications: [
      'Inventory Service',
      'Order Portal',
      'Reporting Engine',
      'Auth Gateway',
    ],
    sourceTechnologies: ['java'],
    targetTechnologies: ['jakarta-ee'],
    ruleSet: 'javax-to-jakarta',
    rule: 'javax-package-rename',
    labels: ['namespace', 'jakarta', 'javax'],
  },
  {
    id: '4',
    description: 'Hibernate-specific API usage should be replaced with JPA standard',
    category: 'potential',
    effort: 2,
    affectedApplications: ['Inventory Service', 'Reporting Engine'],
    sourceTechnologies: ['hibernate'],
    targetTechnologies: ['jpa'],
    ruleSet: 'hibernate-to-jpa',
    rule: 'hibernate-session-entitymanager',
    labels: ['persistence', 'orm', 'jpa'],
  },
  {
    id: '5',
    description:
      'Spring Boot 2.x auto-configuration classes relocated in Spring Boot 3.x',
    category: 'mandatory',
    effort: 4,
    affectedApplications: ['Order Portal', 'Notification Service'],
    sourceTechnologies: ['spring-boot-2'],
    targetTechnologies: ['spring-boot-3'],
    ruleSet: 'spring-boot-upgrade',
    rule: 'autoconfigure-relocation',
    labels: ['spring', 'auto-configuration', 'upgrade'],
  },
]

const ALL_APPLICATIONS = [
  'Inventory Service',
  'Order Portal',
  'Reporting Engine',
  'Auth Gateway',
  'Notification Service',
]

const categoryColor: Record<string, 'blue' | 'orange' | 'gold' | 'grey'> = {
  mandatory: 'blue',
  optional: 'grey',
  potential: 'orange',
  information: 'gold',
}

export function Issues() {
  const [activeTab, setActiveTab] = useState<string | number>(0)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterText, setFilterText] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedApp, setSelectedApp] = useState('')
  const [appSelectOpen, setAppSelectOpen] = useState(false)

  const onSetPage = useCallback((_: unknown, p: number) => setPage(p), [])
  const onPerPageSelect = useCallback((_: unknown, pp: number) => {
    setPerPage(pp)
    setPage(1)
  }, [])

  const toggleRow = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const filtered = useMemo(() => {
    let data = MOCK_ISSUES
    if (activeTab === 1 && selectedApp) {
      data = data.filter((i) => i.affectedApplications.includes(selectedApp))
    }
    if (filterText.trim()) {
      const lower = filterText.toLowerCase()
      data = data.filter((i) =>
        i.affectedApplications.some((a) => a.toLowerCase().includes(lower)),
      )
    }
    return data
  }, [activeTab, selectedApp, filterText])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const toolbar = (
    <Toolbar>
      <ToolbarContent>
        {activeTab === 1 && (
          <ToolbarItem>
            <Select
              isOpen={appSelectOpen}
              onOpenChange={setAppSelectOpen}
              onSelect={(_e, val) => {
                setSelectedApp(val as string)
                setAppSelectOpen(false)
                setPage(1)
              }}
              selected={selectedApp}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setAppSelectOpen(!appSelectOpen)}
                  isExpanded={appSelectOpen}
                  style={{ minWidth: '220px' }}
                >
                  {selectedApp || 'Select application'}
                </MenuToggle>
              )}
            >
              <SelectList>
                {ALL_APPLICATIONS.map((app) => (
                  <SelectOption key={app} value={app}>
                    {app}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarItem>
        )}
        <ToolbarItem>
          <TextInput
            type="text"
            aria-label="Filter by application name"
            placeholder="Filter by application name..."
            value={filterText}
            onChange={(_e, val) => {
              setFilterText(val)
              setPage(1)
            }}
            customIcon={<FilterIcon />}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  )

  const issueTable = (
    <>
      {toolbar}
      <Table aria-label="Issues table">
        <Thead>
          <Tr>
            <Th screenReaderText="Row expansion" />
            <Th width={40}>Issue</Th>
            <Th>Category</Th>
            <Th>Effort</Th>
            <Th>Affected applications</Th>
          </Tr>
        </Thead>
        {paginated.map((issue, rowIndex) => (
          <Tbody key={issue.id} isExpanded={expandedRows.has(issue.id)}>
            <Tr>
              <Td
                expand={{
                  rowIndex,
                  isExpanded: expandedRows.has(issue.id),
                  onToggle: () => toggleRow(issue.id),
                }}
              />
              <Td dataLabel="Issue" modifier="breakWord">
                {issue.description}
              </Td>
              <Td dataLabel="Category">
                <Label color={categoryColor[issue.category]}>
                  {issue.category}
                </Label>
              </Td>
              <Td dataLabel="Effort">{issue.effort}</Td>
              <Td dataLabel="Affected applications">
                <Button variant="link" isInline>
                  {issue.affectedApplications.length}
                </Button>
              </Td>
            </Tr>
            <Tr isExpanded={expandedRows.has(issue.id)}>
              <Td colSpan={5} noPadding={false}>
                <ExpandableRowContent>
                  <DescriptionList isCompact isHorizontal>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Total affected applications
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {issue.affectedApplications.join(', ')}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Target technologies
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {issue.targetTechnologies.map((t) => (
                            <Label key={t} color="blue" isCompact>
                              {t}
                            </Label>
                          ))}
                        </LabelGroup>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Source technologies
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {issue.sourceTechnologies.map((t) => (
                            <Label key={t} color="orange" isCompact>
                              {t}
                            </Label>
                          ))}
                        </LabelGroup>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Rule set</DescriptionListTerm>
                      <DescriptionListDescription>
                        {issue.ruleSet}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Rule</DescriptionListTerm>
                      <DescriptionListDescription>
                        {issue.rule}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Labels</DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {issue.labels.map((l) => (
                            <Label key={l} isCompact>
                              {l}
                            </Label>
                          ))}
                        </LabelGroup>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </ExpandableRowContent>
              </Td>
            </Tr>
          </Tbody>
        ))}
      </Table>
      <Pagination
        itemCount={filtered.length}
        page={page}
        perPage={perPage}
        onSetPage={onSetPage}
        onPerPageSelect={onPerPageSelect}
        variant="bottom"
      />
    </>
  )

  return (
    <Stack hasGutter>
      <Title headingLevel="h1">Issues</Title>
      <Tabs
        activeKey={activeTab}
        onSelect={(_e, key) => {
          setActiveTab(key)
          setPage(1)
          setFilterText('')
        }}
      >
        <Tab eventKey={0} title={<TabTitleText>All issues</TabTitleText>}>
          <TabContent className="pf-v6-u-pt-md">{issueTable}</TabContent>
        </Tab>
        <Tab
          eventKey={1}
          title={<TabTitleText>Single application</TabTitleText>}
        >
          <TabContent className="pf-v6-u-pt-md">
            {!selectedApp ? (
              <Content>
                <p className="pf-v6-u-color-200">
                  Select an application from the dropdown above to view its
                  issues.
                </p>
              </Content>
            ) : null}
            {issueTable}
          </TabContent>
        </Tab>
      </Tabs>
    </Stack>
  )
}
