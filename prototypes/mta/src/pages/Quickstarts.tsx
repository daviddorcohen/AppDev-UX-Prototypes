import { useNavigate } from 'react-router-dom'
import {
  Title,
  Content,
  Stack,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Button,
} from '@patternfly/react-core'
import RocketIcon from '@patternfly/react-icons/dist/esm/icons/rocket-icon'
import UploadIcon from '@patternfly/react-icons/dist/esm/icons/upload-icon'

const quickstarts = [
  {
    id: 'import-applications',
    name: 'Getting started with Konveyor',
    description: 'Add applications to your inventory via CSV import or manual creation. Learn how to prepare your data and run your first import.',
    icon: UploadIcon,
    to: '/applications?quickstart=import-applications',
  },
]

export function Quickstarts() {
  const navigate = useNavigate()

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <div>
        <Title headingLevel="h1">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <RocketIcon /> Quickstarts
          </span>
        </Title>
        <Content>
          <p style={{ marginTop: 8, color: 'var(--pf-v6-global--Color--200)' }}>
            Step-by-step guides to get the most out of Konveyor Tackle. Pick a quickstart to begin.
          </p>
        </Content>
      </div>

      <Grid hasGutter>
        {quickstarts.map((qs) => {
          const Icon = qs.icon
          return (
            <GridItem key={qs.id} span={12} sm={6} lg={4}>
              <Card isFullHeight>
                <CardHeader>
                  <CardTitle>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon /> {qs.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Content>
                    <p style={{ margin: 0 }}>{qs.description}</p>
                  </Content>
                  <div style={{ marginTop: 16 }}>
                    <Button variant="primary" onClick={() => navigate(qs.to)}>
                      Start
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          )
        })}
      </Grid>
    </Stack>
  )
}
