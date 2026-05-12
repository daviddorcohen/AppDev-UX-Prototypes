import React from 'react'
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Stack,
  Flex,
  Title,
  Content,
} from '@patternfly/react-core'
import { useDashboard } from '../DashboardProvider'

export function SummaryStats() {
  const { data, navigateTo } = useDashboard()

  return (
    <Grid hasGutter>
      {data.summaryStats.map(({ icon: Icon, value, label, detail, to }) => (
        <GridItem key={label} span={12} sm={6} lg={3}>
          <Card
            isClickable={!!to}
            aria-label={label}
            onClick={() => to && navigateTo(to)}
          >
            <CardBody>
              <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <Icon />
                <Stack>
                  <Title headingLevel="h3" size="2xl">{value}</Title>
                  <Content component="p">{label}</Content>
                  <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                    {detail}
                  </Content>
                </Stack>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
      ))}
    </Grid>
  )
}
