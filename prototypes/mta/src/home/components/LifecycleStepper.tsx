import React from 'react'
import {
  ProgressStepper,
  ProgressStep,
} from '@patternfly/react-core'
import { MigrationPhase } from '../types'

function phaseVariant(status: MigrationPhase['status']) {
  switch (status) {
    case 'complete':
      return 'success' as const
    case 'current':
      return 'info' as const
    case 'pending':
      return 'pending' as const
  }
}

interface LifecycleStepperProps {
  phases: MigrationPhase[]
}

export function LifecycleStepper({ phases }: LifecycleStepperProps) {
  return (
    <ProgressStepper aria-label="Migration lifecycle">
      {phases.map((phase) => (
        <ProgressStep
          key={phase.id}
          id={phase.id}
          titleId={`${phase.id}-title`}
          variant={phaseVariant(phase.status)}
          isCurrent={phase.status === 'current'}
          description={phase.description}
          aria-label={phase.label}
        >
          {phase.label}
        </ProgressStep>
      ))}
    </ProgressStepper>
  )
}
