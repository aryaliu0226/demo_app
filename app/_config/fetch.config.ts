/** @format */

type QueryValue = string | number | boolean | null | undefined

type RequestParams = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: HeadersInit
  cache?: RequestCache
  next?: NextFetchRequestConfig
  signal?: AbortSignal
  [key: string]: unknown
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

function buildUrl(path: string, params?: RequestParams) {
  const url = new URL(path, getBaseUrl())

  if (!params) {
    return url.toString()
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    const v = value as QueryValue
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      url.searchParams.set(key, String(v))
    }
  })

  return url.toString()
}

export class FetchError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'FetchError'
  }
}

export async function Fetch<T>(path: string, params: RequestParams = {}) {
  const {
    method = 'GET',
    body,
    headers,
    cache = 'no-store',
    next,
    signal,
    ...queryParams
  } = params

  const url = buildUrl(path, method === 'GET' ? queryParams : undefined)
  const response = await fetch(url, {
    method,
    cache,
    next,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body:
      method === 'GET' || body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const errBody = (await response.json()) as { error?: string }
      if (errBody.error) message = errBody.error
    } catch {}
    throw new FetchError(response.status, message)
  }

  return response.json() as Promise<T>
}
