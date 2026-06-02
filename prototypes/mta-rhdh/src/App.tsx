import { useState } from 'react'
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom'
import {
  Page,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadToggle,
  MastheadContent,
  PageSidebar,
  PageSidebarBody,
  PageSection,
  Nav,
  NavItem,
  NavList,
  NavExpandable,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  Divider,
  Content,
} from '@patternfly/react-core'
import type { MenuToggleElement } from '@patternfly/react-core'
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon'
import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon'
import HomeIcon from '@patternfly/react-icons/dist/esm/icons/home-icon'
import CatalogIcon from '@patternfly/react-icons/dist/esm/icons/list-icon'
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon'
import CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon'
import MigrationIcon from '@patternfly/react-icons/dist/esm/icons/migration-icon'
import { MtaStoreProvider } from './store/MtaStore'
import { MtaDashboardPage } from './components/MtaDashboardPage'
import { OnboardingWizard } from './components/OnboardingWizard'
import { ApplicationDetailPage } from './components/ApplicationDetailPage'
import './App.css'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const masthead = (
    <Masthead className="rhdh-masthead">
      <MastheadMain>
        <MastheadToggle>
          <Button
            icon={<BarsIcon />}
            variant="plain"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Global navigation"
          />
        </MastheadToggle>
        <MastheadBrand>
          <Content component="p" style={{ color: 'white', fontWeight: 600, fontSize: 16, margin: 0 }}>
            Red Hat Developer Hub
          </Content>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Button variant="plain" aria-label="Help"><QuestionCircleIcon /></Button>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={userMenuOpen}
                onSelect={() => setUserMenuOpen(false)}
                onOpenChange={setUserMenuOpen}
                popperProps={{ position: 'right' }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plainText"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    isExpanded={userMenuOpen}
                  >
                    developer
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="profile">My profile</DropdownItem>
                  <Divider component="li" key="sep" />
                  <DropdownItem key="logout">Sign out</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  )

  const sidebar = (
    <PageSidebar className="rhdh-sidebar">
      <PageSidebarBody>
        <Nav aria-label="RHDH navigation">
          <NavList>
            <div className="rhdh-disabled-nav">
              <NavItem><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><HomeIcon /> Home</span></NavItem>
              <NavItem><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CatalogIcon /> Catalog</span></NavItem>
            </div>

            <NavExpandable
              title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MigrationIcon /> Migration Toolkit</span> as any}
              isActive={isActive('/') || isActive('/onboard') || isActive('/applications')}
              isExpanded
            >
              <NavItem isActive={location.pathname === '/' || location.pathname === ''}>
                <NavLink to="/">Dashboard</NavLink>
              </NavItem>
              <NavItem isActive={isActive('/onboard')}>
                <NavLink to="/onboard">Onboard Application</NavLink>
              </NavItem>
            </NavExpandable>

            <div className="rhdh-disabled-nav">
              <NavItem><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PlusCircleIcon /> Create...</span></NavItem>
              <NavItem><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CogIcon /> Settings</span></NavItem>
            </div>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  )

  return (
    <MtaStoreProvider>
      <Page
        masthead={masthead}
        sidebar={sidebarOpen ? sidebar : undefined}
      >
        <PageSection isFilled>
          <Routes>
            <Route path="/" element={<MtaDashboardPage />} />
            <Route path="/onboard" element={<OnboardingWizard />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageSection>
      </Page>
    </MtaStoreProvider>
  )
}
