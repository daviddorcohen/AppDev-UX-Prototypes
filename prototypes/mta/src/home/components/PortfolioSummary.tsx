import React from 'react'
import {
  Flex,
  FlexItem,
  Content,
  Title,
  Label,
} from '@patternfly/react-core'
import { PortfolioStage } from '../types'

interface PortfolioSummaryProps {
  stages: PortfolioStage[]
  totalApps: number
}

export function PortfolioSummary({ stages, totalApps }: PortfolioSummaryProps) {
  return (
    <div>
      <Title headingLevel="h2" size="lg" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
        Portfolio
      </Title>
      <Content component="p" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
        {totalApps} applications across {stages.filter((s) => s.count > 0).length} stages
      </Content>
      <Flex spaceItems={{ default: 'spaceItemsLg' }} flexWrap={{ default: 'wrap' }}>
        {stages.map((stage) => (
          <FlexItem key={stage.label}>
            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
              <FlexItem>
                <Label variant={stage.count > 0 ? 'filled' : 'outline'}>
                  {stage.count}
                </Label>
              </FlexItem>
              <FlexItem>
                <Content component="small">{stage.label}</Content>
              </FlexItem>
            </Flex>
          </FlexItem>
        ))}
      </Flex>
    </div>
  )
}
