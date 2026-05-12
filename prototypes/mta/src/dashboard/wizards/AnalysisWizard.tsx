import React, { useState } from 'react'
import {
  Modal,
  ModalVariant,
  Wizard,
  WizardStep,
  WizardHeader,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  Radio,
  Stack,
  Flex,
  FlexItem,
  Content,
  Title,
  Icon,
  Switch,
  Checkbox,
  Card,
  CardBody,
  Grid,
  GridItem,
  Alert,
  Badge,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateFooter,
  Button,
  Tabs,
  Tab,
  TabTitleText,
} from '@patternfly/react-core'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon'
import ServerIcon from '@patternfly/react-icons/dist/esm/icons/server-icon'
import CloudIcon from '@patternfly/react-icons/dist/esm/icons/cloud-icon'
import LeafIcon from '@patternfly/react-icons/dist/esm/icons/leaf-icon'
import BoltIcon from '@patternfly/react-icons/dist/esm/icons/bolt-icon'
import BoxOpenIcon from '@patternfly/react-icons/dist/esm/icons/box-open-icon'
import CoffeeIcon from '@patternfly/react-icons/dist/esm/icons/coffee-icon'
import ExchangeAltIcon from '@patternfly/react-icons/dist/esm/icons/exchange-alt-icon'
import LinuxIcon from '@patternfly/react-icons/dist/esm/icons/linux-icon'
import LayerGroupIcon from '@patternfly/react-icons/dist/esm/icons/layer-group-icon'
import GlobeIcon from '@patternfly/react-icons/dist/esm/icons/globe-icon'
import ShareAltIcon from '@patternfly/react-icons/dist/esm/icons/share-alt-icon'
import RouteIcon from '@patternfly/react-icons/dist/esm/icons/route-icon'
import CloudUploadAltIcon from '@patternfly/react-icons/dist/esm/icons/cloud-upload-alt-icon'
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon'
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon'
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table'

const inventoryApps = [
  { name: 'Application 1', status: 'Ready', service: 'lorem ipsum' },
  { name: 'Application 2', status: 'Ready', service: 'lorem ipsum' },
]

const analysisTargets: { name: string; dropdown: string; description: string; language: string; icon: React.ComponentType<{ style?: React.CSSProperties }> }[] = [
  { name: 'Application server migration to', dropdown: 'JBoss EAP 8', description: 'Upgrade to the latest Release of JBoss EAP or migrate your applications to JBoss EAP from other Enterprise Application', language: 'Java', icon: ServerIcon },
  { name: 'Containerization', dropdown: '', description: 'A comprehensive set of cloud and container readiness rules to assess applications for suitability for deployment on Kubernetes', language: 'Java', icon: CloudIcon },
  { name: 'Spring Framework', dropdown: 'Spring Framework 6', description: 'Upgrade to the latest release of Spring Framework.', language: 'Java', icon: LeafIcon },
  { name: 'Spring Boot', dropdown: 'Spring Boot 3', description: 'Upgrade to the latest release of Spring Boot.', language: 'Java', icon: BoltIcon },
  { name: 'Quarkus', dropdown: '', description: 'Rules to support the migration of Spring Boot applications to Quarkus.', language: 'Java', icon: BoxOpenIcon },
  { name: 'OpenJDK', dropdown: 'OpenJDK 11', description: 'Rules to support upgrading the version of OpenJDK. Migrate to OpenJDK 11, OpenJDK 17 or OpenJDK 21.', language: 'Java', icon: CoffeeIcon },
  { name: 'OracleJDK to OpenJDK', dropdown: '', description: 'Rules to support migration to OpenJDK from OracleJDK.', language: 'Java', icon: ExchangeAltIcon },
  { name: 'Linux', dropdown: '', description: 'Ensure there are no Microsoft Windows paths hard coded into your applications.', language: 'Java', icon: LinuxIcon },
  { name: 'Jakarta EE 9', dropdown: '', description: 'A collection of rules to support migrating applications from Java EE 8 to Jakarta EE 9. The rules cover project dependencies, package renaming, updated XML Schema namespaces,', language: 'Java', icon: LayerGroupIcon },
  { name: 'JBoss Web Server 6', dropdown: '', description: 'A collection of rules to support migrating from JWS 5 to JWS 6.', language: 'Java', icon: GlobeIcon },
  { name: 'Open Liberty', dropdown: '', description: 'A comprehensive set of rules for migrating traditional WebSphere applications to Open Liberty.', language: 'Java', icon: ShareAltIcon },
  { name: 'Camel', dropdown: 'camel:3', description: 'A comprehensive set of rules for migration from Apache Camel 2 to 3 and Camel 3 to 4.', language: 'Java', icon: RouteIcon },
  { name: 'Azure', dropdown: 'Azure App Service', description: 'Upgrade your Java application so it can be deployed on Azure App Service.', language: 'Java', icon: CloudUploadAltIcon },
]

