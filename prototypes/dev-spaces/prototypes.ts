import { Prototype } from '../../launcher/src/prototypes'

export const devSpacesPrototypes: Prototype[] = [
  {
    name: 'Dev Spaces for RHDH',
    project: 'RHODS–RHDH Dev Spaces Integration',
    product: 'DevSpaces',
    description:
      'An RHDH prototype for launching and managing OpenShift Dev Spaces from the software catalog, component entity pages, and the home dashboard. Includes Dev Environment status on entities, a home environments table, catalog launch actions, and scaffolder completion flows for new repositories.',
    externalUrl: 'https://dev-spaces-ideas-c93b30.pages.redhat.com/',
    path: '',
    tags: [{ label: 'RHDH', color: 'purple' }],
    status: 'Active',
    lastUpdated: 'Jun 22, 2026',
  },
  {
    name: 'Create Workspace Dashboard',
    project: 'Dev Spaces che-dashboard UX',
    product: 'DevSpaces',
    description:
      'Interactive che-dashboard prototype for OpenShift Dev Spaces create-workspace and proposal UX flows. Includes Current UI vs Proposal toggle, unified workspaces and backups table, restore-from-backup drawer, and getting-started onboarding. Published on GitLab Pages; run locally with prototype mode for full mock API behavior.',
    externalUrl: 'https://create-workspace-67c2e1.pages.redhat.com/dashboard/',
    path: '',
    status: 'Active',
    lastUpdated: 'Jun 30, 2026',
  },
]
