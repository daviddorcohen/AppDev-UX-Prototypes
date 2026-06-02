export type MigrationStatus =
  | 'Not Started'
  | 'Discovery'
  | 'Analysis'
  | 'In Progress'
  | 'Remediation'
  | 'Completed'
  | 'Failed';

export type IssueSeverity = 'critical' | 'major' | 'minor' | 'info';

export type IssueCategory =
  | 'api-change'
  | 'dependency'
  | 'configuration'
  | 'code-pattern'
  | 'deployment';

export type ActionType =
  | 'generate-deployment-assets'
  | 'trigger-ai-remediator'
  | 'run-analysis'
  | 'launch-workspace'
  | 'view-issues'
  | 'apply-quick-fixes';

export type ActionStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Archetype {
  id: string;
  name: string;
  description: string;
  matchingTags: string[];
  icon: string;
}

export interface MigrationTarget {
  id: string;
  name: string;
  description: string;
  platform: string;
}

export interface MtaApplication {
  id: string;
  name: string;
  repoUrl: string;
  discoveredTags: string[];
  archetypeId: string;
  migrationTargetId: string;
  status: MigrationStatus;
  issuesCount: number;
  criticalIssues: number;
  storyPoints: number;
  filesAffected: number;
  entityRef?: string;
}

export interface MigrationIssue {
  id: string;
  appId: string;
  severity: IssueSeverity;
  category: IssueCategory;
  description: string;
  file: string;
  line: number;
  aiFixAvailable: boolean;
}

export interface ActionHistoryEntry {
  id: string;
  appId: string;
  action: ActionType;
  timestamp: string;
  status: ActionStatus;
  triggeredBy: 'architect' | 'developer';
}
