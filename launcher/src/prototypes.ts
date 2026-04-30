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
]
