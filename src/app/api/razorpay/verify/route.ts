import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabaseClient'

const key_id = process.env.RAZORPAY_KEY_ID as string
const key_secret = process.env.RAZORPAY_KEY_SECRET as string

export async function POST(req: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json()
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected = crypto.createHmac('sha256', key_secret).update(body).digest('hex')
    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Fetch order to read notes (user_id, credits)
    const res = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${key_id}:${key_secret}`).toString('base64')
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Failed to fetch order', detail: text }, { status: 502 })
    }
    const order = await res.json()
    const notes = order?.notes || {}
    const userId = notes.user_id
    const credits = Number(notes.credits || 0)
    if (!userId || !credits) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // Idempotency
    const { data: processed } = await supabase.rpc('mark_payment_processed', { p_payment_id: razorpay_payment_id })
    if (processed === false) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const { error } = await supabase.rpc('increment_credits', { p_user_id: userId, p_delta: credits })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}


