import React from 'react'
import {
  Grid,
  GridItem,
  Content,
  Flex,
  FlexItem,
  Label,
  Title,
} from '@patternfly/react-core'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import { PrerequisiteItem } from '../types'
import { PrerequisiteCard } from './PrerequisiteCard'

interface PrerequisiteSectionProps {
  items: PrerequisiteItem[]
  onNavigate: (path: string) => void
}

export function PrerequisiteSection({ items, onNavigate }: PrerequisiteSectionProps) {
  const incomplete = items.filter((i) => i.status !== 'complete')
  const completeCount = items.filter((i) => i.status === 'complete').length

  if (incomplete.length === 0) {
    return (
      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
        <FlexItem>
          <Label color="green" icon={<CheckCircleIcon />}>
            All {items.length} prerequisites configured
          </Label>
        </FlexItem>
      </Flex>
    )
  }

  return (
    <div>
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        spaceItems={{ default: 'spaceItemsSm' }}
        style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
      >
        <FlexItem>
          <Title headingLevel="h2" size="lg">Prerequisites</Title>
        </FlexItem>
        <FlexItem>
          <Content component="small">
            {completeCount} of {items.length} complete
          </Content>
        </FlexItem>
      </Flex>
      <Grid hasGutter>
        {incomplete.map((item) => (
          <GridItem key={item.id} span={12} lg={6}>
            <PrerequisiteCard item={item} onNavigate={onNavigate} />
          </GridItem>
        ))}
      </Grid>
    </div>
  )
}
