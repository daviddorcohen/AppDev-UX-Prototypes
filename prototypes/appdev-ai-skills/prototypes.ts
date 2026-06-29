import { Prototype } from '../../launcher/src/prototypes'

export const appDevAiSkillsPrototypes: Prototype[] = [
  {
    name: 'AppDev Jira Workflow',
    project: 'Cursor & Claude Code Agent Skills',
    product: 'AI skill',
    description:
      'Agent skill for Cursor and Claude Code covering AppDev group Jira conventions across products and programs. Covers Epic and Story templates, component title prefixes, activity types, story points, DTUX backlog defaults, uxd-applied-ai labeling, and integration with UXD Jira standards.',
    externalUrl: 'https://gitlab.cee.redhat.com/shirshbe/skill-appdev-jira-workflow',
    buttonLabel: 'View skill (VPN required)',
    path: '',
    status: 'Active',
    lastUpdated: 'Jun 29, 2026',
  },
  {
    name: 'AppDev Weekly Update',
    project: 'Cursor & Claude Code Agent Skills',
    product: 'AI skill',
    description:
      'Cursor and Claude Code agent skill for manual AppDev group weekly update entries from UX prototype and design work. Defines title, single-paragraph body with @author, and footer links with VPN labels — invoked only on explicit request, never auto-generated.',
    externalUrl: 'https://gitlab.cee.redhat.com/shirshbe/skill-appdev-weekly-update',
    buttonLabel: 'View skill (VPN required)',
    path: '',
    status: 'Active',
    lastUpdated: 'Jun 29, 2026',
  },
]
