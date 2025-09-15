import { NextRequest, NextResponse } from 'next/server'

// Verify environment configuration at boot
const key_id = process.env.RAZORPAY_KEY_ID as string
const key_secret = process.env.RAZORPAY_KEY_SECRET as string

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get('content-type') !== 'application/json') {
      return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 })
    }

    const { usd_price, metadata } = await req.json()
    if (!usd_price || typeof usd_price !== 'number') {
      return NextResponse.json({ error: 'usd_price required' }, { status: 400 })
    }

    // Convert USD to INR and add 9% tax
    let rate = 83
    try {
      const fx = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=INR', { cache: 'no-store' })
      if (fx.ok) {
        const j = await fx.json()
        if (j?.rates?.INR) rate = Number(j.rates.INR)
      }
    } catch {}
    const inr = usd_price * rate
    const inrWithTax = inr * 1.09
    const amountPaise = Math.round(inrWithTax * 100)

    const payload = {
      amount: amountPaise,
      currency: 'INR',
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


