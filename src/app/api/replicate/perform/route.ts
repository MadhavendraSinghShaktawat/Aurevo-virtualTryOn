// Combined endpoint for Style Replicator: isolate multiple garments from a reference image
// then apply sequentially onto the user photo (top -> bottom -> shoes/accessories)
export const runtime = 'nodejs';
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

import { NextRequest, NextResponse } from 'next/server';
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'
import sharp from 'sharp'

type IncludeFlags = { top?: boolean; bottom?: boolean; shoesAccessories?: boolean }

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function POST(req: NextRequest) {
  const headers = buildCorsHeaders(req as unknown as Request)
  try {
    const raw = await req.text().catch(() => '')
    if (!raw) return NextResponse.json({ error: 'Missing body' }, { status: 400, headers })
    let body: any
    try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers }) }

    const { userImageUrl, referenceImageUrl, include, fitInstructions } = body || {}
    if (!userImageUrl || !referenceImageUrl) {
      return NextResponse.json({ error: 'userImageUrl and referenceImageUrl are required' }, { status: 400, headers })
    }
    const inc: IncludeFlags = {
      top: include?.top !== false,
      bottom: include?.bottom !== false,
      shoesAccessories: include?.shoesAccessories !== false,
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Resolve redirected reference image URLs to the final CDN asset when possible
    const resolvedRefUrl = await resolveFinalImageUrl(referenceImageUrl)

    // Step 1: isolate requested parts in parallel
    const isoTasks: Array<Promise<Response>> = []
    const isoKinds: string[] = []
    if (inc.top) { isoKinds.push('tshirt'); isoTasks.push(fetch(`${baseUrl}/api/product/isolate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: resolvedRefUrl, productType: 'tshirt' }) })) }
    if (inc.bottom) { isoKinds.push('pants'); isoTasks.push(fetch(`${baseUrl}/api/product/isolate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: resolvedRefUrl, productType: 'pants' }) })) }
    if (inc.shoesAccessories) {
      isoKinds.push('shoes'); isoTasks.push(fetch(`${baseUrl}/api/product/isolate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: resolvedRefUrl, productType: 'shoes' }) }))
      isoKinds.push('accessories'); isoTasks.push(fetch(`${baseUrl}/api/product/isolate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: resolvedRefUrl, productType: 'accessories' }) }))
    }

    const isoResults = await Promise.all(isoTasks)
    const isoJsons = await Promise.all(isoResults.map(async (r, i) => {
      const ct = r.headers.get('content-type') || ''
      if (!r.ok || !ct.includes('application/json')) {
        const text = await r.text().catch(() => '')
        throw new Error(`Isolation failed for ${isoKinds[i]} (status ${r.status}). ${text.slice(0,120)}`)
      }
      return r.json()
    }))
    const kindToImage: Record<string, string | undefined> = {}
    isoJsons.forEach((j, i) => {
      if (j?.ok) kindToImage[isoKinds[i]] = j.isolatedImage
    })

    // Prepare a composite for shoes+accessories (if both present)
    let shoesAccessoriesImage: string | undefined
    if (inc.shoesAccessories) {
      const shoes = kindToImage['shoes']
      const acc = kindToImage['accessories']
      if (shoes && acc) {
        try {
          const sBuf = Buffer.from(shoes.split(',')[1] || '', 'base64')
          const aBuf = Buffer.from(acc.split(',')[1] || '', 'base64')
          // place side-by-side on a white canvas so the model can see both
          const sMeta = await sharp(sBuf).metadata()
          const aMeta = await sharp(aBuf).metadata()
          const h = Math.max(sMeta.height || 512, aMeta.height || 512)
          const w = (sMeta.width || 512) + (aMeta.width || 512)
          const canvas = await sharp({ create: { width: w, height: h, channels: 3, background: { r: 255, g: 255, b: 255 } } })
            .composite([
              { input: sBuf, top: 0, left: 0 },
              { input: aBuf, top: 0, left: sMeta.width || 512 },
            ])
            .jpeg({ quality: 95 })
            .toBuffer()
          shoesAccessoriesImage = `data:image/jpeg;base64,${canvas.toString('base64')}`
        } catch {
          shoesAccessoriesImage = shoes || acc
        }
      } else {
        shoesAccessoriesImage = shoes || acc
      }
    }

    // Step 2: apply sequentially (each apply consumes 1 credit; total 3 when all enabled)
    const authHeader = req.headers.get('authorization') || ''
    const cookieHeader = req.headers.get('cookie') || ''

    // Fail-safe: compact initial user image if it's a data URL
    let currentImage = await compactDataUrl(userImageUrl as string, 1200, 82)
    const applyOnce = async (productImageUrl: string, productType: 'tshirt'|'pants'|'shoes'|'accessories') => {
      const res = await fetch(`${baseUrl}/api/tryon/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body: JSON.stringify({ userImageUrl: currentImage, productImageUrl, productType, fitInstructions })
      })
      const ct = res.headers.get('content-type') || ''
      const js = ct.includes('application/json') ? await res.json() : null
      if (!res.ok || !js?.ok) {
        const txt = !ct.includes('application/json') ? await res.text().catch(() => '') : ''
        throw new Error((js && js.error) || txt || 'Try-on failed')
      }
      // After each step, compact resulting image to keep payload small for next step
      currentImage = await compactDataUrl(js.tryOnImage as string, 1200, 82)
    }

    if (inc.top && kindToImage['tshirt']) await applyOnce(kindToImage['tshirt'] as string, 'tshirt')
    if (inc.bottom && kindToImage['pants']) await applyOnce(kindToImage['pants'] as string, 'pants')
    if (inc.shoesAccessories && shoesAccessoriesImage) {
      // Use 'shoes' as the placement hint; instructions can mention accessories
      await applyOnce(shoesAccessoriesImage, 'shoes')
    }

    // Compact final once more before sending
    const finalImage = await compactDataUrl(currentImage, 1200, 82)
    return NextResponse.json({ ok: true, finalImage, isolated: { top: kindToImage['tshirt'], bottom: kindToImage['pants'], shoesAccessories: shoesAccessoriesImage } }, { headers })

  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unexpected error' }, { status: 500, headers })
  }
}

// Resolve redirects/CDN originals for common hosts (Pinterest etc.).
async function resolveFinalImageUrl(url: string): Promise<string> {
  try {
    // Follow redirects with a HEAD first to avoid downloading large bodies
    const headRes = await fetch(url, { method: 'HEAD', redirect: 'follow' as any })
    if (headRes.ok) {
      const finalUrl = (headRes.url || url).toString()
      // If content-type looks like image, use it directly
      const ct = headRes.headers.get('content-type') || ''
      if (ct.startsWith('image/')) return finalUrl
    }
  } catch {}
  // Pinterest specific extraction: look for /originals/... when present
  try {
    const u = new URL(url)
    if (u.hostname.includes('pinterest')) {
      // Some pinterest media URLs contain /originals/ or /originals/ path – prefer that
      const path = u.pathname
      if (path.includes('/originals/')) return url
      // Fallback: replace /236x/ or /564x/ with /originals/
      const replaced = path.replace(/\/(\d+x)\//, '/originals/')
      if (replaced !== path) {
        u.pathname = replaced
        return u.toString()
      }
    }
  } catch {}
  return url
}

// Compact data URL jpeg to keep payload small between steps
async function compactDataUrl(dataUrl: string, maxDim: number, qualityPct: number): Promise<string> {
  try {
    if (!dataUrl?.startsWith('data:')) return dataUrl
    const comma = dataUrl.indexOf(',')
    const b64 = dataUrl.slice(comma + 1)
    const buf = Buffer.from(b64, 'base64')
    const meta = await sharp(buf).metadata()
    const width = meta.width || 0
    const height = meta.height || 0
    const curMax = Math.max(width, height)
    const scale = curMax > 0 && curMax > maxDim ? maxDim / curMax : 1
    const w = Math.max(1, Math.round(width * scale))
    const h = Math.max(1, Math.round(height * scale))
    const out = await sharp(buf).resize(w, h, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: Math.max(60, Math.min(95, Math.round(qualityPct))) }).toBuffer()
    return `data:image/jpeg;base64,${out.toString('base64')}`
  } catch {
    return dataUrl
  }
}

