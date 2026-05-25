import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import {
  Page, Masthead, MastheadMain, MastheadBrand, MastheadToggle, MastheadContent,
  Nav, NavItem, NavList, NavExpandable,
  PageSidebar, PageSidebarBody, PageSection,
  Button, SkipToContent,
  Toolbar, ToolbarContent, ToolbarItem,
  Content,
  Dropdown, DropdownList, DropdownItem,
  MenuToggle, MenuToggleElement,
  Divider,
  Select, SelectOption, SelectList,
  Badge,
} from '@patternfly/react-core'
import { NavLink, useLocation } from 'react-router-dom'
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon'
import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon'
import BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon'
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon'
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon'
import React, { useState } from 'react'
import { QuickStartContainer, QuickStartCatalogPage } from '@patternfly/quickstarts'
import '@patternfly/quickstarts/dist/quickstarts.min.css'
import { konveyorQuickStart } from './quickstarts/konveyor-quickstart'
import { DashboardProvider, DashboardPage, mockDashboardData } from './dashboard'
import { Applications } from './pages/Applications'
import { Archetypes } from './pages/Archetypes'
import { MigrationWaves } from './pages/MigrationWaves'
import { Reports } from './pages/Reports'
import { Issues } from './pages/Issues'
import { Insights } from './pages/Insights'
import { Dependencies } from './pages/Dependencies'
import { Controls } from './pages/Controls'
import { AnalysisProfiles } from './pages/AnalysisProfiles'
import { CustomMigrationTargets } from './pages/CustomMigrationTargets'
import { TaskManager } from './pages/TaskManager'
import { General } from './pages/admin/General'
import { Credentials } from './pages/admin/Credentials'
import { GitRepositories } from './pages/admin/GitRepositories'
import { SubversionRepositories } from './pages/admin/SubversionRepositories'
import { MavenRepositories } from './pages/admin/MavenRepositories'
import { Proxy } from './pages/admin/Proxy'
import { JiraInstances } from './pages/admin/JiraInstances'
import { AssessmentQuestionnaires } from './pages/admin/AssessmentQuestionnaires'
import { SourcePlatforms } from './pages/admin/SourcePlatforms'
import { Generators } from './pages/admin/Generators'
import { AgentsList } from './pages/agentic/AgentsList'
import { AgentDetail } from './pages/agentic/AgentDetail'
import { RecipesList } from './pages/agentic/RecipesList'
import { RecipeDetail } from './pages/agentic/RecipeDetail'
import { PlansList } from './pages/agentic/PlansList'
import { PlanBuilder } from './pages/agentic/PlanBuilder'
import { KnowledgeBase } from './pages/agentic/KnowledgeBase'
import { MigrationRuns } from './pages/agentic/MigrationRuns'
import './App.css'
import '@patternfly/react-core/dist/styles/base.css'

type Perspective = 'migration' | 'administration'

const allQuickStarts = [konveyorQuickStart]

const migrationPaths = [
  '/dashboard', '/applications', '/archetypes', '/migration-waves',
  '/reports', '/issues', '/insights', '/dependencies',
  '/analysis-profiles', '/controls', '/custom-migration-targets', '/task-manager',
  '/agents', '/recipes', '/plans', '/knowledge-base', '/migration-runs',
]

const adminPaths = [
  '/general', '/credentials',
  '/repositories/git', '/repositories/svn', '/repositories/maven',
  '/proxy', '/jira', '/assessment-questionnaires',
  '/source-platforms', '/generators',
]

