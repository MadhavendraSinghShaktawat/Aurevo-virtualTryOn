# 🔧 Environment Setup Guide for Fixtral

This guide will help you set up the required environment variables for local development and production deployment.

## 🚀 Quick Start

### 1. Copy the Example File
```bash
cp .env.example .env.local
```

### 2. Fill in Required Variables
Open `.env.local` and replace the placeholder values with your actual API keys:

```bash
# REQUIRED - Get from Google AI Studio
GEMINI_API_KEY=your_actual_gemini_api_key_here

# REQUIRED - Get from Supabase Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

## 📋 Required Variables

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to `GEMINI_API_KEY`

### Supabase Configuration
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the URL to `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the anon/public key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔧 Optional Variables

### Reddit Integration (Optional)
If you want Reddit post analysis features:

1. Go to [Reddit Apps](https://www.reddit.com/prefs/apps)
2. Create a new "script" application
3. Fill in the Reddit credentials in `.env.local`

### OpenRouter (Optional)
Alternative AI provider for fallback:

1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Create an API key
3. Add to `OPENROUTER_API_KEY`

## 🚀 Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub (without `.env.local`)
2. Connect your repo to Vercel
3. In Vercel dashboard, go to Settings → Environment Variables
4. Add all the required variables from your `.env.local`

### Other Platforms
Set the environment variables in your hosting platform's dashboard:
- Railway
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## ✅ Verification

### Check Environment Status
The app will automatically validate environment variables on startup and show helpful error messages if anything is missing.

### Build Test
```bash
npm run build
```
Should complete successfully even without environment variables.

### Runtime Test
```bash
npm run dev
```
Will show validation errors if required variables are missing.

## 🔒 Security Notes

- **Never commit `.env.local`** to version control
- **Use different API keys** for development and production
- **Rotate API keys regularly** for security
- **Use environment-specific configurations** for different deployment stages

## 🆘 Troubleshooting

### "Missing required environment variables" Error
- Check that `.env.local` exists and contains all required variables
- Restart your development server after adding new variables
- Ensure no extra spaces or quotes around values

### Build Fails
- The app should build successfully even without environment variables
- If build fails, check for syntax errors in your code

### Runtime Errors
- Check browser console for detailed environment validation messages
- Verify API keys are valid and have proper permissions
- Check network connectivity to external services

## 📚 Additional Resources

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables Guide](https://vercel.com/docs/projects/environment-variables)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Supabase Documentation](https://supabase.com/docs)
