export type Product = 'RHDH' | 'MTA' | 'Konflux' | 'TPA' | 'TAS' | 'Podman Desktop' | 'RHCL' | 'DevSpaces'

export const allProducts: Product[] = ['RHDH', 'MTA', 'Konflux', 'TPA', 'TAS', 'Podman Desktop', 'RHCL', 'DevSpaces']

export interface Prototype {
  name: string
  project: string
  product: Product
  description: string
  path: string
  status: 'Active' | 'In Progress' | 'Planned'
}

export const prototypes: Prototype[] = [
  {
    name: 'Konveyor / MTA',
    project: 'Migration Toolkit for Applications',
    product: 'MTA',
    description: 'A prototype of the Konveyor Tackle UI for application modernization and migration. Includes a dashboard with migration summary stats, a Migrate Application wizard for generating migration assets, and an Analysis Report wizard with configurable target selection cards.',
    path: '/AppDev-UX-Prototypes/mta/',
    status: 'Active',
  },
]
