import { podmanDesktopPrototypes } from '../../prototypes/podman-desktop/prototypes'
import { rhdhPrototypes } from '../../prototypes/rhdh/prototypes'
import { devSpacesPrototypes } from '../../prototypes/dev-spaces/prototypes'

export type Product = 'RHDH' | 'MTA' | 'Konflux' | 'TPA' | 'TAS' | 'Podman Desktop' | 'RHCL' | 'DevSpaces'

export const allProducts: Product[] = ['RHDH', 'MTA', 'Konflux', 'TPA', 'TAS', 'Podman Desktop', 'RHCL', 'DevSpaces']

export type PrototypeTagColor = 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'teal' | 'yellow' | 'grey'

export interface PrototypeTag {
  label: string
  color: PrototypeTagColor
  icon?: 'stars'
}

export interface Prototype {
  name: string
  project: string
  product: Product
  description: string
  path: string
  externalUrl?: string
  buttonLabel?: string
  tags?: PrototypeTag[]
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
  ...devSpacesPrototypes,
  ...podmanDesktopPrototypes,
]
