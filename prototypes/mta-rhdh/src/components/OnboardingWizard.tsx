import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  Title,
  Button,
  TextInput,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Alert,
  Spinner,
  Label,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Content,
  HelperText,
  HelperTextItem,
  ProgressStepper,
  ProgressStep,
  ActionList,
  ActionListItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { useMtaStore } from '../store/MtaStore';
import type { ArchetypeMatch } from '../store/MtaStore';

const STEP_LABELS = [
  'Repository URL',
  'Discovery Analysis',
  'Archetype & Target',
  'Review & Confirm',
];

function nameFromUrl(url: string): string {
  try {
    const parts = url.replace(/\/+$/, '').split('/');
    return parts[parts.length - 1] || 'my-application';
  } catch {
    return 'my-application';
  }
}

export function OnboardingWizard() {
  const store = useMtaStore();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  // Step 0 state
  const [repoUrl, setRepoUrl] = useState('');

  // Step 1 state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [discoveredTags, setDiscoveredTags] = useState<string[]>([]);
  const discoveryRan = useRef(false);

  // Step 2 state
  const [archetypeMatch, setArchetypeMatch] = useState<ArchetypeMatch | undefined>(undefined);
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [appName, setAppName] = useState('');

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const repoAlreadyOnboarded = repoUrl.trim().length > 0 && store.isRepoAlreadyOnboarded(repoUrl.trim());

  const targets = archetypeMatch
    ? store.getTargetsForArchetype(archetypeMatch.archetype.id)
    : [];

  const confidencePercent =
    archetypeMatch && archetypeMatch.totalTags > 0
      ? Math.round((archetypeMatch.matchedCount / archetypeMatch.totalTags) * 100)
      : 0;

  const confidenceLabel =
    confidencePercent >= 60 ? 'High' : confidencePercent >= 40 ? 'Medium' : 'Low';

  const selectedTarget = targets.find(t => t.id === selectedTargetId);

  // ---------------------------------------------------------------------------
  // Can the user advance?
  // ---------------------------------------------------------------------------

  const canAdvance = useCallback((): boolean => {
    switch (activeStep) {
      case 0:
        return repoUrl.trim().length > 0 && !repoAlreadyOnboarded;
      case 1:
        return !isAnalyzing && discoveredTags.length > 0;
      case 2:
        return !!archetypeMatch && selectedTargetId.length > 0 && appName.trim().length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }, [activeStep, repoUrl, repoAlreadyOnboarded, isAnalyzing, discoveredTags, archetypeMatch, selectedTargetId, appName]);

  // ---------------------------------------------------------------------------
  // Run discovery when entering step 1
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (activeStep === 1 && !discoveryRan.current) {
      discoveryRan.current = true;
      setIsAnalyzing(true);
      store.simulateDiscovery(repoUrl.trim()).then(tags => {
        setDiscoveredTags(tags);
        setIsAnalyzing(false);

        // Pre-populate archetype match for step 2
        const match = store.matchArchetype(tags);
        setArchetypeMatch(match);

        if (match) {
          const availableTargets = store.getTargetsForArchetype(match.archetype.id);
          if (availableTargets.length > 0) {
            setSelectedTargetId(availableTargets[0].id);
          }
        }

        // Pre-populate app name
        setAppName(nameFromUrl(repoUrl.trim()));
      });
    }
  }, [activeStep, repoUrl, store]);

  // ---------------------------------------------------------------------------
  // Navigation handlers
  // ---------------------------------------------------------------------------

  const handleNext = () => {
    if (activeStep === 3) {
      // Confirm — add the application
      const newId = store.addApplication({
        name: appName.trim(),
        repoUrl: repoUrl.trim(),
        discoveredTags,
        archetypeId: archetypeMatch?.archetype.id ?? '',
        migrationTargetId: selectedTargetId,
        status: 'Not Started',
        issuesCount: 0,
        criticalIssues: 0,
        storyPoints: 0,
        filesAffected: 0,
      });
      navigate(`/applications/${newId}`);
      return;
    }
    setActiveStep((prev: number) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev: number) => Math.max(0, prev - 1));
  };

  const handleCancel = () => {
    navigate('/');
  };

  // ---------------------------------------------------------------------------
  // Step variant helper for ProgressStepper
  // ---------------------------------------------------------------------------

  const stepVariant = (index: number): 'success' | 'info' | 'pending' => {
    if (index < activeStep) return 'success';
    if (index === activeStep) return 'info';
    return 'pending';
  };

  // ---------------------------------------------------------------------------
  // Step content renderers
  // ---------------------------------------------------------------------------

  const renderStep0 = () => (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="lg">
          Repository URL
        </Title>
        <Content component="p" className="pf-v6-u-mt-sm pf-v6-u-color-200">
          Enter the Git repository URL to begin onboarding analysis.
        </Content>
      </StackItem>
      <StackItem>
        <FormGroup label="Repository URL" isRequired fieldId="repo-url">
          <TextInput
            id="repo-url"
            value={repoUrl}
            onChange={(_event: React.FormEvent<HTMLInputElement>, value: string) => setRepoUrl(value)}
            placeholder="https://github.com/org/my-application"
            aria-label="Repository URL"
          />
          <HelperText>
            <HelperTextItem>
              Paste the Git repository URL for the application to analyze
            </HelperTextItem>
          </HelperText>
        </FormGroup>
      </StackItem>
      {repoAlreadyOnboarded && (
        <StackItem>
          <Alert variant="warning" isInline title="This repository has already been onboarded." />
        </StackItem>
      )}
    </Stack>
  );

  const renderStep1 = () => (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="lg">
          Discovery Analysis
        </Title>
        <Content component="p" className="pf-v6-u-mt-sm pf-v6-u-color-200">
          Scanning the repository to discover technologies and frameworks.
        </Content>
      </StackItem>

      {isAnalyzing ? (
        <StackItem>
          <Stack hasGutter>
            <StackItem className="pf-v6-u-text-align-center pf-v6-u-py-xl">
              <Spinner size="lg" aria-label="Analyzing repository" />
              <Content component="p" className="pf-v6-u-mt-md pf-v6-u-font-weight-bold">
                Analyzing repository...
              </Content>
              <Content component="p" className="pf-v6-u-color-200">
                Scanning source code for technology markers
              </Content>
            </StackItem>
          </Stack>
        </StackItem>
      ) : (
        <>
          <StackItem>
            <Content component="p" className="pf-v6-u-mb-sm pf-v6-u-font-weight-bold">
              Discovered Tags
            </Content>
            <div className="pf-v6-u-display-flex pf-v6-u-flex-wrap" style={{ gap: 8 }}>
              {discoveredTags.map(tag => (
                <Label key={tag} variant="outline">
                  {tag}
                </Label>
              ))}
            </div>
          </StackItem>
          <StackItem>
            <HelperText>
              <HelperTextItem icon={<LockIcon />}>
                Tags are discovered automatically and cannot be modified — Set by your organization
              </HelperTextItem>
            </HelperText>
          </StackItem>
        </>
      )}
    </Stack>
  );

  const renderStep2 = () => (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="lg">
          Archetype &amp; Target
        </Title>
        <Content component="p" className="pf-v6-u-mt-sm pf-v6-u-color-200">
          Review the matched archetype and select a migration destination.
        </Content>
      </StackItem>

      {archetypeMatch && (
        <StackItem>
          <Card isPlain isCompact>
            <CardBody>
              <Content component="p" className="pf-v6-u-font-weight-bold">
                {archetypeMatch.archetype.name}
              </Content>
              <Content component="p" className="pf-v6-u-color-200 pf-v6-u-mb-sm">
                {archetypeMatch.archetype.description}
              </Content>
              <Content component="p" className="pf-v6-u-font-size-sm">
                Matched {archetypeMatch.matchedCount} of {archetypeMatch.totalTags} tags —{' '}
                <strong>{confidenceLabel} confidence</strong>
              </Content>
            </CardBody>
          </Card>
        </StackItem>
      )}

      <StackItem>
        <FormGroup label="Migration Destination" fieldId="migration-target">
          <FormSelect
            id="migration-target"
            value={selectedTargetId}
            onChange={(_event: React.FormEvent<HTMLSelectElement>, value: string) => setSelectedTargetId(value)}
            aria-label="Migration Destination"
          >
            {targets.length === 0 && (
              <FormSelectOption key="none" value="" label="No targets available" isDisabled />
            )}
            {targets.map(t => (
              <FormSelectOption key={t.id} value={t.id} label={`${t.name} (${t.platform})`} />
            ))}
          </FormSelect>
          <HelperText>
            <HelperTextItem icon={<LockIcon />}>
              Migration destinations are pre-approved by your organization
            </HelperTextItem>
          </HelperText>
        </FormGroup>
      </StackItem>

      <StackItem>
        <FormGroup label="Application Name" fieldId="app-name">
          <TextInput
            id="app-name"
            value={appName}
            onChange={(_event: React.FormEvent<HTMLInputElement>, value: string) => setAppName(value)}
            aria-label="Application Name"
          />
          <HelperText>
            <HelperTextItem>
              Auto-populated from repository URL — you can override this
            </HelperTextItem>
          </HelperText>
        </FormGroup>
      </StackItem>
    </Stack>
  );

  const renderStep3 = () => (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="lg">
          Review &amp; Confirm
        </Title>
        <Content component="p" className="pf-v6-u-mt-sm pf-v6-u-color-200">
          Verify the details below before onboarding this application.
        </Content>
      </StackItem>
      <StackItem>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>Application Name</DescriptionListTerm>
            <DescriptionListDescription>{appName}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Repository URL</DescriptionListTerm>
            <DescriptionListDescription>{repoUrl}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Discovered Tags</DescriptionListTerm>
            <DescriptionListDescription>
              {discoveredTags.join(', ')}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Matched Archetype</DescriptionListTerm>
            <DescriptionListDescription>
              {archetypeMatch?.archetype.name ?? 'None'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Migration Target</DescriptionListTerm>
            <DescriptionListDescription>
              {selectedTarget
                ? `${selectedTarget.name} (${selectedTarget.platform})`
                : 'None'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
    </Stack>
  );

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h1" size="xl">
          Onboard Application
        </Title>
      </StackItem>

      <StackItem>
        <ProgressStepper aria-label="Onboarding progress">
          {STEP_LABELS.map((label, index) => (
            <ProgressStep
              key={label}
              id={`step-${index}`}
              titleId={`step-${index}-title`}
              variant={stepVariant(index)}
              isCurrent={index === activeStep}
              aria-label={label}
            >
              {label}
            </ProgressStep>
          ))}
        </ProgressStepper>
      </StackItem>

      <StackItem>
        <Card>
          <CardBody>{stepRenderers[activeStep]()}</CardBody>
          <CardFooter>
            <ActionList>
              <ActionListItem>
                <Button variant="link" onClick={handleCancel}>
                  Cancel
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  isDisabled={activeStep === 0}
                >
                  Back
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  isDisabled={!canAdvance()}
                >
                  {activeStep === 3 ? 'Confirm' : 'Next'}
                </Button>
              </ActionListItem>
            </ActionList>
          </CardFooter>
        </Card>
      </StackItem>
    </Stack>
  );
}
