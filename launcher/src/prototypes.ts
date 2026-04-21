export interface Prototype {
  name: string
  description: string
  path: string
  status: 'Active' | 'In Progress' | 'Planned'
}

export const prototypes: Prototype[] = [
  {
    name: 'Konveyor / MTA',
    description: 'Migration Toolkit for Applications — Dashboard with summary stats, Migrate Application wizard, and Analysis Report wizard with target selection cards.',
    path: '/AppDev-UX-Prototypes/mta/',
    status: 'Active',
  },
]
