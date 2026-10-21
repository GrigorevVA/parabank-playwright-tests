import { XMLParser } from 'fast-xml-parser';

export interface SoapFault {
  Fault: { faultcode: string; faultstring: string };
}

export type SoapParams = Record<string, string | number>;

// service uses qualified elements, so every child gets the service prefix
export function buildSoapEnvelope(namespace: string, operation: string, params: SoapParams): string {
  const body = Object.entries(params)
    .map(([name, value]) => `<ser:${name}>${value}</ser:${name}>`)
    .join('');
  return (
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="${namespace}">` +
    `<soapenv:Body><ser:${operation}>${body}</ser:${operation}></soapenv:Body>` +
    `</soapenv:Envelope>`
  );
}

// values stay strings as in XML; arrayTags are always parsed as arrays
export function parseSoapBody<T>(xml: string, arrayTags: string[] = []): T {
  const parser = new XMLParser({
    removeNSPrefix: true,
    parseTagValue: false,
    isArray: (tagName) => arrayTags.includes(tagName),
  });
  return parser.parse(xml).Envelope.Body;
}
