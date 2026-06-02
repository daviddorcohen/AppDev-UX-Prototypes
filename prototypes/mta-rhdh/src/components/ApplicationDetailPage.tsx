import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardTitle,
  CardBody,
  Title,
  Grid,
  GridItem,
  Label,
  EmptyState,
  EmptyStateBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Content,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import MinusIcon from '@patternfly/react-icons/dist/esm/icons/minus-icon';
import { useMtaStore } from '../store/MtaStore';
import { MigrationStatusChip } from './MigrationStatusChip';
import { ActionMacros } from './ActionMacros';
import type { IssueSeverity, ActionStatus } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const actionLabels: Record<string, string> = {
  'generate-deployment-assets': 'Generate Deployment Assets',
  'trigger-ai-remediator': 'Trigger AI Remediator',
  'run-analysis': 'Run Analysis',
  'launch-workspace': 'Launch Workspace',
  'view-issues': 'View Issues',
  'apply-quick-fixes': 'Apply Quick Fixes',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const severityColor: Record<IssueSeverity, 'red' | 'orange' | 'yellow' | 'blue'> = {
  critical: 'red',
  major: 'orange',
  minor: 'yellow',
  info: 'blue',
};

const actionStatusColor: Record<ActionStatus, 'green' | 'blue' | 'grey' | 'red'> = {
  completed: 'green',
  running: 'blue',
  pending: 'grey',
  failed: 'red',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const store = useMtaStore();

  const app = id ? store.getApplicationById(id) : undefined;

  if (!app) {
    return (
      <EmptyState>
        <EmptyStateBody>
          Application not found. The requested application ID does not match any
          known application.
        </EmptyStateBody>
      </EmptyState>
    );
  }

  const archetype = store.getArchetypeById(app.archetypeId);
  const target = store.getMigrationTargetById(app.migrationTargetId);
  const issues = store.getIssuesForApp(app.id);
  const actions = store.getActionsForApp(app.id);

  return (
    <Stack hasGutter>
      {/* Back link */}
      <StackItem>
        <Link to="/">&larr; Back to Dashboard</Link>
      </StackItem>

      {/* Page title */}
      <StackItem>
        <Title headingLevel="h1" size="2xl">
          {app.name}
        </Title>
      </StackItem>

      {/* Two-column layout */}
      <StackItem>
        <Grid hasGutter>
          {/* ---- LEFT COLUMN ---- */}
          <GridItem span={8}>
            <Stack hasGutter>
              {/* Overview */}
              <StackItem>
                <Card>
                  <CardTitle>Overview</CardTitle>
                  <CardBody>
                    <DescriptionList>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>
                          {app.name}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Repository URL</DescriptionListTerm>
                        <DescriptionListDescription>
                          {app.repoUrl}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Status</DescriptionListTerm>
                        <DescriptionListDescription>
                          <MigrationStatusChip status={app.status} />
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Archetype</DescriptionListTerm>
                        <DescriptionListDescription>
                          {archetype?.name ?? 'Unknown'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Migration Target</DescriptionListTerm>
                        <DescriptionListDescription>
                          {target?.name ?? 'Unknown'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </CardBody>
                </Card>
              </StackItem>

              {/* Discovered Tags */}
              <StackItem>
                <Card>
                  <CardTitle>Discovered Tags</CardTitle>
                  <CardBody>
                    {app.discoveredTags.map(tag => (
                      <Label
                        key={tag}
                        variant="outline"
                        className="pf-v6-u-mr-sm pf-v6-u-mb-sm"
                      >
                        {tag}
                      </Label>
                    ))}
                  </CardBody>
                </Card>
              </StackItem>

              {/* Migration Issues */}
              <StackItem>
                <Card>
                  <CardTitle>Migration Issues</CardTitle>
                  <CardBody>
                    <Table aria-label="Migration issues" variant="compact">
                      <Thead>
                        <Tr>
                          <Th>Severity</Th>
                          <Th>Category</Th>
                          <Th>Description</Th>
                          <Th>File:Line</Th>
                          <Th>AI Fix</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {issues.map(issue => (
                          <Tr key={issue.id}>
                            <Td>
                              <Label color={severityColor[issue.severity]}>
                                {issue.severity}
                              </Label>
                            </Td>
                            <Td>{issue.category}</Td>
                            <Td>{issue.description}</Td>
                            <Td>
                              <span style={{ fontFamily: 'monospace' }}>
                                {issue.file}:{issue.line}
                              </span>
                            </Td>
                            <Td>
                              {issue.aiFixAvailable ? (
                                <CheckCircleIcon
                                  style={{
                                    color:
                                      'var(--pf-v6-global--success-color--100)',
                                  }}
                                />
                              ) : (
                                <MinusIcon
                                  style={{
                                    color:
                                      'var(--pf-v6-global--disabled-color--100)',
                                  }}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </StackItem>
            </Stack>
          </GridItem>

          {/* ---- RIGHT COLUMN ---- */}
          <GridItem span={4}>
            <Stack hasGutter>
              {/* Metrics */}
              <StackItem>
                <Card>
                  <CardTitle>Metrics</CardTitle>
                  <CardBody>
                    <Grid hasGutter>
                      <GridItem span={6} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: 'var(--pf-v6-global--FontSize--2xl)',
                            fontWeight: 'bold',
                            color:
                              app.criticalIssues > 0
                                ? 'var(--pf-v6-global--danger-color--100)'
                                : undefined,
                          }}
                        >
                          {app.criticalIssues}
                        </div>
                        <Content component="small">Critical Issues</Content>
                      </GridItem>
                      <GridItem span={6} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: 'var(--pf-v6-global--FontSize--2xl)',
                            fontWeight: 'bold',
                          }}
                        >
                          {app.issuesCount}
                        </div>
                        <Content component="small">Total Issues</Content>
                      </GridItem>
                      <GridItem span={6} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: 'var(--pf-v6-global--FontSize--2xl)',
                            fontWeight: 'bold',
                          }}
                        >
                          {app.storyPoints}
                        </div>
                        <Content component="small">Story Points</Content>
                      </GridItem>
                      <GridItem span={6} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: 'var(--pf-v6-global--FontSize--2xl)',
                            fontWeight: 'bold',
                          }}
                        >
                          {app.filesAffected}
                        </div>
                        <Content component="small">Files Affected</Content>
                      </GridItem>
                    </Grid>
                  </CardBody>
                </Card>
              </StackItem>

              {/* Action Macros */}
              <StackItem>
                <ActionMacros appId={app.id} />
              </StackItem>

              {/* Action History */}
              <StackItem>
                <Card>
                  <CardTitle>Action History</CardTitle>
                  <CardBody>
                    {actions.length === 0 ? (
                      <Content component="p">No actions recorded yet.</Content>
                    ) : (
                      <Stack hasGutter>
                        {actions.map(entry => (
                          <StackItem key={entry.id}>
                            <div>
                              <Content component="p" className="pf-v6-u-mb-0">
                                <strong>
                                  {actionLabels[entry.action] ?? entry.action}
                                </strong>
                              </Content>
                              <Content component="small">
                                {timeAgo(entry.timestamp)} &middot;{' '}
                                {entry.triggeredBy}
                              </Content>
                            </div>
                            <Label
                              color={actionStatusColor[entry.status]}
                              isCompact
                              className="pf-v6-u-mt-xs"
                            >
                              {entry.status}
                            </Label>
                          </StackItem>
                        ))}
                      </Stack>
                    )}
                  </CardBody>
                </Card>
              </StackItem>
            </Stack>
          </GridItem>
        </Grid>
      </StackItem>
    </Stack>
  );
}
