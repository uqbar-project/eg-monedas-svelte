import type { Conversion } from '../model/conversion'
import type { Moneda } from '../model/moneda'
import { BACKEND_URL } from './constants'

async function httpRequest<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request)
  const responseJson = await response.json()

  if (!response.ok) {
    throw responseJson
  }

  return responseJson
}

async function customRequest<T>(route: string, body: Partial<T>, method = 'POST') {
  return httpRequest<number>(
    new Request(`${BACKEND_URL}${route}`, {
      method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

async function getMonedas(): Promise<Moneda[]> {
  return httpRequest<Moneda[]>(`${BACKEND_URL}/monedas`)
}

async function convertirAPesos(conversion: Conversion): Promise<number> {
  return customRequest<Conversion>(`/monedaAPesos/`, conversion, 'PUT')
}

async function convertirAMoneda(conversion: Conversion): Promise<number> {
  return customRequest<Conversion>(`/pesosAMoneda/`, conversion, 'PUT')
}

export default { getMonedas, convertirAPesos, convertirAMoneda }
