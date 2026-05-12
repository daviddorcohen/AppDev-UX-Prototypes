import React from 'react'
import {
  Card,
  CardBody,
  Flex,
  FlexItem,
  Button,
  Content,
  Title,
} from '@patternfly/react-core'
import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon'
import { PrerequisiteItem } from '../types'

interface PrimaryActionProps {
  prerequisites: PrerequisiteItem[]
  onNavigate: (path: string) => void
  onOpenWizard: (wizardId: string) => void
}

interface ComputedAction {
  title: string
  description: string
  buttonLabel: string
  handler: () => void
}

function computeAction(
  prerequisites: PrerequisiteItem[],
  onNavigate: (path: string) => void,
  onOpenWizard: (wizardId: string) => void,
): ComputedAction {
  const credentials = prerequisites.find((p) => p.id === 'credentials')
  const archetypes = prerequisites.find((p) => p.id === 'archetypes')
  const sourceRepos = prerequisites.find((p) => p.id === 'source-repos')

  if (credentials?.status === 'incomplete') {
    return {
      title: 'Configure credentials to unblock analysis',
      description:
        '5 applications need credentials before code analysis can run. This is the most impactful next step.',
      buttonLabel: 'Configure credentials',
      handler: () => onNavigate(credentials.actionTo),
    }
  }

  if (sourceRepos?.status === 'partial') {
    return {
      title: 'Finish configuring source repositories',
      description:
        '5 applications still need repository details. Completing this enables analysis for your full portfolio.',
      buttonLabel: 'Configure repositories',
      handler: () => onNavigate(sourceRepos.actionTo),
    }
  }

  if (archetypes?.status === 'incomplete') {
    return {
      title: 'Define archetypes for bulk assessment',
      description:
        'Archetypes let you group similar applications and assess them together. Define at least one to get started.',
      buttonLabel: 'Define archetypes',
      handler: () => onNavigate(archetypes.actionTo),
    }
  }

  const allComplete = prerequisites.every((p) => p.status === 'complete')
  if (allComplete) {
    return {
      title: 'Run analysis on your portfolio',
      description:
        'All prerequisites are configured. Run a static code analysis to identify migration issues across your applications.',
      buttonLabel: 'New analysis report',
      handler: () => onOpenWizard('analysis'),
    }
  }

  return {
    title: 'Continue setting up your migration',
    description: 'Resolve the remaining prerequisites above to unlock all migration capabilities.',
    buttonLabel: 'View applications',
    handler: () => onNavigate('/applications'),
  }
}

export function PrimaryAction({ prerequisites, onNavigate, onOpenWizard }: PrimaryActionProps) {
  const action = computeAction(prerequisites, onNavigate, onOpenWizard)

  return (
    <Card>
      <CardBody>
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          flexWrap={{ default: 'wrap' }}
          spaceItems={{ default: 'spaceItemsMd' }}
        >
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }} flex={{ default: 'flex_1' }}>
            <FlexItem>
              <Title headingLevel="h3" size="md">{action.title}</Title>
            </FlexItem>
            <FlexItem>
              <Content component="p">{action.description}</Content>
            </FlexItem>
          </Flex>
          <FlexItem>
            <Button
              variant="primary"
              icon={<ArrowRightIcon />}
              iconPosition="end"
              onClick={action.handler}
            >
              {action.buttonLabel}
            </Button>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  )
}
