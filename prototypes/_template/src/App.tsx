import React from 'react'
import {
  Page,
  Masthead,
  MastheadMain,
  MastheadBrand,
  PageSection,
  Title,
  Content,
} from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css'

export default function App() {
  return (
    <Page
      masthead={
        <Masthead>
          <MastheadMain>
            <MastheadBrand>Prototype Name</MastheadBrand>
          </MastheadMain>
        </Masthead>
      }
    >
      <PageSection>
        <Title headingLevel="h1">Prototype</Title>
        <Content component="p">Replace this with your prototype content.</Content>
      </PageSection>
    </Page>
  )
}
