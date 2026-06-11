/** @format */

type QueryValue = string | number | boolean | null | undefined
type QueryParams = Record<string, QueryValue>

type RequestParams = QueryParams & {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: HeadersInit
  cache?: RequestCache
  next?: NextFetchRequestConfig
}

const isServer = typeof window === 'undefined'

function getBaseUrl() {
  if (!isServer) {
    return window.location.origin
  }

  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'
  )
}

function buildUrl(path: string, params?: QueryParams) {
  const url = new URL(path, getBaseUrl())

  if (!params) {
    return url.toString()
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

export async function Fetch<T>(path: string, params: RequestParams = {}) {
  const {
    method = 'GET',
    body,
    headers,
    cache = 'no-store',
    next,
    ...queryParams
  } = params

  const url = buildUrl(path, method === 'GET' ? queryParams : undefined)
  const response = await fetch(url, {
    method,
    cache,
    next,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body:
      method === 'GET' || body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
