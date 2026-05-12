import React from 'react'

export type PhaseStatus = 'complete' | 'current' | 'pending'

export interface MigrationPhase {
  id: string
  label: string
  status: PhaseStatus
  description: string
}

export type PrerequisiteStatus = 'complete' | 'partial' | 'incomplete'

export interface PrerequisiteItem {
  id: string
  title: string
  status: PrerequisiteStatus
  summary: string
  unlocks: string[]
  actionLabel: string
  actionTo: string
  icon: React.ComponentType<{ style?: React.CSSProperties }>
}

export interface PortfolioStage {
  label: string
  count: number
}

export interface HomeData {
  phases: MigrationPhase[]
  prerequisites: PrerequisiteItem[]
  portfolioStages: PortfolioStage[]
  totalApps: number
}
