const DEFAULT_ALLOWED_METHODS = 'GET,OPTIONS'
const DEFAULT_ALLOWED_HEADERS = 'Authorization,Content-Type'

function getAllowedOrigins(): string[] {
  const list = [
    process.env.NEXT_PUBLIC_APP_URL || '',
    'http://localhost:3000',
    'https://localhost:3000',
  ]
  if (process.env.EXTENSION_ORIGIN) list.push(process.env.EXTENSION_ORIGIN)
  return list.filter(Boolean)
}

export function buildCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin') || ''
  const allowedOrigins = getAllowedOrigins()
  const isAllowed = allowedOrigins.some((o) => o === origin)

  const headers: HeadersInit = {
    'Access-Control-Allow-Methods': DEFAULT_ALLOWED_METHODS,
    'Access-Control-Allow-Headers': DEFAULT_ALLOWED_HEADERS,
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  }

  if (isAllowed) {
    ;(headers as any)['Access-Control-Allow-Origin'] = origin
  }

  return headers
}

export function handleCorsOptions(request: Request): Response {
  const headers = buildCorsHeaders(request)
  return new Response(null, { status: 204, headers })
}


