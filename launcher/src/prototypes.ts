import { rhdhPrototypes } from '../../prototypes/rhdh/prototypes'

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
  ...rhdhPrototypes,
  {
    name: 'Podman Desktop PF Alignment',
    project: 'PatternFly Component Alignment',
    product: 'Podman Desktop',
    description: 'A prototype exploring the alignment of Podman Desktop UI components with PatternFly design patterns, ensuring visual and behavioral consistency with the Red Hat design system.',
    externalUrl: 'https://podman-desktop-aaa7fd.pages.redhat.com/',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
]
