import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Stack,
  Title,
  Divider,
} from '@patternfly/react-core'
import { mockHomeData } from './mock-data'
import { LifecycleStepper } from './components/LifecycleStepper'
import { PrerequisiteSection } from './components/PrerequisiteSection'
import { PrimaryAction } from './components/PrimaryAction'
import { PortfolioSummary } from './components/PortfolioSummary'
import { AnalysisWizard } from '../dashboard/wizards/AnalysisWizard'
import { MigrateWizard } from '../dashboard/wizards/MigrateWizard'
import { BatchMigrationWizard } from '../dashboard/wizards/BatchMigrationWizard'

export function HomePage() {
  const navigate = useNavigate()
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)
  const [isMigrateOpen, setIsMigrateOpen] = useState(false)
  const [isBatchOpen, setIsBatchOpen] = useState(false)

  const handleNavigate = (path: string) => navigate(path)

  const handleOpenWizard = (wizardId: string) => {
    if (wizardId === 'analysis') setIsAnalysisOpen(true)
    else if (wizardId === 'migrate') setIsMigrateOpen(true)
    else if (wizardId === 'batch-migrate') setIsBatchOpen(true)
  }

  const { phases, prerequisites, portfolioStages, totalApps } = mockHomeData

  return (
    <>
      <AnalysisWizard isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />
      <MigrateWizard isOpen={isMigrateOpen} onClose={() => setIsMigrateOpen(false)} />
      <BatchMigrationWizard isOpen={isBatchOpen} onClose={() => setIsBatchOpen(false)} />

      <Stack hasGutter style={{ minWidth: 0 }}>
        <Title headingLevel="h1" size="xl">Migration Home</Title>

        <LifecycleStepper phases={phases} />

        <Divider />

        <PrerequisiteSection items={prerequisites} onNavigate={handleNavigate} />

        <PrimaryAction
          prerequisites={prerequisites}
          onNavigate={handleNavigate}
          onOpenWizard={handleOpenWizard}
        />

        <Divider />

        <PortfolioSummary stages={portfolioStages} totalApps={totalApps} />
      </Stack>
    </>
  )
}
