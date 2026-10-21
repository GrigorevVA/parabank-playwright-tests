import type { APIResponse } from '@playwright/test';
import { buildSoapEnvelope, type SoapParams } from '@core/api/soap';
import { getRequest } from '@core/request-holder';

export const SOAP_URL = 'services/ParaBank';
export const SOAP_NAMESPACE = 'http://service.parabank.parasoft.com/';

export function postSoap(operation: string, params: SoapParams): Promise<APIResponse> {
  return getRequest().post(SOAP_URL, {
    headers: { 'Content-Type': 'text/xml' },
    data: buildSoapEnvelope(SOAP_NAMESPACE, operation, params),
  });
}
