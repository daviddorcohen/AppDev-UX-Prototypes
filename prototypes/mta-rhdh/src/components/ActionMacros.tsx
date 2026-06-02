import React, { useState, useCallback } from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  Divider,
  Content,
  Spinner,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { useMtaStore } from '../store/MtaStore';
import type { ActionType } from '../types';

interface ActionMacrosProps {
  appId: string;
}

interface ActionState {
  running: boolean;
  completed: boolean;
  result?: string;
}

const architectActions: { label: string; action: ActionType }[] = [
  { label: 'Generate Deployment Assets', action: 'generate-deployment-assets' },
  { label: 'Trigger AI Remediator', action: 'trigger-ai-remediator' },
  { label: 'Run Analysis', action: 'run-analysis' },
];

const developerActions: { label: string; action: ActionType }[] = [
  { label: 'Launch Workspace in Dev Spaces', action: 'launch-workspace' },
  { label: 'View Issues', action: 'view-issues' },
  { label: 'Apply Quick Fixes', action: 'apply-quick-fixes' },
];

export function ActionMacros({ appId }: ActionMacrosProps) {
  const store = useMtaStore();
  const [actionStates, setActionStates] = useState<
    Record<string, ActionState>
  >({});

  const handleAction = useCallback(
    (action: ActionType, triggeredBy: 'architect' | 'developer') => {
      store.executeAction(appId, action, triggeredBy);

      setActionStates(prev => ({
        ...prev,
        [action]: { running: true, completed: false },
      }));

      setTimeout(() => {
        const result =
          action === 'launch-workspace'
            ? 'Opening workspace at devspaces.example.com/...'
            : 'Completed';

        setActionStates(prev => ({
          ...prev,
          [action]: { running: false, completed: true, result },
        }));
      }, 4000);
    },
    [appId, store],
  );

  const renderButton = (
    label: string,
    action: ActionType,
    triggeredBy: 'architect' | 'developer',
  ) => {
    const state = actionStates[action];
    return (
      <StackItem key={action}>
        <Button
          variant="secondary"
          size="sm"
          isDisabled={state?.running}
          onClick={() => handleAction(action, triggeredBy)}
        >
          {label}
        </Button>
        {state?.running && (
          <span className="pf-v6-u-ml-sm">
            <Spinner size="md" />
          </span>
        )}
        {state?.completed && (
          <span
            className="pf-v6-u-ml-sm"
            style={{ color: 'var(--pf-v6-global--success-color--100)' }}
          >
            {state.result}
          </span>
        )}
      </StackItem>
    );
  };

  return (
    <Card>
      <CardTitle>Actions</CardTitle>
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            <Content component="h4">Architect Actions</Content>
          </StackItem>
          {architectActions.map(({ label, action }) =>
            renderButton(label, action, 'architect'),
          )}

          <StackItem>
            <Divider />
          </StackItem>

          <StackItem>
            <Content component="h4">Developer Actions</Content>
          </StackItem>
          {developerActions.map(({ label, action }) =>
            renderButton(label, action, 'developer'),
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
