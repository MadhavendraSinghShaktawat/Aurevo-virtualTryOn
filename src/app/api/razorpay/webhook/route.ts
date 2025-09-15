import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabaseClient'

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string

export async function POST(req: NextRequest) {
  const body = await req.text() // must read as text to compute signature
  const signature = req.headers.get('x-razorpay-signature') || ''

  const expected = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex')
  if (signature !== expected) {
    return new NextResponse('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(body)
  if (event.event !== 'payment.captured') {
    return NextResponse.json({ ok: true })
  }

  // metadata/notes carry user id and credits purchased
  const payment = event.payload.payment.entity
  const paymentId = payment?.id
  const { notes } = payment
  const userId = notes?.user_id
  const credits = Number(notes?.credits || 0)

  if (!userId || !credits) {
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  // Idempotency: skip if we've processed this payment before
  const { data: processed } = await supabase.rpc('mark_payment_processed', { p_payment_id: paymentId })
  if (processed === false) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  // increment credits atomically
  const { data, error } = await supabase.rpc('increment_credits', { p_user_id: userId, p_delta: credits })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}


