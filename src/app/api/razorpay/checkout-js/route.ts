// Deprecated: We no longer proxy the Razorpay Checkout SDK.
// Keeping an empty route to avoid 404s if something still points here.
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    message: 'Razorpay SDK proxy removed. Load https://checkout.razorpay.com/v1/checkout.js directly.',
  }, { status: 410 })
}