interface AnalysisWizardProps {
  isOpen: boolean
  onClose: () => void
}

export function AnalysisWizard({ isOpen, onClose }: AnalysisWizardProps) {
  const [appSource, setAppSource] = useState<'existing' | 'new'>('existing')
  const [selectedApp, setSelectedApp] = useState(0)

  const [repoUrl, setRepoUrl] = useState('')
  const [repoBranch, setRepoBranch] = useState('')
  const [repoRootPath, setRepoRootPath] = useState('')

  const [analysisSource, setAnalysisSource] = useState('source-deps')
  const [selectedTargets, setSelectedTargets] = useState<number[]>([])
  const [scopeOption, setScopeOption] = useState('internal')
  const [excludePackages, setExcludePackages] = useState(false)

  const [customRulesTab, setCustomRulesTab] = useState(0)
  const [enableAutoTagging, setEnableAutoTagging] = useState(true)
  const [enableEnhancedDetails, setEnableEnhancedDetails] = useState(false)

  const resetState = () => {
    setAppSource('existing')
    setSelectedApp(0)
    setRepoUrl('')
    setRepoBranch('')
    setRepoRootPath('')
    setAnalysisSource('source-deps')
    setSelectedTargets([])
    setScopeOption('internal')
    setExcludePackages(false)
    setCustomRulesTab(0)
    setEnableAutoTagging(true)
    setEnableEnhancedDetails(false)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const toggleTarget = (idx: number) => {
    setSelectedTargets((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  const hasCredentialIssue = true
  const hasRepoIssue = false

  const showPrereqAlert = hasCredentialIssue || hasRepoIssue

  const stepSelectApp = (
    <Stack hasGutter>
      {showPrereqAlert && (
        <Alert
          variant="warning"
          isInline
          title="Some prerequisites are incomplete"
          actionLinks={
            <Button variant="link" isInline onClick={() => onClose()}>
              Resolve on Migration Home
            </Button>
          }
        >
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
            {!hasRepoIssue && (
              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                <Icon status="success"><CheckCircleIcon /></Icon>
                <FlexItem>Source repositories — configured</FlexItem>
              </Flex>
            )}
            {hasRepoIssue && (
              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                <Icon status="warning"><ExclamationTriangleIcon /></Icon>
                <FlexItem>Source repositories — 5 apps missing</FlexItem>
              </Flex>
            )}
            {hasCredentialIssue && (
              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                <Icon status="warning"><ExclamationTriangleIcon /></Icon>
                <FlexItem>Credentials — 5 apps need credentials for private repos</FlexItem>
              </Flex>
            )}
            {!hasCredentialIssue && (
              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                <Icon status="success"><CheckCircleIcon /></Icon>
                <FlexItem>Credentials — configured</FlexItem>
              </Flex>
            )}
          </Flex>
          <Content component="small" style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
            You can continue, but analysis may fail for apps without credentials.
          </Content>
        </Alert>
      )}
      <div>
        <Title headingLevel="h2">Select application</Title>
        <Content component="p">Select the application you want to analyze</Content>
      </div>
      <Flex spaceItems={{ default: 'spaceItemsXl' }}>
        <FlexItem>
          <Radio
            id="analysis-app-existing"
            name="analysis-app-source"
            label="Existing applications"
            isChecked={appSource === 'existing'}
            onChange={() => setAppSource('existing')}
          />
        </FlexItem>
        <FlexItem>
          <Radio
            id="analysis-app-new"
            name="analysis-app-source"
            label="New application"
            isChecked={appSource === 'new'}
            onChange={() => setAppSource('new')}
          />
        </FlexItem>
      </Flex>
      {appSource === 'existing' && (
        <div
          style={{
            border: '1px solid var(--pf-t--global--border--color--default)',
            borderRadius: 'var(--pf-t--global--border--radius--small)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: 'var(--pf-t--global--spacer--md)', fontWeight: 700 }}>
            Applications
          </div>
          <Table aria-label="Select application" variant="compact" borders={false} style={{ tableLayout: 'fixed', width: '100%' }}>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Business service</Th>
              </Tr>
            </Thead>
            <Tbody>
              {inventoryApps.map((app, idx) => (
                <Tr key={app.name}>
                  <Td dataLabel="Name">
                    <Radio
                      id={`analysis-app-row-${idx}`}
                      name="analysis-app-row-select"
                      label={app.name}
                      isChecked={selectedApp === idx}
                      onChange={() => setSelectedApp(idx)}
                    />
                  </Td>
                  <Td dataLabel="Status">
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <Icon status="success"><CheckCircleIcon /></Icon>
                      <FlexItem>{app.status}</FlexItem>
                    </Flex>
                  </Td>
                  <Td dataLabel="Business service">
                    <span style={{ fontStyle: 'italic' }}>{app.service}</span>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </Stack>
  )

  const stepSourceRepo = (
    <Stack hasGutter>
      <Title headingLevel="h2">Source code repository</Title>
      <Content component="p">
        Provide the source code repository details for the application
      </Content>
      <FormGroup label="Source repository" fieldId="analysis-repo-url">
        <TextInput
          id="analysis-repo-url"
          value={repoUrl}
          onChange={(_e, val) => setRepoUrl(val)}
          placeholder="https://github.com/org/repo.git"
        />
      </FormGroup>
      <FormGroup label="Branch" fieldId="analysis-repo-branch">
        <TextInput
          id="analysis-repo-branch"
          value={repoBranch}
          onChange={(_e, val) => setRepoBranch(val)}
          placeholder="main"
        />
      </FormGroup>
      <FormGroup label="Root path" fieldId="analysis-repo-root">
        <TextInput
          id="analysis-repo-root"
          value={repoRootPath}
          onChange={(_e, val) => setRepoRootPath(val)}
          placeholder="/"
        />
      </FormGroup>
    </Stack>
  )

  const stepAnalysisMode = (
    <Stack hasGutter>
      <Title headingLevel="h2">Analysis mode</Title>
      <FormGroup label="Source for analysis" isRequired fieldId="analysis-source">
        <FormSelect
          id="analysis-source"
          value={analysisSource}
          onChange={(_e, val) => setAnalysisSource(val)}
          aria-label="Source for analysis"
        >
          <FormSelectOption value="source-deps" label="Source code + dependencies" />
          <FormSelectOption value="source-only" label="Source code only" />
          <FormSelectOption value="deps-only" label="Dependencies only" />
          <FormSelectOption value="binary" label="Binary" />
        </FormSelect>
      </FormGroup>
    </Stack>
  )

  const stepSetTargets = (
    <Stack hasGutter>
      <Title headingLevel="h2">Set targets</Title>
      <Content component="p">
        Select one or more target options in focus for the analysis report
      </Content>
      <Alert
        variant="warning"
        isInline
        isPlain
        title="Target selection can be skipped if custom rules file(s) are used"
      />
      <Grid hasGutter>
        {analysisTargets.map((target, idx) => {
          const isSelected = selectedTargets.includes(idx)
          const TargetIcon = target.icon
          return (
            <GridItem key={target.name} span={12} md={4}>
              <Card
                isFullHeight
                isClickable
                isSelectable
                isSelected={isSelected}
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => toggleTarget(idx)}
              >
                <CardBody>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--pf-t--global--spacer--xs)',
                      backgroundColor: 'var(--pf-t--global--color--nonstatus--blue--default)',
                      color: 'white',
                      borderRadius: 'var(--pf-t--global--border--radius--pill)',
                      padding: '2px 8px',
                      fontSize: 'var(--pf-t--global--font--size--xs)',
                      fontWeight: 700,
                    }}>
                      <InfoCircleIcon style={{ fontSize: '0.75rem' }} />
                      {target.language}
                    </span>
                    <Checkbox
                      id={`target-check-${idx}`}
                      isChecked={isSelected}
                      onChange={() => toggleTarget(idx)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${target.name}`}
                    />
                  </Flex>
                  <div style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--lg) 0 var(--pf-t--global--spacer--sm)' }}>
                    <TargetIcon style={{ fontSize: '3rem', color: 'var(--pf-t--global--text--color--regular)' }} />
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                    <Title headingLevel="h4" size="md">{target.name}</Title>
                  </div>
                  {target.dropdown && (
                    <div style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                      <FormSelect
                        aria-label={`${target.name} version`}
                        value={target.dropdown}
                        isDisabled
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FormSelectOption value={target.dropdown} label={target.dropdown} />
                      </FormSelect>
                    </div>
                  )}
                  <Content component="p">{target.description}</Content>
                </CardBody>
              </Card>
            </GridItem>
          )
        })}
      </Grid>
    </Stack>
  )

  const stepScope = (
    <Stack hasGutter>
      <Title headingLevel="h2">Scope</Title>
      <Content component="p">
        Select the scope of dependencies you wish to include in your analysis
      </Content>
      <Radio
        id="scope-internal"
        name="scope-option"
        label="Application and internal dependencies only"
        isChecked={scopeOption === 'internal'}
        onChange={() => setScopeOption('internal')}
      />
      <Radio
        id="scope-all"
        name="scope-option"
        label="Application and all dependencies, including known open source libraries"
        isChecked={scopeOption === 'all'}
        onChange={() => setScopeOption('all')}
      />
      <Radio
        id="scope-packages"
        name="scope-option"
        label="Add the list of packages to be analyzed"
        isChecked={scopeOption === 'packages'}
        onChange={() => setScopeOption('packages')}
      />
      <Switch
        id="exclude-packages"
        label="Exclude packages"
        isChecked={excludePackages}
        onChange={(_e, checked) => setExcludePackages(checked)}
      />
    </Stack>
  )

  const stepCustomRules = (
    <Stack hasGutter>
      <Title headingLevel="h2">Custom rules</Title>
      <Content component="p">
        Include rules for the analysis by uploading or importing from a repository.
      </Content>
      <Alert
        variant="warning"
        isInline
        isPlain
        title="At least one custom rule file is required if no targets are selected."
      />
      <Tabs activeKey={customRulesTab} onSelect={(_e, key) => setCustomRulesTab(key as number)}>
        <Tab eventKey={0} title={<TabTitleText>Manual</TabTitleText>}>
          <EmptyState icon={CubesIcon} titleText="No custom rules available" headingLevel="h4">
            <EmptyStateBody>Add rules</EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="primary">Add rules</Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Repository</TabTitleText>}>
          <EmptyState icon={CubesIcon} titleText="No repository rules configured" headingLevel="h4">
            <EmptyStateBody>Configure a repository to import rules.</EmptyStateBody>
          </EmptyState>
        </Tab>
      </Tabs>
    </Stack>
  )

  const stepOptions = (
    <Stack hasGutter>
      <Title headingLevel="h2">Options</Title>
      <Content component="p">
        Configure additional analysis options.
      </Content>
      <FormGroup label="Additional target labels" fieldId="target-labels">
        <FormSelect id="target-labels" aria-label="Additional target labels">
          <FormSelectOption value="" label="" />
        </FormSelect>
      </FormGroup>
      <FormGroup label="Additional source labels" fieldId="source-labels">
        <FormSelect id="source-labels" aria-label="Additional source labels">
          <FormSelectOption value="" label="" />
        </FormSelect>
      </FormGroup>
      <FormGroup label="Excluded rules labels" fieldId="excluded-rules">
        <Flex>
          <FlexItem grow={{ default: 'grow' }}>
            <TextInput id="excluded-rules" aria-label="Excluded rules labels" />
          </FlexItem>
          <Button variant="secondary">Add</Button>
        </Flex>
      </FormGroup>
      <Checkbox
        id="enable-auto-tagging"
        label="Enable automated tagging"
        isChecked={enableAutoTagging}
        onChange={(_e, checked) => setEnableAutoTagging(checked)}
      />
      <Checkbox
        id="enable-enhanced-details"
        label="Enable enhanced analysis details"
        isChecked={enableEnhancedDetails}
        onChange={(_e, checked) => setEnableEnhancedDetails(checked)}
      />
    </Stack>
  )

  const scopeLabel =
    scopeOption === 'internal'
      ? 'Application and internal dependencies'
      : scopeOption === 'all'
        ? 'Application and all dependencies'
        : 'Custom package list'

  const sourceLabel =
    analysisSource === 'source-deps'
      ? 'Source code + dependencies'
      : analysisSource === 'source-only'
        ? 'Source code only'
        : analysisSource === 'deps-only'
          ? 'Dependencies only'
          : 'Binary'

  const stepReview = (
    <Stack hasGutter>
      <Title headingLevel="h2">Review analysis details</Title>
      <Content component="p">
        Review the information below, then run the analysis.
      </Content>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>Applications</DescriptionListTerm>
          <DescriptionListDescription>
            {inventoryApps[selectedApp].name}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Mode</DescriptionListTerm>
          <DescriptionListDescription>{sourceLabel}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Targets</DescriptionListTerm>
          <DescriptionListDescription>
            {selectedTargets.length > 0
              ? selectedTargets.map((i) => analysisTargets[i].name).join(', ')
              : 'None selected'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Target rule labels</DescriptionListTerm>
          <DescriptionListDescription>None</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Source rule labels</DescriptionListTerm>
          <DescriptionListDescription>None</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Scope</DescriptionListTerm>
          <DescriptionListDescription>{scopeLabel}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Included packages</DescriptionListTerm>
          <DescriptionListDescription>None</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Excluded packages</DescriptionListTerm>
          <DescriptionListDescription>None</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Custom rules</DescriptionListTerm>
          <DescriptionListDescription>None</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Additional target labels</DescriptionListTerm>
          <DescriptionListDescription>None</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Additional source labels</DescriptionListTerm>
          <DescriptionListDescription>None</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Excluded rules</DescriptionListTerm>
          <DescriptionListDescription>None</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </Stack>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      aria-label="Analysis report wizard"
      variant={ModalVariant.large}
      style={{ overflow: 'hidden' }}
    >
      <Wizard
        height={600}
        width="100%"
        className="migrate-wizard"
        onClose={handleClose}
        onSave={handleClose}
        header={
          <WizardHeader
            title="Analysis report"
            description="Configure and run a static code analysis on your applications"
            onClose={handleClose}
          />
        }
      >
        <WizardStep name="Select application" id="analysis-step-select-app">
          {stepSelectApp}
        </WizardStep>
        <WizardStep name="Source code repository" id="analysis-step-source-repo">
          {stepSourceRepo}
        </WizardStep>
        <WizardStep
          name="Configure analysis"
          id="analysis-step-configure"
          steps={[
            <WizardStep name="Analysis mode" id="analysis-step-mode" key="mode">
              {stepAnalysisMode}
            </WizardStep>,
            <WizardStep name="Set targets" id="analysis-step-targets" key="targets">
              {stepSetTargets}
            </WizardStep>,
            <WizardStep name="Scope" id="analysis-step-scope" key="scope">
              {stepScope}
            </WizardStep>,
          ]}
        />
        <WizardStep
          name="Advanced"
          id="analysis-step-advanced"
          steps={[
            <WizardStep name="Custom rules" id="analysis-step-custom-rules" key="custom-rules">
              {stepCustomRules}
            </WizardStep>,
            <WizardStep name="Option" id="analysis-step-option" key="option">
              {stepOptions}
            </WizardStep>,
          ]}
        />
        <WizardStep
          name="Review"
          id="analysis-step-review"
          footer={{ nextButtonText: 'Run analysis' }}
        >
          {stepReview}
        </WizardStep>
      </Wizard>
    </Modal>
  )
}
