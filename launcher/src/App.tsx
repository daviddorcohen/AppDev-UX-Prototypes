import React, { useState } from 'react'
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
  Label,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core'
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon'
import { prototypes, allProducts, Prototype, Product } from './prototypes'

function statusColor(status: Prototype['status']) {
  switch (status) {
    case 'Active': return { backgroundColor: 'var(--pf-t--global--color--nonstatus--green--default)', color: 'white' }
    case 'In Progress': return { backgroundColor: 'var(--pf-t--global--color--nonstatus--blue--default)', color: 'white' }
    case 'Planned': return { backgroundColor: 'var(--pf-t--global--color--nonstatus--gray--default)', color: 'white' }
  }
}

export function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | 'All'>('All')

  const filtered = selectedProduct === 'All'
    ? prototypes
    : prototypes.filter((p) => p.product === selectedProduct)

  const masthead = (
    <Masthead style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)' }}>
      <MastheadMain>
        <MastheadBrand>
          <Title headingLevel="h4" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>AppDev UX Prototypes</Title>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <span />
      </MastheadContent>
    </Masthead>
  )

  return (
    <Page masthead={masthead}>
      <PageSection style={{ paddingTop: 20 }}>
        <Title headingLevel="h1" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
          Prototypes
        </Title>
        <Content component="p" style={{ marginTop: 8, marginBottom: 16 }}>
          Browse and launch UX prototypes built with PatternFly v6.
        </Content>

        <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: 24, gap: 12 }}>
          <FlexItem>
            <Content component="p" style={{ fontWeight: 600, margin: 0 }}>Filter by product:</Content>
          </FlexItem>
          <FlexItem>
            <ToggleGroup aria-label="Filter by product">
              <ToggleGroupItem
                text="All"
                isSelected={selectedProduct === 'All'}
                onChange={() => setSelectedProduct('All')}
              />
              {allProducts.map((product) => (
                <ToggleGroupItem
                  key={product}
                  text={product}
                  isSelected={selectedProduct === product}
                  onChange={() => setSelectedProduct(product)}
                />
              ))}
            </ToggleGroup>
          </FlexItem>
        </Flex>

        <Gallery hasGutter minWidths={{ default: '300px' }}>
          {filtered.map((proto) => (
            <Card key={proto.name} isFullHeight>
              <CardHeader>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <CardTitle>{proto.name}</CardTitle>
                  <Badge style={statusColor(proto.status)}>{proto.status}</Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                <Flex style={{ marginBottom: 12 }}>
                  <Label color="blue" isCompact>{proto.product}</Label>
                </Flex>
                <Content component="p" style={{ fontWeight: 600, marginBottom: 8 }}>
                  {proto.project}
                </Content>
                <Content component="p">{proto.description}</Content>
              </CardBody>
              <CardFooter>
                <Button
                  variant="primary"
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

        {filtered.length === 0 && (
          <Content component="p" style={{ marginTop: 24, fontStyle: 'italic' }}>
            No prototypes found for {selectedProduct}.
          </Content>
        )}
      </PageSection>
    </Page>
  )
}
