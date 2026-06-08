import { Prototype } from '../../launcher/src/prototypes'

export const podmanDesktopPrototypes: Prototype[] = [
  {
    name: 'Podman Desktop PF Alignment',
    project: 'PatternFly Component Alignment',
    product: 'Podman Desktop',
    description: 'A prototype exploring the alignment of Podman Desktop UI components with PatternFly design patterns, ensuring visual and behavioral consistency with the Red Hat design system.',
    externalUrl: 'https://storybook-102f60.pages.redhat.com/',
    path: '',
    status: 'Active',
    lastUpdated: 'Apr 30, 2026',
  },
  {
    name: 'Volume Export / Import',
    project: 'Volume Backup & Restore',
    product: 'Podman Desktop',
    description: 'A prototype demonstrating volume export and import flows for Podman Desktop, allowing users to back up volume data to a tar archive and restore volumes from an archive file.',
    externalUrl: 'https://github.com/podman-desktop/podman-desktop/pull/17739',
    buttonLabel: 'View PR',
    path: '',
    status: 'In Progress',
    lastUpdated: 'May 27, 2026',
  },
  {
    name: 'Kubernetes Developer Sandbox',
    project: 'Kubernetes Developer Sandbox Promotion',
    product: 'Podman Desktop',
    description: 'A prototype adding a Red Hat Developer Sandbox prompt to the Kubernetes page in Podman Desktop. When users have no active cluster, they see a recommended card encouraging sign-up for Developer Sandbox, providing an easy path to a managed Kubernetes environment with Install/Connect actions.',
    externalUrl: 'https://github.com/podman-desktop/podman-desktop/pull/17775',
    buttonLabel: 'View PR',
    path: '',
    status: 'In Progress',
    lastUpdated: 'Jun 8, 2026',
  },
]
