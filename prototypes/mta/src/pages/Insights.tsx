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

type Insight = {
  id: string
  description: string
  category: 'information' | 'potential' | 'warning'
  affectedApplications: string[]
  details: string
  sourceTechnologies: string[]
  labels: string[]
}

const MOCK_INSIGHTS: Insight[] = [
  {
    id: '1',
    description: 'Application uses deprecated API patterns',
    category: 'information',
    affectedApplications: ['Inventory Service', 'Order Portal', 'Auth Gateway'],
    details:
      'Several API patterns used in the application have been deprecated and will be removed in future versions. Consider migrating to the recommended alternatives.',
    sourceTechnologies: ['java', 'spring'],
    labels: ['deprecated', 'api', 'migration-opportunity'],
  },
  {
    id: '2',
    description: 'Database connection pooling can be optimized',
    category: 'potential',
    affectedApplications: ['Reporting Engine', 'Inventory Service'],
    details:
      'The current connection pooling configuration uses default values that may not be optimal for production workloads. Tuning pool size and timeout settings could improve performance.',
    sourceTechnologies: ['java', 'hibernate'],
    labels: ['performance', 'database', 'configuration'],
  },
  {
    id: '3',
    description: 'Hardcoded configuration values detected',
    category: 'warning',
    affectedApplications: [
      'Order Portal',
      'Notification Service',
      'Auth Gateway',
    ],
    details:
      'Configuration values such as URLs, timeouts, and feature flags are hardcoded in the source. Externalizing these to environment variables or a config service improves maintainability and cloud readiness.',
    sourceTechnologies: ['java', 'spring-boot'],
    labels: ['configuration', 'cloud-readiness', 'best-practice'],
  },
  {
    id: '4',
    description: 'Logging framework inconsistencies across modules',
    category: 'information',
    affectedApplications: [
      'Inventory Service',
      'Order Portal',
      'Reporting Engine',
      'Auth Gateway',
    ],
    details:
      'Multiple logging frameworks (Log4j, SLF4J, java.util.logging) are used across different modules. Standardizing on a single facade like SLF4J is recommended.',
    sourceTechnologies: ['java'],
    labels: ['logging', 'standardization', 'maintainability'],
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
  information: 'blue',
  potential: 'orange',
  warning: 'gold',
}

export function Insights() {
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
    let data = MOCK_INSIGHTS
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

  const insightTable = (
    <>
      {toolbar}
      <Table aria-label="Insights table">
        <Thead>
          <Tr>
            <Th screenReaderText="Row expansion" />
            <Th width={50}>Insight</Th>
            <Th>Category</Th>
            <Th>Affected applications</Th>
          </Tr>
        </Thead>
        {paginated.map((insight, rowIndex) => (
          <Tbody key={insight.id} isExpanded={expandedRows.has(insight.id)}>
            <Tr>
              <Td
                expand={{
                  rowIndex,
                  isExpanded: expandedRows.has(insight.id),
                  onToggle: () => toggleRow(insight.id),
                }}
              />
              <Td dataLabel="Insight" modifier="breakWord">
                {insight.description}
              </Td>
              <Td dataLabel="Category">
                <Label color={categoryColor[insight.category]}>
                  {insight.category}
                </Label>
              </Td>
              <Td dataLabel="Affected applications">
                <Button variant="link" isInline>
                  {insight.affectedApplications.length}
                </Button>
              </Td>
            </Tr>
            <Tr isExpanded={expandedRows.has(insight.id)}>
              <Td colSpan={4} noPadding={false}>
                <ExpandableRowContent>
                  <DescriptionList isCompact isHorizontal>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Details</DescriptionListTerm>
                      <DescriptionListDescription>
                        {insight.details}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Affected applications
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {insight.affectedApplications.join(', ')}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Source technologies
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {insight.sourceTechnologies.map((t) => (
                            <Label key={t} color="orange" isCompact>
                              {t}
                            </Label>
                          ))}
                        </LabelGroup>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Labels</DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {insight.labels.map((l) => (
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
      <Title headingLevel="h1">Insights</Title>
      <Tabs
        activeKey={activeTab}
        onSelect={(_e, key) => {
          setActiveTab(key)
          setPage(1)
          setFilterText('')
        }}
      >
        <Tab eventKey={0} title={<TabTitleText>All insights</TabTitleText>}>
          <TabContent className="pf-v6-u-pt-md">{insightTable}</TabContent>
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
                  insights.
                </p>
              </Content>
            ) : null}
            {insightTable}
          </TabContent>
        </Tab>
      </Tabs>
    </Stack>
  )
}
