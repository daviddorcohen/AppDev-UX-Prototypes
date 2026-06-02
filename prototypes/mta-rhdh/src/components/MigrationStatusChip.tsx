import { Label } from '@patternfly/react-core'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon'
import SyncAltIcon from '@patternfly/react-icons/dist/esm/icons/sync-alt-icon'
import PendingIcon from '@patternfly/react-icons/dist/esm/icons/pending-icon'
import type { MigrationStatus } from '../types'

export function MigrationStatusChip({ status }: { status: MigrationStatus }) {
  switch (status) {
    case 'Completed':
      return <Label color="green" icon={<CheckCircleIcon />} isCompact>{status}</Label>
    case 'Failed':
      return <Label color="red" icon={<ExclamationCircleIcon />} isCompact>{status}</Label>
    case 'In Progress':
    case 'Remediation':
    case 'Discovery':
    case 'Analysis':
      return <Label color="blue" icon={<SyncAltIcon />} isCompact>{status}</Label>
    case 'Not Started':
    default:
      return <Label color="grey" icon={<PendingIcon />} isCompact>{status}</Label>
  }
}
