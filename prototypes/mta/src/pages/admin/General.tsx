import { useState } from 'react'
import {
  Title,
  Stack,
  Card,
  CardBody,
  Form,
  FormGroup,
  Switch,
  Content,
} from '@patternfly/react-core'

export function General() {
  const [allowDownloads, setAllowDownloads] = useState(true)

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Title headingLevel="h1">General configuration</Title>
      <Card>
        <CardBody>
          <Content component="p" className="pf-v6-u-mb-lg">
            Configure general application settings.
          </Content>
          <Form>
            <FormGroup fieldId="allow-downloads">
              <Switch
                id="allow-downloads"
                label="Allow reports to be downloaded"
                labelOff="Allow reports to be downloaded"
                isChecked={allowDownloads}
                onChange={(_e, checked) => setAllowDownloads(checked)}
                aria-label="Allow reports to be downloaded"
              />
              <Content component="small" className="pf-v6-u-mt-sm pf-v6-u-color-200">
                Allow reports to be downloaded after running an analysis.
              </Content>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Stack>
  )
}
