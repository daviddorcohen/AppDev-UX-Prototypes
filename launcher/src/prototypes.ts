export type Product = 'RHDH' | 'MTA' | 'Konflux' | 'TPA' | 'TAS' | 'Podman Desktop' | 'RHCL' | 'DevSpaces'

export const allProducts: Product[] = ['RHDH', 'MTA', 'Konflux', 'TPA', 'TAS', 'Podman Desktop', 'RHCL', 'DevSpaces']

export interface Prototype {
  name: string
  project: string
  product: Product
  description: string
  path: string
  externalUrl?: string
  status: 'Active' | 'In Progress' | 'Planned'
  lastUpdated: string
}

export const prototypes: Prototype[] = [
  {
    name: 'Konveyor / MTA',
    project: 'Migration Toolkit for Applications',
    product: 'MTA',
    description: 'A prototype of the Konveyor Tackle UI for application modernization and migration. Includes a dashboard with migration summary stats, a Migrate Application wizard for generating migration assets, and an Analysis Report wizard with configurable target selection cards.',
    path: '/AppDev-UX-Prototypes/mta/',
    status: 'Active',
    lastUpdated: 'Apr 21, 2026',
  },
  {
    name: 'Lightspeed for RHDH',
    project: 'Red Hat Developer Hub',
    product: 'RHDH',
    description: 'An AI-powered assistant integrated into Red Hat Developer Hub, enabling developers to interact with Lightspeed capabilities directly within their development workflow. Provides intelligent code suggestions, documentation lookups, and guided troubleshooting.',
    externalUrl: 'https://lightspeed-plugin-477a0f.pages.redhat.com/',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
  {
    name: 'Observability for Entities',
    project: 'Red Hat Developer Hub',
    product: 'RHDH',
    description: 'Catalog improvements that bring observability data directly into entity views, giving developers quick visibility into the health and performance of their services without leaving Developer Hub.',
    externalUrl: 'https://catalog-improvements-4155c7.pages.redhat.com/',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
  {
    name: 'RBAC for RHDH',
    project: 'Red Hat Developer Hub',
    product: 'RHDH',
    description: 'Role-based access control management for Red Hat Developer Hub, allowing administrators to define roles, assign permissions, and control access to resources across the platform.',
    externalUrl: 'https://rbac-2c1057.pages.redhat.com',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
  {
    name: 'Guided Tour',
    project: 'Red Hat Developer Hub',
    product: 'RHDH',
    description: 'An interactive guided tour experience for Red Hat Developer Hub, helping new members onboard quickly by walking them through key features, navigation, and workflows step by step.',
    externalUrl: 'https://backstage-with-rhdh-theme-3f4a21.pages.redhat.com/',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
  {
    name: 'RHDH Home Page',
    project: 'Red Hat Developer Hub',
    product: 'RHDH',
    description: 'A redesigned home page for Red Hat Developer Hub, providing a personalized landing experience with quick access to recent entities, starred items, and platform-wide announcements.',
    externalUrl: 'https://homepage-ebd5ce.pages.redhat.com/',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
  {
    name: 'Orchestrator Workflow Component',
    project: 'Red Hat Developer Hub',
    product: 'RHDH',
    description: 'A workflow orchestration component for Red Hat Developer Hub, enabling teams to design, execute, and monitor automated workflows directly from the platform.',
    externalUrl: 'https://orchestrator-191ef6.pages.redhat.com/',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
  {
    name: 'Scorecards',
    project: 'Red Hat Developer Hub',
    product: 'RHDH',
    description: 'A scorecards system for Red Hat Developer Hub that tracks and visualizes software quality, compliance, and best-practice adoption across catalog entities.',
    externalUrl: 'https://scorecards-1152db.pages.redhat.com/',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
  {
    name: 'Learning Paths',
    project: 'Red Hat Developer Hub',
    product: 'RHDH',
    description: 'A learning paths plugin for Red Hat Developer Hub, offering curated educational content and step-by-step guides to help developers grow their skills within the platform.',
    externalUrl: 'https://learning-paths-55d6a1.pages.redhat.com/',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
  {
    name: 'Data Center',
    project: 'Red Hat Developer Hub',
    product: 'RHDH',
    description: 'A data center management prototype for Red Hat Developer Hub, providing visibility into infrastructure resources, capacity planning, and operational status across distributed environments.',
    externalUrl: 'https://dcm-4dc8dc.pages.redhat.com',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
]
