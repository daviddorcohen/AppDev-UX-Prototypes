import { useState } from 'react'
import {
  Title,
  Stack,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Switch,
  TextInput,
} from '@patternfly/react-core'

export function Proxy() {
  const [httpEnabled, setHttpEnabled] = useState(false)
  const [httpHost, setHttpHost] = useState('')
  const [httpPort, setHttpPort] = useState<number | ''>('')

  const [httpsEnabled, setHttpsEnabled] = useState(false)
  const [httpsHost, setHttpsHost] = useState('')
  const [httpsPort, setHttpsPort] = useState<number | ''>('')

  return (
    <Stack hasGutter style={{ minWidth: 0 }}>
      <Title headingLevel="h1">Proxy configuration</Title>

      <Card>
        <CardTitle>HTTP Proxy</CardTitle>
        <CardBody>
          <Form>
            <FormGroup fieldId="http-proxy-enabled">
              <Switch
                id="http-proxy-enabled"
                label="Enable HTTP proxy"
                labelOff="Enable HTTP proxy"
                isChecked={httpEnabled}
                onChange={(_e, checked) => setHttpEnabled(checked)}
                aria-label="Enable HTTP proxy"
              />
            </FormGroup>
            <FormGroup label="Host" fieldId="http-proxy-host">
              <TextInput
                id="http-proxy-host"
                value={httpHost}
                onChange={(_e, val) => setHttpHost(val)}
                isDisabled={!httpEnabled}
                placeholder="proxy.example.com"
              />
            </FormGroup>
            <FormGroup label="Port" fieldId="http-proxy-port">
              <TextInput
                id="http-proxy-port"
                type="number"
                value={httpPort}
                onChange={(_e, val) => setHttpPort(val === '' ? '' : Number(val))}
                isDisabled={!httpEnabled}
                placeholder="8080"
              />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>HTTPS Proxy</CardTitle>
        <CardBody>
          <Form>
            <FormGroup fieldId="https-proxy-enabled">
              <Switch
                id="https-proxy-enabled"
                label="Enable HTTPS proxy"
                labelOff="Enable HTTPS proxy"
                isChecked={httpsEnabled}
                onChange={(_e, checked) => setHttpsEnabled(checked)}
                aria-label="Enable HTTPS proxy"
              />
            </FormGroup>
            <FormGroup label="Host" fieldId="https-proxy-host">
              <TextInput
                id="https-proxy-host"
                value={httpsHost}
                onChange={(_e, val) => setHttpsHost(val)}
                isDisabled={!httpsEnabled}
                placeholder="proxy.example.com"
              />
            </FormGroup>
            <FormGroup label="Port" fieldId="https-proxy-port">
              <TextInput
                id="https-proxy-port"
                type="number"
                value={httpsPort}
                onChange={(_e, val) => setHttpsPort(val === '' ? '' : Number(val))}
                isDisabled={!httpsEnabled}
                placeholder="8443"
              />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Stack>
  )
}
