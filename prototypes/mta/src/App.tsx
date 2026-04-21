import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import {
  Page, Masthead, MastheadMain, MastheadBrand, MastheadToggle, MastheadContent,
  Nav, NavItem, NavList,
  PageSidebar, PageSidebarBody, PageSection,
  Button, SkipToContent,
  Toolbar, ToolbarContent, ToolbarItem,
  Content,
  Dropdown, DropdownList, DropdownItem,
  MenuToggle, MenuToggleElement,
  Divider,
} from '@patternfly/react-core'
import { NavLink, useLocation } from 'react-router-dom'
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon'
import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon'
import BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon'
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon'
import React, { useState } from 'react'
import { QuickStartContainer, QuickStartCatalogPage } from '@patternfly/quickstarts'
import '@patternfly/quickstarts/dist/quickstarts.min.css'
import { konveyorQuickStart } from './quickstarts/konveyor-quickstart'
import { Dashboard } from './pages/Dashboard'
import { Applications } from './pages/Applications'
import { PlaceholderPage } from './pages/PlaceholderPage'
import './App.css'
import '@patternfly/react-core/dist/styles/base.css'

const allQuickStarts = [konveyorQuickStart]

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/applications', label: 'Application inventory' },
  { to: '/archetypes', label: 'Archetypes' },
  { to: '/reports', label: 'Reports' },
  { to: '/controls', label: 'Controls' },
  { to: '/migration-waves', label: 'Migration waves' },
  { to: '/issues', label: 'Issues' },
  { to: '/insights', label: 'Insights' },
  { to: '/dependencies', label: 'Dependencies' },
  { to: '/task-manager', label: 'Task Manager' },
  { to: '/custom-migration-targets', label: 'Custom migration targets' },
  { to: '/analysis-profiles', label: 'Analysis Profiles' },
]

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [helpMenuOpen, setHelpMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [activeQuickStartID, setActiveQuickStartID] = useState('')
  const [allQuickStartStates, setAllQuickStartStates] = useState({})
  const location = useLocation()
  const navigate = useNavigate()
  const pageId = 'main-content'

  const onHelpMenuSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    setHelpMenuOpen(false)
    if (value === 'quickstarts') {
      navigate('/quickstarts')
    }
  }

  const onUserMenuSelect = () => {
    setUserMenuOpen(false)
  }

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
        <Nav aria-label="Global navigation">
          <NavList>
            {navItems.map((item) => (
              <NavItem key={item.to} isActive={location.pathname === item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </NavItem>
            ))}
          </NavList>
        </Nav>
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/quickstarts" element={<QuickStartCatalogPage title="Quickstarts" hint="Step-by-step guides to get the most out of Konveyor Tackle." showFilter />} />
            <Route path="/archetypes" element={<PlaceholderPage title="Archetypes" description="Manage application archetypes for assessment and review." />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" description="View analysis reports for your applications." />} />
            <Route path="/controls" element={<PlaceholderPage title="Controls" description="Manage stakeholders, stakeholder groups, job functions, business services, and tag categories." />} />
            <Route path="/migration-waves" element={<PlaceholderPage title="Migration waves" description="Organize applications into migration waves for phased deployment." />} />
            <Route path="/issues" element={<PlaceholderPage title="Issues" description="View and manage issues identified during analysis." />} />
            <Route path="/insights" element={<PlaceholderPage title="Insights" description="Review AI-generated insights for your application portfolio." />} />
            <Route path="/dependencies" element={<PlaceholderPage title="Dependencies" description="Manage and visualize application dependencies." />} />
            <Route path="/task-manager" element={<PlaceholderPage title="Task Manager" description="Monitor running and completed analysis tasks." />} />
            <Route path="/custom-migration-targets" element={<PlaceholderPage title="Custom migration targets" description="Define custom migration targets for analysis rules." />} />
            <Route path="/analysis-profiles" element={<PlaceholderPage title="Analysis Profiles" description="Configure analysis profiles with custom rule sets." />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </PageSection>
      </Page>
    </QuickStartContainer>
  )
}
