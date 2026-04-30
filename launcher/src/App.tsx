import React, { useState, useEffect } from 'react'
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

type LabelColor = 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'teal' | 'yellow' | 'grey'

const productColorMap: Record<Product, LabelColor> = {
  'RHDH': 'purple',
  'MTA': 'teal',
  'Konflux': 'orange',
  'TPA': 'blue',
  'TAS': 'green',
  'Podman Desktop': 'red',
  'RHCL': 'yellow',
  'DevSpaces': 'grey',
}

const colorCssMap: Record<LabelColor, string> = {
  blue: 'var(--pf-t--global--color--nonstatus--blue--default)',
  green: 'var(--pf-t--global--color--nonstatus--green--default)',
  orange: 'var(--pf-t--global--color--nonstatus--orange--default)',
  red: 'var(--pf-t--global--color--nonstatus--red--default)',
  purple: 'var(--pf-t--global--color--nonstatus--purple--default)',
  teal: 'var(--pf-t--global--color--nonstatus--teal--default)',
  yellow: 'var(--pf-t--global--color--nonstatus--yellow--default)',
  grey: 'var(--pf-t--global--text--color--subtle)',
}

function productColor(product: Product): LabelColor {
  return productColorMap[product]
}

function statusColor(status: Prototype['status']) {
  switch (status) {
    case 'Active': return { backgroundColor: 'var(--pf-t--global--color--nonstatus--green--default)', color: 'white' }
    case 'In Progress': return { backgroundColor: 'var(--pf-t--global--color--nonstatus--blue--default)', color: 'white' }
    case 'Planned': return { backgroundColor: 'var(--pf-t--global--color--nonstatus--gray--default)', color: 'white' }
  }
}

function toSlug(product: Product | 'All'): string {
  return product.replace(/\s+/g, '-')
}

function fromSlug(slug: string): Product | 'All' {
  if (!slug || slug.toLowerCase() === 'all') return 'All'
  const match = allProducts.find((p) => toSlug(p).toLowerCase() === slug.toLowerCase())
  return match ?? 'All'
}

function getProductFromPath(): Product | 'All' {
  const basePath = '/AppDev-UX-Prototypes/'

  const params = new URLSearchParams(window.location.search)
  const redirectPath = params.get('p')
  if (redirectPath) {
    const cleaned = redirectPath.replace(/\/$/, '')
    const match = fromSlug(cleaned)
    if (match !== 'All') {
      window.history.replaceState(null, '', `${basePath}${toSlug(match)}`)
      return match
    }
    window.history.replaceState(null, '', basePath)
    return 'All'
  }

  const path = window.location.pathname.replace(basePath, '').replace(/\/$/, '')
  if (!path) return 'All'
  return fromSlug(path)
}

export function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | 'All'>(getProductFromPath)

  useEffect(() => {
    const basePath = '/AppDev-UX-Prototypes/'
    const newPath = selectedProduct === 'All' ? basePath : `${basePath}${toSlug(selectedProduct)}`
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath)
    }
  }, [selectedProduct])

  useEffect(() => {
    const handlePopState = () => setSelectedProduct(getProductFromPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const filtered = selectedProduct === 'All'
    ? [...prototypes].sort((a, b) => a.name.localeCompare(b.name))
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
      <PageSection>
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
                  text={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: colorCssMap[productColorMap[product]],
                        flexShrink: 0,
                      }} />
                      {product}
                    </span>
                  }
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
                <CardTitle>{proto.name}</CardTitle>
              </CardHeader>
              <CardBody>
                <Flex style={{ marginBottom: 12 }}>
                  <Label color={productColor(proto.product)} isCompact>{proto.product}</Label>
                </Flex>
                <Content component="p" style={{ fontWeight: 600, marginBottom: 8 }}>
                  {proto.project}
                </Content>
                <Content component="p">{proto.description}</Content>
              </CardBody>
              <CardFooter>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <Button
                    variant="secondary"
                    component="a"
                    href={proto.externalUrl || proto.path}
                    target={proto.externalUrl ? '_blank' : undefined}
                    rel={proto.externalUrl ? 'noopener noreferrer' : undefined}
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="end"
                  >
                    {proto.externalUrl ? 'Launch prototype (VPN required)' : 'Launch prototype'}
                  </Button>
                  <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Last updated: {proto.lastUpdated}
                  </Content>
                </Flex>
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
