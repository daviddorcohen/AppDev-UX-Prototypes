import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Flex,
  Badge,
  List,
  ListItem,
  Divider,
  Content,
  Button,
} from '@patternfly/react-core'
import FolderIcon from '@patternfly/react-icons/dist/esm/icons/folder-icon'
import { useDashboard } from '../DashboardProvider'

export function ApplicationsOverview() {
  const { data, navigateTo } = useDashboard()

  return (
    <Card isFullHeight>
      <CardHeader>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }} style={{ gap: 8 }}>
          <CardTitle>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FolderIcon /> Applications
            </span>
          </CardTitle>
          <Button variant="link" onClick={() => navigateTo('/applications')}>View all</Button>
        </Flex>
      </CardHeader>
      <CardBody>
        <List isPlain>
          {data.applications.map((app) => (
            <ListItem key={app.name} style={{ paddingTop: 8, paddingBottom: 8 }}>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }} style={{ gap: 8 }}>
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.name}</span>
                <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ gap: 8 }} flexWrap={{ default: 'wrap' }}>
                  <Badge isRead={app.statusVariant === 'read'}>{app.status}</Badge>
                  <span style={{ fontSize: 'var(--pf-v6-global--FontSize--sm)', color: 'var(--pf-v6-global--Color--200)' }}>
                    {app.category}
                  </span>
                </Flex>
              </Flex>
            </ListItem>
          ))}
        </List>
        <Divider style={{ margin: '12px 0' }} />
        <Content>
          <p style={{ margin: 0 }}>
            <strong>Total applications</strong> {data.summary.totalApplications}
          </p>
        </Content>
      </CardBody>
    </Card>
  )
}
