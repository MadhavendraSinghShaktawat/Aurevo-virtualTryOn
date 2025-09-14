import { NextRequest, NextResponse } from 'next/server'

// Verify environment configuration at boot
const key_id = process.env.RAZORPAY_KEY_ID as string
const key_secret = process.env.RAZORPAY_KEY_SECRET as string

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get('content-type') !== 'application/json') {
      return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 })
    }

    const { amount, currency, metadata } = await req.json()
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Amount required' }, { status: 400 })
    }

    // Always use smallest currency unit (INR paise)
    const payload = {
      amount: Math.floor(amount),
      currency: currency || 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: metadata || {},
    }

    // Create order through Razorpay REST API
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${key_id}:${key_secret}`).toString('base64'),
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Failed to create order', detail: text }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ order: data, key: key_id })
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', detail: e?.message }, { status: 500 })
  }
}


