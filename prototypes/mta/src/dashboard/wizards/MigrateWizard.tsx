import React, { useState } from 'react'
import {
  Modal,
  ModalVariant,
  Wizard,
  WizardStep,
  WizardHeader,
  FormGroup,
  FormFieldGroup,
  FormFieldGroupHeader,
  TextInput,
  FormSelect,
  FormSelectOption,
  Radio,
  Stack,
  Flex,
  FlexItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Content,
  Title,
  Icon,
} from '@patternfly/react-core'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
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

const targetProfiles = [
  { name: 'OpenShift', description: 'Migrate to Red Hat OpenShift Container Platform', status: 'Recommended' },
  { name: 'Kubernetes', description: 'Migrate to upstream Kubernetes', status: 'Available' },
]

interface MigrateWizardProps {
  isOpen: boolean
  onClose: () => void
}

export function MigrateWizard({ isOpen, onClose }: MigrateWizardProps) {
  const [appSource, setAppSource] = useState<'inventory' | 'upload'>('inventory')
  const [selectedApp, setSelectedApp] = useState(0)

  const [repoType, setRepoType] = useState('git')
  const [repoUrl, setRepoUrl] = useState('')
  const [repoBranch, setRepoBranch] = useState('')
  const [repoRootPath, setRepoRootPath] = useState('')

  const [selectedProfile, setSelectedProfile] = useState(0)
  const [outputRendering, setOutputRendering] = useState<'templates' | 'helm'>('templates')

  const resetState = () => {
    setAppSource('inventory')
    setSelectedApp(0)
    setRepoType('git')
    setRepoUrl('')
    setRepoBranch('')
    setRepoRootPath('')
    setSelectedProfile(0)
    setOutputRendering('templates')
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleSave = () => {
    handleClose()
  }

  const stepSelectApp = (
    <Stack hasGutter>
      <div>
        <Title headingLevel="h2">Select application</Title>
        <Content component="p">please select the application you want to migrate</Content>
      </div>
      <Flex spaceItems={{ default: 'spaceItemsXl' }}>
        <FlexItem>
          <Radio
            id="app-source-existing"
            name="app-source"
            label="Existing applications"
            isChecked={appSource === 'inventory'}
            onChange={() => setAppSource('inventory')}
          />
        </FlexItem>
        <FlexItem>
          <Radio
            id="app-source-new"
            name="app-source"
            label="New application"
            isChecked={appSource === 'upload'}
            onChange={() => setAppSource('upload')}
          />
        </FlexItem>
      </Flex>
      {appSource === 'inventory' && (
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
                      id={`app-row-${idx}`}
                      name="app-row-select"
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

  const stepAssetRepo = (
    <Stack hasGutter>
      <Title headingLevel="h2">Asset Repository</Title>
      <Content component="p">
        Add a link to git repository for saving the generated assets
      </Content>
      <FormGroup label="Repository type" fieldId="repo-type">
        <FormSelect
          id="repo-type"
          value={repoType}
          onChange={(_e, val) => setRepoType(val)}
          aria-label="Repository type"
        >
          <FormSelectOption value="git" label="Git" />
          <FormSelectOption value="svn" label="SVN" />
        </FormSelect>
      </FormGroup>
      <FormGroup label="Asset repository" fieldId="repo-url">
        <TextInput
          id="repo-url"
          value={repoUrl}
          onChange={(_e, val) => setRepoUrl(val)}
          placeholder="https://github.com/org/repo.git"
        />
      </FormGroup>
      <FormGroup label="Branch" fieldId="repo-branch">
        <TextInput
          id="repo-branch"
          value={repoBranch}
          onChange={(_e, val) => setRepoBranch(val)}
          placeholder="main"
        />
      </FormGroup>
      <FormGroup label="Root path" fieldId="repo-root-path">
        <TextInput
          id="repo-root-path"
          value={repoRootPath}
          onChange={(_e, val) => setRepoRootPath(val)}
          placeholder="/"
        />
      </FormGroup>
    </Stack>
  )

  const stepTargetProfile = (
    <Stack hasGutter>
      <Title headingLevel="h2">Target Profile</Title>
      <Content component="p">Select a target platform profile for migration</Content>
      <div
        style={{
          border: '1px solid var(--pf-t--global--border--color--default)',
          borderRadius: 'var(--pf-t--global--border--radius--small)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 'var(--pf-t--global--spacer--md)', fontWeight: 700 }}>
          Target profiles
        </div>
        <Table aria-label="Select target profile" variant="compact" borders={false} style={{ tableLayout: 'fixed', width: '100%' }}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {targetProfiles.map((profile, idx) => (
              <Tr key={profile.name}>
                <Td dataLabel="Name">
                  <Radio
                    id={`profile-row-${idx}`}
                    name="profile-row-select"
                    label={profile.name}
                    isChecked={selectedProfile === idx}
                    onChange={() => setSelectedProfile(idx)}
                  />
                </Td>
                <Td dataLabel="Description">{profile.description}</Td>
                <Td dataLabel="Status">{profile.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </Stack>
  )

  const stepOutput = (
    <Stack hasGutter>
      <Title headingLevel="h2">Output rendering</Title>
      <Content component="p">Select how the migration assets should be rendered</Content>
      <Radio
        id="output-templates"
        name="output-rendering"
        label="Render asset templates"
        isChecked={outputRendering === 'templates'}
        onChange={() => setOutputRendering('templates')}
      />
      <Radio
        id="output-helm"
        name="output-rendering"
        label="Render to helm charts and values.yaml"
        isChecked={outputRendering === 'helm'}
        onChange={() => setOutputRendering('helm')}
      />
    </Stack>
  )

  const stepReview = (
    <Stack hasGutter>
      <Title headingLevel="h2">Review details</Title>
      <Content component="p">
        Your application is ready to use {targetProfiles[selectedProfile].name} to
        generate assets. Assets will be generated based on the application discovery
        manifest, target profile, input parameters, and generator settings.
      </Content>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>Application</DescriptionListTerm>
          <DescriptionListDescription>
            {inventoryApps[selectedApp].name}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Target profile</DescriptionListTerm>
          <DescriptionListDescription>
            {targetProfiles[selectedProfile].name}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Asset repository</DescriptionListTerm>
          <DescriptionListDescription>
            <DescriptionList isCompact isHorizontal>
              <DescriptionListGroup>
                <DescriptionListTerm>Type</DescriptionListTerm>
                <DescriptionListDescription>{repoType}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>URL</DescriptionListTerm>
                <DescriptionListDescription>
                  {repoUrl || 'Not specified'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Branch</DescriptionListTerm>
                <DescriptionListDescription>
                  {repoBranch || 'Not specified'}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Output rendering</DescriptionListTerm>
          <DescriptionListDescription>
            {outputRendering === 'templates'
              ? 'Render asset templates'
              : 'Render to helm charts and values.yaml'}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </Stack>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      aria-label="Migrate application wizard"
      variant={ModalVariant.large}
      style={{ overflow: 'hidden' }}
    >
      <Wizard
        height={600}
        width="100%"
        className="migrate-wizard"
        onClose={handleClose}
        onSave={handleSave}
        header={
          <WizardHeader
            title="Generate migration assets"
            description="Generate deployment assets to migrate your application to a target platform"
            onClose={handleClose}
          />
        }
      >
        <WizardStep name="Select application" id="step-select-app">
          {stepSelectApp}
        </WizardStep>
        <WizardStep name="Asset repository" id="step-asset-repo">
          {stepAssetRepo}
        </WizardStep>
        <WizardStep
          name="Generate assets"
          id="step-generate-assets"
          steps={[
            <WizardStep name="Target Profile" id="step-target-profile" key="target-profile">
              {stepTargetProfile}
            </WizardStep>,
            <WizardStep name="Output" id="step-output" key="output">
              {stepOutput}
            </WizardStep>,
          ]}
        />
        <WizardStep
          name="Review"
          id="step-review"
          footer={{ nextButtonText: 'Generate assets' }}
        >
          {stepReview}
        </WizardStep>
      </Wizard>
    </Modal>
  )
}
