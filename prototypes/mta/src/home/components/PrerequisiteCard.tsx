import React from 'react'
import {
  Card,
  CardBody,
  Flex,
  FlexItem,
  Label,
  Button,
  HelperText,
  HelperTextItem,
  Content,
} from '@patternfly/react-core'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon'
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon'
import { PrerequisiteItem } from '../types'

function statusColor(status: PrerequisiteItem['status']) {
  switch (status) {
    case 'complete':
      return 'green' as const
    case 'partial':
      return 'orange' as const
    case 'incomplete':
      return 'red' as const
  }
}

function statusLabel(status: PrerequisiteItem['status']) {
  switch (status) {
    case 'complete':
      return 'Complete'
    case 'partial':
      return 'Partial'
    case 'incomplete':
      return 'Not started'
  }
}

function StatusIcon({ status }: { status: PrerequisiteItem['status'] }) {
  switch (status) {
    case 'complete':
      return <CheckCircleIcon />
    case 'partial':
      return <ExclamationTriangleIcon />
    case 'incomplete':
      return <ExclamationCircleIcon />
  }
}

interface PrerequisiteCardProps {
  item: PrerequisiteItem
  onNavigate: (path: string) => void
}

export function PrerequisiteCard({ item, onNavigate }: PrerequisiteCardProps) {
  const Icon = item.icon

  return (
    <Card isFullHeight>
      <CardBody>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>
              <Icon style={{ fontSize: '1.25rem', color: 'var(--pf-t--global--text--color--subtle)' }} />
            </FlexItem>
            <FlexItem grow={{ default: 'grow' }}>
              <Content component="p"><strong>{item.title}</strong></Content>
            </FlexItem>
            <FlexItem>
              <Label color={statusColor(item.status)} icon={<StatusIcon status={item.status} />}>
                {statusLabel(item.status)}
              </Label>
            </FlexItem>
          </Flex>

          <Content component="p">{item.summary}</Content>

          <HelperText>
            <HelperTextItem variant="indeterminate">
              Unlocks: {item.unlocks.join(', ')}
            </HelperTextItem>
          </HelperText>

          {item.status !== 'complete' && (
            <FlexItem>
              <Button
                variant="link"
                isInline
                onClick={() => onNavigate(item.actionTo)}
              >
                {item.actionLabel}
              </Button>
            </FlexItem>
          )}
        </Flex>
      </CardBody>
    </Card>
  )
}
