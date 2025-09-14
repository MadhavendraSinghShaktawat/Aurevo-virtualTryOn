'use client'

import { useEffect } from 'react'

type Plan = {
  name: string
  price: number
  tries: string
  features: string[]
  highlight?: boolean
}

export function PricingOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const plans: Plan[] = [
    { name: 'Starter', price: 5, tries: 'Includes 25 try‑ons', features: ['Email support', 'Basic usage analytics'] },
    { name: 'Pro', price: 10, tries: 'Includes 80 try‑ons', features: ['Priority support', 'Advanced analytics', 'Early access'], highlight: true },
    { name: 'Unlimited', price: 25, tries: 'Up to 250 try‑ons', features: ['All Pro features', 'Concierge onboarding'] },
  ]

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  async function startCheckout(p: Plan) {
    try {
      // Map plan price to credits (1 USD ~ 1 credit pack price); use notes for user id & credits
      const credits = p.name === 'Starter' ? 25 : p.name === 'Pro' ? 80 : 250
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: p.price * 100, currency: 'INR', metadata: { credits } })
      })
      const { order, key } = await res.json()
      if (!order?.id) return
      // @ts-ignore (Razorpay is injected by script tag)
      const rzp = new (window as any).Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'aurevo',
        order_id: order.id,
        notes: { credits },
      })
      rzp.open()
    } catch (e) {
      console.error(e)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl rounded-3xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <button onClick={onClose} className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-interactive text-gray-900" data-cursor-hover>
              ✕
              <div data-cursor-bounds className="absolute inset-0 rounded-full" />
            </button>
          </div>
          <p className="px-6 text-sm text-gray-700">Billed monthly. Cancel anytime.</p>

          <div className="px-6 pb-6">
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={[
                    'relative rounded-2xl border bg-white shadow-sm p-7 flex flex-col transition-shadow hover:shadow-md',
                    p.highlight ? 'border-blue-600 ring-1 ring-blue-600/15' : 'border-gray-200',
                  ].join(' ')}
                >
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 text-white text-xs font-semibold px-3 py-1 shadow">
                      Most popular
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 ring-8 ring-blue-50" />
                    <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <div className="text-5xl font-extrabold text-gray-900">${p.price}</div>
                    <div className="text-sm text-gray-600">/month</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">{p.tries}</div>
                  <ul className="mt-6 space-y-3 text-sm text-gray-800">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <svg className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-6.01 6.01a1 1 0 01-1.415 0L3.296 6.722A1 1 0 014.71 5.307l4.156 4.156 5.296-5.296a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        <span className="text-gray-900">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => startCheckout(p)} className={['mt-8 w-full rounded-xl py-3 font-semibold active:scale-[.99] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-interactive', p.highlight ? 'bg-blue-600 text-white shadow hover:bg-blue-700' : 'bg-gray-900 text-white hover:bg-black/90'].join(' ')} data-cursor-hover>
                    Choose {p.name}
                    <div data-cursor-bounds className="absolute inset-0 rounded-xl" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingOverlay


