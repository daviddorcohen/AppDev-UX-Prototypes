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
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Bullseye,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  Content,
  Badge,
  Flex,
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
import ApplicationsIcon from '@patternfly/react-icons/dist/esm/icons/applications-icon'
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon'
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon'

export type App = {
  id: string
  name: string
  description: string
  businessService?: string
  tags: string[]
  assessment: string
  comments?: string
  repositoryType?: string
  sourceRepo?: string
  branch?: string
  rootPath?: string
  effort?: string
  associatedArchetypes?: string[]
  archetypesAssessed?: string
  archetypesReviewed?: string
  applicationRisk?: string
  owner?: string
  contributors?: string
  migrationWaveName?: string
  migrationWaveTicket?: string
}

const MOCK_APPS: App[] = [
  {
    id: '1',
    name: 'Inventory Service',
    description: 'Legacy Java inventory API.',
    businessService: 'Supply Chain',
    tags: ['Java', 'Spring'],
    assessment: 'Complete',
    comments: 'Critical for order fulfillment.',
    repositoryType: 'git',
    sourceRepo: 'https://github.com/example/inventory-service',
    branch: 'main',
    rootPath: '/',
    associatedArchetypes: ['igor-archetype'],
    applicationRisk: 'Unassessed',
  },
  {
    id: '2',
    name: 'Order Portal',
    description: 'Customer order web app',
    businessService: 'Sales',
    tags: ['Java', 'Angular'],
    assessment: 'In progress',
    sourceRepo: 'https://github.com/example/order-portal',
  },
  {
    id: '3',
    name: 'Reporting Engine',
    description: 'Batch reporting service',
    businessService: 'Finance',
    tags: ['Java', 'Quartz'],
    assessment: 'Not started',
  },
  {
    id: '4',
    name: 'Auth Gateway',
    description: 'SSO and API gateway',
    businessService: 'IT Security',
    tags: ['Java', 'Spring'],
    assessment: 'Complete',
  },
  {
    id: '5',
    name: 'Notification Service',
    description: 'Email and push notifications',
    businessService: 'Marketing',
    tags: ['Node', 'Express'],
    assessment: 'Not started',
  },
]

