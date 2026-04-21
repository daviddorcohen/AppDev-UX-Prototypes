import { Title, Content, EmptyState, EmptyStateBody, PageSection } from '@patternfly/react-core'
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <PageSection isFilled>
      <EmptyState headingLevel="h1" titleText={title} icon={CubesIcon}>
        <EmptyStateBody>
          {description || `The ${title} page is under construction.`}
        </EmptyStateBody>
      </EmptyState>
    </PageSection>
  )
}
