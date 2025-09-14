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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
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