function getPerspectiveForPath(pathname: string): Perspective {
  if (adminPaths.some(p => pathname.startsWith(p))) return 'administration'
  return 'migration'
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [helpMenuOpen, setHelpMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [perspectiveOpen, setPerspectiveOpen] = useState(false)
  const [activeQuickStartID, setActiveQuickStartID] = useState('')
  const [allQuickStartStates, setAllQuickStartStates] = useState({})
  const location = useLocation()
  const navigate = useNavigate()
  const pageId = 'main-content'

  const perspective = getPerspectiveForPath(location.pathname)

  const onPerspectiveSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    setPerspectiveOpen(false)
    if (value === 'migration' && perspective !== 'migration') {
      navigate('/dashboard')
    } else if (value === 'administration' && perspective !== 'administration') {
      navigate('/general')
    }
  }

  const onHelpMenuSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    setHelpMenuOpen(false)
    if (value === 'quickstarts') {
      navigate('/quickstarts')
    }
  }

  const onUserMenuSelect = () => {
    setUserMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')
  const isGroupActive = (paths: string[]) => paths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))

  const migrationNav = (
    <Nav aria-label="Migration navigation">
      <NavList>
        <NavItem isActive={isActive('/dashboard')}>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </NavItem>
        <NavExpandable
          title="Applications"
          isActive={isGroupActive(['/applications', '/archetypes', '/migration-waves'])}
          isExpanded
        >
          <NavItem isActive={isActive('/applications')}>
            <NavLink to="/applications">Application inventory</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/archetypes')}>
            <NavLink to="/archetypes">Archetypes</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/migration-waves')}>
            <NavLink to="/migration-waves">Migration waves</NavLink>
          </NavItem>
        </NavExpandable>
        <NavExpandable
          title="Agentic Migration"
          isActive={isGroupActive(['/agents', '/recipes', '/plans', '/knowledge-base', '/migration-runs'])}
          isExpanded
        >
          <NavItem isActive={isActive('/agents')}>
            <NavLink to="/agents">Agents</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/recipes')}>
            <NavLink to="/recipes">Recipes</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/plans')}>
            <NavLink to="/plans">Plans</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/knowledge-base')}>
            <NavLink to="/knowledge-base">Knowledge Base</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/migration-runs')}>
            <NavLink to="/migration-runs">Migration Runs</NavLink>
          </NavItem>
        </NavExpandable>
        <NavExpandable
          title="Analysis Results"
          isActive={isGroupActive(['/reports', '/issues', '/insights', '/dependencies'])}
          isExpanded
        >
          <NavItem isActive={isActive('/reports')}>
            <NavLink to="/reports">Reports</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/issues')}>
            <NavLink to="/issues">Issues</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/insights')}>
            <NavLink to="/insights">Insights</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/dependencies')}>
            <NavLink to="/dependencies">Dependencies</NavLink>
          </NavItem>
        </NavExpandable>
        <NavExpandable
          title="Configuration"
          isActive={isGroupActive(['/analysis-profiles', '/controls', '/custom-migration-targets', '/task-manager'])}
          isExpanded
        >
          <NavItem isActive={isActive('/analysis-profiles')}>
            <NavLink to="/analysis-profiles">Analysis Profiles</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/controls')}>
            <NavLink to="/controls">Controls</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/custom-migration-targets')}>
            <NavLink to="/custom-migration-targets">Custom migration targets</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/task-manager')}>
            <NavLink to="/task-manager">Task Manager</NavLink>
          </NavItem>
        </NavExpandable>
      </NavList>
    </Nav>
  )

  const administrationNav = (
    <Nav aria-label="Administration navigation">
      <NavList>
        <NavItem isActive={isActive('/general')}>
          <NavLink to="/general">General</NavLink>
        </NavItem>
        <NavItem isActive={isActive('/credentials')}>
          <NavLink to="/credentials">Credentials</NavLink>
        </NavItem>
        <NavExpandable
          title="Repositories"
          isActive={isGroupActive(['/repositories/git', '/repositories/svn', '/repositories/maven'])}
          isExpanded
        >
          <NavItem isActive={isActive('/repositories/git')}>
            <NavLink to="/repositories/git">Git</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/repositories/svn')}>
            <NavLink to="/repositories/svn">Subversion</NavLink>
          </NavItem>
          <NavItem isActive={isActive('/repositories/maven')}>
            <NavLink to="/repositories/maven">Maven</NavLink>
          </NavItem>
        </NavExpandable>
        <NavItem isActive={isActive('/proxy')}>
          <NavLink to="/proxy">Proxy</NavLink>
        </NavItem>
        <NavExpandable
          title="Issue management"
          isActive={isGroupActive(['/jira'])}
          isExpanded
        >
          <NavItem isActive={isActive('/jira')}>
            <NavLink to="/jira">Jira</NavLink>
          </NavItem>
        </NavExpandable>
        <NavItem isActive={isActive('/assessment-questionnaires')}>
          <NavLink to="/assessment-questionnaires">Assessment questionnaires</NavLink>
        </NavItem>
        <NavItem isActive={isActive('/source-platforms')}>
          <NavLink to="/source-platforms">Source platforms</NavLink>
        </NavItem>
        <NavItem isActive={isActive('/generators')}>
          <NavLink to="/generators">Generators</NavLink>
        </NavItem>
        <NavItem isActive={isActive('/task-manager')}>
          <NavLink to="/task-manager">Task Manager</NavLink>
        </NavItem>
      </NavList>
    </Nav>
  )

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <Button icon={<BarsIcon />} variant="plain" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Global navigation" />
        </MastheadToggle>
        <MastheadBrand>
          <img src="/konveyor-logo.svg" alt="Konveyor" style={{ height: 36 }} />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Button variant="plain" aria-label="Count of queued tasks">
                <Badge screenReaderText="queued tasks">0</Badge>
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="plain" aria-label="Notifications"><BellIcon /></Button>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={helpMenuOpen}
                onSelect={onHelpMenuSelect}
                onOpenChange={setHelpMenuOpen}
                popperProps={{ position: 'right' }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setHelpMenuOpen(!helpMenuOpen)}
                    isExpanded={helpMenuOpen}
                    aria-label="Help menu"
                  >
                    <QuestionCircleIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem value="help" key="help">Help</DropdownItem>
                  <DropdownItem
                    value="documentation"
                    key="documentation"
                    to="https://konveyor.io/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkAltIcon />}
                  >
                    Documentation
                  </DropdownItem>
                  <Divider component="li" key="separator" />
                  <DropdownItem value="quickstarts" key="quickstarts">Quickstarts</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={false}
                popperProps={{ position: 'right' }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle ref={toggleRef} variant="plain" aria-label="About">
                    <InfoCircleIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="about">About</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={userMenuOpen}
                onSelect={onUserMenuSelect}
                onOpenChange={setUserMenuOpen}
                popperProps={{ position: 'right' }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plainText"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    isExpanded={userMenuOpen}
                  >
                    admin
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem value="my-profile" key="my-profile">My profile</DropdownItem>
                  <DropdownItem value="user-management" key="user-management">User management</DropdownItem>
                  <Divider component="li" key="separator" />
                  <DropdownItem value="logout" key="logout">Logout</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  )

  const sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <Select
          isOpen={perspectiveOpen}
          onOpenChange={setPerspectiveOpen}
          onSelect={onPerspectiveSelect}
          selected={perspective}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setPerspectiveOpen(!perspectiveOpen)}
              isExpanded={perspectiveOpen}
              isFullWidth
            >
              {perspective === 'migration' ? 'Migration' : 'Administration'}
            </MenuToggle>
          )}
        >
          <SelectList>
            <SelectOption value="migration">Migration</SelectOption>
            <SelectOption value="administration">Administration</SelectOption>
          </SelectList>
        </Select>
        {perspective === 'migration' ? migrationNav : administrationNav}
      </PageSidebarBody>
    </PageSidebar>
  )

  return (
    <QuickStartContainer
      quickStarts={allQuickStarts}
      activeQuickStartID={activeQuickStartID}
      allQuickStartStates={allQuickStartStates}
      setActiveQuickStartID={setActiveQuickStartID}
      setAllQuickStartStates={setAllQuickStartStates}
      showCardFooters
      useQueryParams={false}
    >
      <Page
        mainContainerId={pageId}
        masthead={masthead}
        sidebar={sidebarOpen ? sidebar : undefined}
        skipToContent={<SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>}
      >
        <PageSection isFilled>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <DashboardProvider data={mockDashboardData} navigateTo={navigate}>
                <DashboardPage />
              </DashboardProvider>
            } />
            <Route path="/applications" element={<Applications />} />
            <Route path="/quickstarts" element={<QuickStartCatalogPage title="Quickstarts" hint="Step-by-step guides to get the most out of Konveyor Tackle." showFilter />} />
            {/* Migration perspective pages */}
            <Route path="/archetypes" element={<Archetypes />} />
            <Route path="/migration-waves" element={<MigrationWaves />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/dependencies" element={<Dependencies />} />
            <Route path="/controls" element={<Controls />} />
            <Route path="/analysis-profiles" element={<AnalysisProfiles />} />
            <Route path="/custom-migration-targets" element={<CustomMigrationTargets />} />
            <Route path="/task-manager" element={<TaskManager />} />
            {/* Agentic migration pages */}
            <Route path="/agents" element={<AgentsList />} />
            <Route path="/agents/:id" element={<AgentDetail />} />
            <Route path="/recipes" element={<RecipesList />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/plans" element={<PlansList />} />
            <Route path="/plans/new" element={<PlanBuilder />} />
            <Route path="/plans/:id/edit" element={<PlanBuilder />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/migration-runs" element={<MigrationRuns />} />
            {/* Administration perspective pages */}
            <Route path="/general" element={<General />} />
            <Route path="/credentials" element={<Credentials />} />
            <Route path="/repositories/git" element={<GitRepositories />} />
            <Route path="/repositories/svn" element={<SubversionRepositories />} />
            <Route path="/repositories/maven" element={<MavenRepositories />} />
            <Route path="/proxy" element={<Proxy />} />
            <Route path="/jira" element={<JiraInstances />} />
            <Route path="/assessment-questionnaires" element={<AssessmentQuestionnaires />} />
            <Route path="/source-platforms" element={<SourcePlatforms />} />
            <Route path="/generators" element={<Generators />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </PageSection>
      </Page>
    </QuickStartContainer>
  )
}
