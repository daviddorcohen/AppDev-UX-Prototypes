import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon'
import KeyIcon from '@patternfly/react-icons/dist/esm/icons/key-icon'
import CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon'
import BullseyeIcon from '@patternfly/react-icons/dist/esm/icons/bullseye-icon'
import UsersIcon from '@patternfly/react-icons/dist/esm/icons/users-icon'
import CodeBranchIcon from '@patternfly/react-icons/dist/esm/icons/code-branch-icon'
import { HomeData } from './types'

export const mockHomeData: HomeData = {
  phases: [
    {
      id: 'import',
      label: 'Import',
      status: 'complete',
      description: '19 applications imported',
    },
    {
      id: 'configure',
      label: 'Configure',
      status: 'current',
      description: '4 of 6 prerequisites met',
    },
    {
      id: 'analyze',
      label: 'Analyze',
      status: 'pending',
      description: 'Blocked by configuration',
    },
    {
      id: 'migrate',
      label: 'Migrate',
      status: 'pending',
      description: 'Requires completed analysis',
    },
    {
      id: 'complete',
      label: 'Complete',
      status: 'pending',
      description: 'Migration verified and done',
    },
  ],

  prerequisites: [
    {
      id: 'apps-imported',
      title: 'Applications imported',
      status: 'complete',
      summary: '19 applications in inventory',
      unlocks: ['Analysis', 'Assessment', 'Migration'],
      actionLabel: 'View applications',
      actionTo: '/applications',
      icon: CubesIcon,
    },
    {
      id: 'source-repos',
      title: 'Source repositories',
      status: 'partial',
      summary: '14 of 19 applications have source repos configured',
      unlocks: ['Code Analysis', 'Asset Generation'],
      actionLabel: 'Configure repositories',
      actionTo: '/applications',
      icon: CodeBranchIcon,
    },
    {
      id: 'credentials',
      title: 'Source credentials',
      status: 'incomplete',
      summary: '5 applications need credentials to access private repositories',
      unlocks: ['Code Analysis', 'Asset Generation', 'Batch Migration'],
      actionLabel: 'Configure credentials',
      actionTo: '/controls',
      icon: KeyIcon,
    },
    {
      id: 'archetypes',
      title: 'Archetypes',
      status: 'incomplete',
      summary: 'No archetypes defined — bulk assessment is unavailable',
      unlocks: ['Bulk Assessment', 'Smart Grouping'],
      actionLabel: 'Define archetypes',
      actionTo: '/archetypes',
      icon: CogIcon,
    },
    {
      id: 'targets',
      title: 'Migration targets',
      status: 'complete',
      summary: '2 targets configured: JBoss EAP 8, Quarkus',
      unlocks: ['Analysis', 'Asset Generation', 'Batch Migration'],
      actionLabel: 'Manage targets',
      actionTo: '/custom-migration-targets',
      icon: BullseyeIcon,
    },
    {
      id: 'stakeholders',
      title: 'Stakeholders & business services',
      status: 'partial',
      summary: '2 of 4 business services have assigned stakeholders',
      unlocks: ['Assessment Context', 'Wave Planning'],
      actionLabel: 'Manage stakeholders',
      actionTo: '/controls',
      icon: UsersIcon,
    },
  ],

  portfolioStages: [
    { label: 'Not started', count: 3 },
    { label: 'Configuring', count: 5 },
    { label: 'Analyzed', count: 7 },
    { label: 'Migrating', count: 4 },
    { label: 'Complete', count: 0 },
  ],

  totalApps: 19,
}
