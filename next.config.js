/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Silence ESLint errors during production builds (still enforced locally/CI if you run eslint)
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'i.redd.it',
      'preview.redd.it',
      'external-preview.redd.it',
      'b.thumbs.redditmedia.com',
      'a.thumbs.redditmedia.com',
      'imgur.com',
      'i.imgur.com'
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Allow our SDK proxy and Razorpay checkout domain, and permit iframes for checkout
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self' https://api.razorpay.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;"
          }
        ]
      }
    ];
  },
  // experimental: {
  //   outputFileTracingExcludes: [
  //     "node_modules/.cache/**",
  //     "node_modules/.bin/**",
  //     ".next/cache/**",
  //     ".git/**"
  //   ]
  // }
}

module.exports = nextConfig
