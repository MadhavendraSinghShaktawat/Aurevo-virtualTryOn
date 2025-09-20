import { SignJWT, jwtVerify } from 'jose'

const ADMIN_USERNAME = 'super_admin'
const ADMIN_PASSWORD = '@University120104'
const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || 'dev_admin_secret_please_change')
export const ADMIN_COOKIE = 'admin_jwt'

export async function createAdminJWT(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyAdminJWT(token: string | undefined) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export function validateAdminCredentials(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}


