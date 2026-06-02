import React from 'react';
import {
  Card,
  CardBody,
  Title,
  Button,
  Gallery,
  GalleryItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateActions,
  Content,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { PlusCircleIcon, CubesIcon } from '@patternfly/react-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useMtaStore } from '../store/MtaStore';
import { MigrationStatusChip } from './MigrationStatusChip';

export function MtaDashboardPage() {
  const {
    applications,
    getAggregateStats,
    getArchetypeById,
    getMigrationTargetById,
  } = useMtaStore();
  const navigate = useNavigate();
  const stats = getAggregateStats();

  if (applications.length === 0) {
    return (
      <EmptyState icon={CubesIcon} titleText="No applications onboarded" headingLevel="h2">
        <EmptyStateBody>
          Get started by onboarding your first application for migration analysis.
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateActions>
            <Button
              variant="primary"
              icon={<PlusCircleIcon />}
              component={(props: React.HTMLProps<HTMLAnchorElement>) => (
                <Link {...props} to="/onboard" />
              )}
            >
              Onboard Application
            </Button>
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    );
  }

  const dangerStyle = { color: 'var(--pf-v6-global--danger-color--100)' };

  return (
    <div className="pf-v6-u-p-lg">
      <div className="pf-v6-u-display-flex pf-v6-u-justify-content-space-between pf-v6-u-align-items-center pf-v6-u-mb-lg">
        <Title headingLevel="h1" size="2xl">
          Migration Toolkit for Applications
        </Title>
        <Button
          variant="primary"
          icon={<PlusCircleIcon />}
          component={(props: React.HTMLProps<HTMLAnchorElement>) => (
            <Link {...props} to="/onboard" />
          )}
        >
          Onboard Application
        </Button>
      </div>

      <Gallery hasGutter minWidths={{ default: '200px' }} className="pf-v6-u-mb-lg">
        <GalleryItem>
          <Card isCompact isFullHeight>
            <CardBody className="pf-v6-u-text-align-center">
              <Content component="p" className="pf-v6-u-font-size-3xl pf-v6-u-font-weight-bold">
                {stats.totalApps}
              </Content>
              <Content component="small">Total Applications</Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card isCompact isFullHeight>
            <CardBody className="pf-v6-u-text-align-center">
              <Content component="p" className="pf-v6-u-font-size-3xl pf-v6-u-font-weight-bold">
                {stats.inProgress}
              </Content>
              <Content component="small">In Progress</Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card isCompact isFullHeight>
            <CardBody className="pf-v6-u-text-align-center">
              <Content component="p" className="pf-v6-u-font-size-3xl pf-v6-u-font-weight-bold">
                {stats.completed}
              </Content>
              <Content component="small">Completed</Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card isCompact isFullHeight>
            <CardBody className="pf-v6-u-text-align-center">
              <Content
                component="p"
                className="pf-v6-u-font-size-3xl pf-v6-u-font-weight-bold"
                style={stats.totalCriticalIssues > 0 ? dangerStyle : undefined}
              >
                {stats.totalCriticalIssues}
              </Content>
              <Content component="small">Critical Issues</Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card isCompact isFullHeight>
            <CardBody className="pf-v6-u-text-align-center">
              <Content component="p" className="pf-v6-u-font-size-3xl pf-v6-u-font-weight-bold">
                {stats.totalStoryPoints}
              </Content>
              <Content component="small">Total Story Points</Content>
            </CardBody>
          </Card>
        </GalleryItem>
      </Gallery>

      <Table aria-label="Onboarded applications" variant="compact">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Repository</Th>
            <Th>Status</Th>
            <Th>Archetype</Th>
            <Th>Migration Target</Th>
            <Th>Critical Issues</Th>
            <Th>Story Points</Th>
          </Tr>
        </Thead>
        <Tbody>
          {applications.map(app => {
            const archetype = getArchetypeById(app.archetypeId);
            const target = getMigrationTargetById(app.migrationTargetId);
            return (
              <Tr key={app.id}>
                <Td dataLabel="Name">
                  <Link to={`/applications/${app.id}`}>{app.name}</Link>
                </Td>
                <Td dataLabel="Repository">
                  <a href={app.repoUrl} target="_blank" rel="noopener noreferrer">
                    {app.repoUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                  </a>
                </Td>
                <Td dataLabel="Status">
                  <MigrationStatusChip status={app.status} />
                </Td>
                <Td dataLabel="Archetype">{archetype?.name ?? '—'}</Td>
                <Td dataLabel="Migration Target">{target?.name ?? '—'}</Td>
                <Td dataLabel="Critical Issues">
                  <span style={app.criticalIssues > 0 ? dangerStyle : undefined}>
                    {app.criticalIssues}
                  </span>
                </Td>
                <Td dataLabel="Story Points">{app.storyPoints}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
}
