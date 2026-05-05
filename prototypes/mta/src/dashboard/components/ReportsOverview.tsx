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
} from '@patternfly/react-core'
import FileAltIcon from '@patternfly/react-icons/dist/esm/icons/file-alt-icon'
import { useDashboard } from '../DashboardProvider'

export function ReportsOverview() {
  const { data, navigateTo } = useDashboard()

  return (
    <Card isFullHeight>
      <CardHeader>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }} style={{ gap: 8 }}>
          <CardTitle>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileAltIcon /> Latest Analysis Reports
            </span>
          </CardTitle>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/reports') }} style={{ cursor: 'pointer' }}>View all</a>
        </Flex>
      </CardHeader>
      <CardBody>
        <List isPlain>
          {data.reports.map((r) => (
            <ListItem key={r.id} style={{ paddingTop: 8, paddingBottom: 8 }}>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }} style={{ gap: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <FileAltIcon />
                  Analysis #{r.id}
                </span>
                <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ gap: 12 }} flexWrap={{ default: 'wrap' }}>
                  <span style={{ fontSize: 'var(--pf-v6-global--FontSize--sm)', color: 'var(--pf-v6-global--Color--200)' }}>
                    {r.date}
                  </span>
                  <span style={{ fontSize: 'var(--pf-v6-global--FontSize--sm)' }}>{r.apps} apps</span>
                  <Badge>{r.status}</Badge>
                </Flex>
              </Flex>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  )
}