export function Applications() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [activeDrawerTab, setActiveDrawerTab] = useState<string | number>(0)

  const apps = MOCK_APPS
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return apps.slice(start, start + perPage)
  }, [apps, page, perPage])

  const onSetPage = useCallback((_: unknown, newPage: number) => setPage(newPage), [])
  const onPerPageSelect = useCallback((_: unknown, newPerPage: number) => {
    setPerPage(newPerPage)
    setPage(1)
  }, [])

  const openDrawer = useCallback((app: App) => {
    setSelectedApp(app)
    setDrawerOpen(true)
    setActiveDrawerTab(0)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    setSelectedApp(null)
  }, [])

  const getRowActions = useCallback((_app: App): IAction[] => {
    return [
      { title: 'Copy assessment', onClick: () => {} },
      { title: 'Discard assessment', onClick: () => {} },
      { isSeparator: true },
      { title: 'Manage dependencies', onClick: () => {} },
      { title: 'Manage credentials', onClick: () => {} },
      { isSeparator: true },
      { title: 'Delete', onClick: () => {}, isDanger: true },
    ]
  }, [])

  const unassigned = (val: string | undefined) => val ?? 'Not yet assigned'
  const notAvailable = (val: string | undefined) => val ?? 'Not available'
  const none = (val: string | undefined) => val ?? 'None'

  const panelContent = (
    <DrawerPanelContent className="tackle-application-drawer-panel" widths={{ default: 'width_50', lg: 'width_50', xl: 'width_33' }} minSize="400px">
      <DrawerHead>
        <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-0">{selectedApp?.name ?? 'Application'}</Title>
        <DrawerActions><DrawerCloseButton onClick={closeDrawer} /></DrawerActions>
      </DrawerHead>
      <DrawerPanelBody hasNoPadding={false}>
        {selectedApp && (
          <Tabs activeKey={activeDrawerTab} onSelect={(_e, key) => setActiveDrawerTab(key)} isBox className="pf-v6-u-pt-sm">
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
              <TabContent className="pf-v6-u-pt-md">
                <Content className="tackle-drawer-details">
                  <p className="pf-v6-u-mb-md tackle-drawer-muted">{selectedApp.description}</p>
                  <div className="pf-v6-u-mb-lg">
                    <Flex gap={{ default: 'gapSm' }} wrap="wrap">
                      <Button variant="link" isInline component="a" href="#issues">Issues</Button>
                      <Button variant="link" isInline component="a" href="#insights">Insights</Button>
                      <Button variant="link" isInline component="a" href="#dependencies">Dependencies</Button>
                    </Flex>
                  </div>
                  <DescriptionList isCompact className="tackle-drawer-dl">
                    <DescriptionListGroup><DescriptionListTerm>Effort</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{unassigned(selectedApp.effort)}</DescriptionListDescription></DescriptionListGroup>
                  </DescriptionList>
                  <Title headingLevel="h3" size="md" className="pf-v6-u-mt-lg pf-v6-u-mb-sm">Archetypes</Title>
                  <DescriptionList isCompact className="tackle-drawer-dl">
                    <DescriptionListGroup><DescriptionListTerm>Associated archetypes</DescriptionListTerm><DescriptionListDescription>{(selectedApp.associatedArchetypes?.length ? selectedApp.associatedArchetypes : ['None']).map((a) => (<Badge key={a} className="pf-v6-u-mr-xs pf-v6-u-mb-xs" isRead>{a}</Badge>))}</DescriptionListDescription></DescriptionListGroup>
                    <DescriptionListGroup><DescriptionListTerm>Archetypes assessed</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{none(selectedApp.archetypesAssessed)}</DescriptionListDescription></DescriptionListGroup>
                    <DescriptionListGroup><DescriptionListTerm>Archetypes reviewed</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{none(selectedApp.archetypesReviewed)}</DescriptionListDescription></DescriptionListGroup>
                  </DescriptionList>
                  <DescriptionList isCompact className="tackle-drawer-dl pf-v6-u-mt-md">
                    <DescriptionListGroup><DescriptionListTerm>Application risk</DescriptionListTerm><DescriptionListDescription><Badge isRead>{selectedApp.applicationRisk ?? 'Unassessed'}</Badge></DescriptionListDescription></DescriptionListGroup>
                  </DescriptionList>
                  <Flex className="pf-v6-u-mt-lg pf-v6-u-mb-sm" alignItems={{ default: 'alignItemsCenter' }}>
                    <Title headingLevel="h3" size="md" className="pf-v6-u-mb-0">Application information</Title>
                    <Button variant="plain" aria-label="Edit" icon={<PencilAltIcon />} />
                  </Flex>
                  <DescriptionList isCompact className="tackle-drawer-dl">
                    <DescriptionListGroup><DescriptionListTerm>Owner</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{notAvailable(selectedApp.owner)}</DescriptionListDescription></DescriptionListGroup>
                    <DescriptionListGroup><DescriptionListTerm>Contributors</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{notAvailable(selectedApp.contributors)}</DescriptionListDescription></DescriptionListGroup>
                  </DescriptionList>
                  <Title headingLevel="h3" size="md" className="pf-v6-u-mt-lg pf-v6-u-mb-sm">Source code</Title>
                  <DescriptionList isCompact className="tackle-drawer-dl">
                    <DescriptionListGroup><DescriptionListTerm>Repository type</DescriptionListTerm><DescriptionListDescription>{selectedApp.repositoryType ?? '\u2014'}</DescriptionListDescription></DescriptionListGroup>
                    {selectedApp.sourceRepo && (<DescriptionListGroup><DescriptionListTerm>Repository</DescriptionListTerm><DescriptionListDescription><Button variant="link" isInline component="a" href={selectedApp.sourceRepo} target="_blank" rel="noopener noreferrer" icon={<ExternalLinkAltIcon />} iconPosition="end">{selectedApp.sourceRepo}</Button></DescriptionListDescription></DescriptionListGroup>)}
                    <DescriptionListGroup><DescriptionListTerm>Branch</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{selectedApp.branch || '\u2014'}</DescriptionListDescription></DescriptionListGroup>
                    <DescriptionListGroup><DescriptionListTerm>Root path</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{selectedApp.rootPath || '\u2014'}</DescriptionListDescription></DescriptionListGroup>
                  </DescriptionList>
                  <Title headingLevel="h3" size="md" className="pf-v6-u-mt-lg pf-v6-u-mb-sm">Binary (Java)</Title>
                  <DescriptionList isCompact className="tackle-drawer-dl">
                    <DescriptionListGroup><DescriptionListTerm>Binary (Java)</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{notAvailable(undefined)}</DescriptionListDescription></DescriptionListGroup>
                  </DescriptionList>
                  <DescriptionList isCompact className="tackle-drawer-dl pf-v6-u-mt-md">
                    <DescriptionListGroup><DescriptionListTerm>Business service</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{unassigned(selectedApp.businessService)}</DescriptionListDescription></DescriptionListGroup>
                  </DescriptionList>
                  <Title headingLevel="h3" size="md" className="pf-v6-u-mt-lg pf-v6-u-mb-sm">Migration wave</Title>
                  <DescriptionList isCompact className="tackle-drawer-dl">
                    <DescriptionListGroup><DescriptionListTerm>Wave name</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{unassigned(selectedApp.migrationWaveName)}</DescriptionListDescription></DescriptionListGroup>
                    <DescriptionListGroup><DescriptionListTerm>Ticket</DescriptionListTerm><DescriptionListDescription className="tackle-drawer-muted">{unassigned(selectedApp.migrationWaveTicket)}</DescriptionListDescription></DescriptionListGroup>
                  </DescriptionList>
                  <Title headingLevel="h3" size="md" className="pf-v6-u-mt-lg pf-v6-u-mb-sm">Application comments</Title>
                  <p className="tackle-drawer-muted pf-v6-u-mb-0">{selectedApp.comments || '\u2014'}</p>
                </Content>
              </TabContent>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Tags</TabTitleText>}>
              <TabContent className="pf-v6-u-pt-md">
                <Content>
                  <Flex gap={{ default: 'gapSm' }} wrap="wrap">
                    {selectedApp.tags.length ? selectedApp.tags.map((t) => <Badge key={t} isRead>{t}</Badge>) : <span className="tackle-drawer-muted">No tags</span>}
                  </Flex>
                </Content>
              </TabContent>
            </Tab>
            <Tab eventKey={2} title={<TabTitleText>Reports</TabTitleText>}>
              <TabContent className="pf-v6-u-pt-md"><Content><p className="tackle-drawer-muted">Reports for this application will appear here.</p></Content></TabContent>
            </Tab>
            <Tab eventKey={3} title={<TabTitleText>Review</TabTitleText>}>
              <TabContent className="pf-v6-u-pt-md"><Content><p className="tackle-drawer-muted">Review status: <strong>{selectedApp.assessment}</strong></p></Content></TabContent>
            </Tab>
          </Tabs>
        )}
      </DrawerPanelBody>
    </DrawerPanelContent>
  )

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Toolbar>
        <ToolbarContent rowWrap={{ default: 'wrap' }}>
          <ToolbarItem><Title headingLevel="h1">Applications</Title></ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem><Button variant="primary" icon={<PlusIcon />}>Add application</Button></ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      {apps.length === 0 ? (
        <Bullseye>
          <EmptyState titleText="No applications" headingLevel="h2" icon={ApplicationsIcon}>
            <EmptyStateBody>Add applications to your portfolio to assess and analyze them for migration.</EmptyStateBody>
            <EmptyStateActions><Button variant="primary">Add application</Button></EmptyStateActions>
          </EmptyState>
        </Bullseye>
      ) : (
        <Drawer isExpanded={drawerOpen} isInline position="end" onExpand={() => {}} className="tackle-application-drawer">
          <DrawerContent panelContent={panelContent}>
            <DrawerContentBody>
              <div className="tackle-table-wrapper tackle-table-wrapper--applications">
                <Table aria-label="Applications table">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Description</Th>
                      <Th>Business service</Th>
                      <Th>Tags</Th>
                      <Th>Assessment</Th>
                      <Th screenReaderText="Actions" />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginated.map((app) => (
                      <Tr key={app.id} isRowSelected={selectedApp?.id === app.id} isClickable onRowClick={() => openDrawer(app)}>
                        <Td dataLabel="Name" modifier="breakWord" hasAction>
                          <Button variant="link" isInline onClick={(e) => { e.stopPropagation(); openDrawer(app) }}>{app.name}</Button>
                        </Td>
                        <Td dataLabel="Description" modifier="breakWord">{app.description}</Td>
                        <Td dataLabel="Business service">{app.businessService ?? '\u2014'}</Td>
                        <Td dataLabel="Tags">{app.tags.join(', ') || '\u2014'}</Td>
                        <Td dataLabel="Assessment">{app.assessment}</Td>
                        <Td isActionCell onClick={(e) => e.stopPropagation()}><ActionsColumn items={getRowActions(app)} /></Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
              <Pagination itemCount={apps.length} page={page} perPage={perPage} onSetPage={onSetPage} onPerPageSelect={onPerPageSelect} variant="top" />
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      )}
    </Stack>
  )
}
