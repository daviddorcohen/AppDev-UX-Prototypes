import React from 'react'
import {
  Page,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  PageSection,
  Title,
  Content,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Gallery,
  Badge,
  Button,
  Flex,
  FlexItem,
} from '@patternfly/react-core'
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon'
import { prototypes, Prototype } from './prototypes'

function statusColor(status: Prototype['status']) {
  switch (status) {
    case 'Active': return { backgroundColor: 'var(--pf-t--global--color--nonstatus--green--default)', color: 'white' }
    case 'In Progress': return { backgroundColor: 'var(--pf-t--global--color--nonstatus--blue--default)', color: 'white' }
    case 'Planned': return { backgroundColor: 'var(--pf-t--global--color--nonstatus--gray--default)', color: 'white' }
  }
}

export function App() {
  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <Title headingLevel="h4" style={{ color: 'white' }}>AppDev UX Prototypes</Title>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <span />
      </MastheadContent>
    </Masthead>
  )

  return (
    <Page masthead={masthead}>
      <PageSection>
        <Title headingLevel="h1">Prototypes</Title>
        <Content component="p" style={{ marginTop: 8, marginBottom: 24 }}>
          Browse and launch UX prototypes built with PatternFly v6.
        </Content>
        <Gallery hasGutter minWidths={{ default: '300px' }}>
          {prototypes.map((proto) => (
            <Card key={proto.name} isFullHeight>
              <CardHeader>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <CardTitle>{proto.name}</CardTitle>
                  <Badge style={statusColor(proto.status)}>{proto.status}</Badge>
                </Flex>
              </CardHeader>
              <CardBody>{proto.description}</CardBody>
              <CardFooter>
                <Button
                  variant="link"
                  component="a"
                  href={proto.path}
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="end"
                >
                  Launch prototype
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Gallery>
      </PageSection>
    </Page>
  )
}
