'use client'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: 5,
      tries: 'Includes 25 try‑ons',
      features: ['Email support', 'Basic usage analytics'],
      cta: 'Get Starter',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 10,
      tries: 'Includes 80 try‑ons',
      features: ['Priority support', 'Advanced analytics', 'Early access'],
      cta: 'Get Pro',
      highlight: true,
    },
    {
      name: 'Unlimited',
      price: 25,
      tries: 'Up to 250 try‑ons',
      features: ['All Pro features', 'Concierge onboarding'],
      cta: 'Get Unlimited',
      highlight: false,
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-center">Simple, transparent pricing</h1>
        <p className="text-center text-gray-600 mt-3">Billed monthly. Cancel anytime.</p>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <h3 className="text-lg font-semibold">{p.name}</h3>
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <div className="text-5xl font-extrabold">${p.price}</div>
                <div className="text-sm text-gray-500">/month</div>
              </div>
              <div className="mt-2 text-sm text-gray-600">{p.tries}</div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-6.01 6.01a1 1 0 01-1.415 0L3.296 6.722A1 1 0 014.71 5.307l4.156 4.156 5.296-5.296a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={[
                  'mt-8 w-full rounded-xl py-3 font-semibold active:scale-[.99] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40',
                  p.highlight
                    ? 'bg-blue-600 text-white shadow hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-black/90',
                ].join(' ')}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-gray-500">Prices shown in USD. Applicable taxes are calculated at checkout.</p>
      </section>
    </main>
  )
}


