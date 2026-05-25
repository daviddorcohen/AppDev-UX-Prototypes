import { useMemo, useState, useCallback } from 'react'
import React from 'react'
import {
  Title,
  Stack,
  Card,
  CardBody,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  Gallery,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  type MenuToggleElement,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'

type RiskCategory = 'High' | 'Medium' | 'Low' | 'Unknown' | 'Unassessed'

type RiskStat = {
  label: RiskCategory
  count: number
  color: string
}

const RISK_STATS: RiskStat[] = [
  { label: 'High', count: 3, color: '#c9190b' },
  { label: 'Medium', count: 5, color: '#f0ab00' },
  { label: 'Low', count: 8, color: '#3e8635' },
  { label: 'Unknown', count: 2, color: '#6a6e73' },
  { label: 'Unassessed', count: 4, color: '#b8bbbe' },
]

type IdentifiedRisk = {
  id: string
  questionnaire: string
  section: string
  question: string
  answer: string
  risk: RiskCategory
}

const MOCK_RISKS: IdentifiedRisk[] = [
  {
    id: '1',
    questionnaire: 'Cloud Readiness',
    section: 'Application Architecture',
    question: 'Does the application use a monolithic architecture?',
    answer: 'Yes, single deployable unit',
    risk: 'High',
  },
  {
    id: '2',
    questionnaire: 'Cloud Readiness',
    section: 'Data Management',
    question: 'How is application data persisted?',
    answer: 'Relational database with ORM',
    risk: 'Medium',
  },
  {
    id: '3',
    questionnaire: 'Application Modernization',
    section: 'Dependencies',
    question: 'Are third-party dependencies up to date?',
    answer: 'Most are current',
    risk: 'Low',
  },
  {
    id: '4',
    questionnaire: 'Application Modernization',
    section: 'Observability',
    question: 'Is structured logging in place?',
    answer: 'No logging framework configured',
    risk: 'High',
  },
]

const QUESTIONNAIRES = ['All questionnaires', 'Cloud Readiness', 'Application Modernization']

const riskColor: Record<RiskCategory, string> = {
  High: '#c9190b',
  Medium: '#f0ab00',
  Low: '#3e8635',
  Unknown: '#6a6e73',
  Unassessed: '#b8bbbe',
}

export function Reports() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [questionnaireFilter, setQuestionnaireFilter] = useState('All questionnaires')
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered = useMemo(() => {
    if (questionnaireFilter === 'All questionnaires') return MOCK_RISKS
    return MOCK_RISKS.filter((r) => r.questionnaire === questionnaireFilter)
  }, [questionnaireFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const onSetPage = useCallback((_: unknown, newPage: number) => setPage(newPage), [])
  const onPerPageSelect = useCallback((_: unknown, newPerPage: number) => {
    setPerPage(newPerPage)
    setPage(1)
  }, [])

  const onFilterSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    setQuestionnaireFilter(String(value))
    setFilterOpen(false)
    setPage(1)
  }

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Title headingLevel="h1">Reports</Title>

      <Title headingLevel="h2" size="lg" className="pf-v6-u-mt-md">Current landscape</Title>
      <Gallery hasGutter minWidths={{ default: '160px' }} maxWidths={{ default: '220px' }}>
        {RISK_STATS.map((stat) => (
          <Card key={stat.label} isCompact>
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: stat.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontWeight: 600 }}>{stat.label} risk</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: 4 }}>{stat.count}</div>
            </CardBody>
          </Card>
        ))}
      </Gallery>

      <Title headingLevel="h2" size="lg" className="pf-v6-u-mt-lg">Identified risks</Title>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Select
              isOpen={filterOpen}
              onOpenChange={setFilterOpen}
              onSelect={onFilterSelect}
              selected={questionnaireFilter}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setFilterOpen(!filterOpen)}
                  isExpanded={filterOpen}
                  style={{ minWidth: 220 }}
                >
                  {questionnaireFilter}
                </MenuToggle>
              )}
            >
              <SelectList>
                {QUESTIONNAIRES.map((q) => (
                  <SelectOption key={q} value={q}>{q}</SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Pagination
        itemCount={filtered.length}
        page={page}
        perPage={perPage}
        onSetPage={onSetPage}
        onPerPageSelect={onPerPageSelect}
        variant="top"
      />
      <Table aria-label="Identified risks table">
        <Thead>
          <Tr>
            <Th>Questionnaire name</Th>
            <Th>Section</Th>
            <Th>Question</Th>
            <Th>Answer</Th>
            <Th>Risk</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((risk) => (
            <Tr key={risk.id}>
              <Td dataLabel="Questionnaire name">{risk.questionnaire}</Td>
              <Td dataLabel="Section">{risk.section}</Td>
              <Td dataLabel="Question" modifier="breakWord">{risk.question}</Td>
              <Td dataLabel="Answer" modifier="breakWord">{risk.answer}</Td>
              <Td dataLabel="Risk">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: riskColor[risk.risk],
                    }}
                  />
                  {risk.risk}
                </span>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination
        itemCount={filtered.length}
        page={page}
        perPage={perPage}
        onSetPage={onSetPage}
        onPerPageSelect={onPerPageSelect}
        variant="bottom"
      />
    </Stack>
  )
}
