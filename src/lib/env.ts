/**
 * Environment Variable Validation and Type-Safe Access
 * Following Next.js and TypeScript best practices for production security
 */

// Type definitions for environment variables
interface EnvironmentVariables {
  // Required variables
  GEMINI_API_KEY: string
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  
  // Optional variables
  REDDIT_CLIENT_ID?: string
  REDDIT_CLIENT_SECRET?: string
  REDDIT_USERNAME?: string
  REDDIT_PASSWORD?: string
  REDDIT_USER_AGENT?: string
  REDDIT_2FA_CODE?: string
  OPENROUTER_API_KEY?: string
  ADMIN_ID?: string
  ADMIN_UID?: string
  NEXT_PUBLIC_APP_URL?: string
}

// Environment validation schema
const requiredEnvVars: (keyof EnvironmentVariables)[] = [
  'GEMINI_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

const optionalEnvVars: (keyof EnvironmentVariables)[] = [
  'REDDIT_CLIENT_ID',
  'REDDIT_CLIENT_SECRET', 
  'REDDIT_USERNAME',
  'REDDIT_PASSWORD',
  'REDDIT_USER_AGENT',
  'REDDIT_2FA_CODE',
  'OPENROUTER_API_KEY',
  'ADMIN_ID',
  'ADMIN_UID',
  'NEXT_PUBLIC_APP_URL'
]

// Default values for optional variables
const defaultValues: Partial<EnvironmentVariables> = {
  REDDIT_USER_AGENT: 'Fixtral:v1.0.0 (by /u/fixtral)',
  NEXT_PUBLIC_APP_URL: process.env.NODE_ENV === 'production' 
    ? 'https://fixtral.vercel.app' 
    : 'http://localhost:3000'
}

// Invalid placeholder values that should be replaced
const invalidPlaceholders = [
  'your_gemini_api_key_here',
  'your_anon_key_here', 
  'https://your-project-id.supabase.co',
  'build-time-gemini-key',
  'build-time-anon-key'
]

/**
 * Validates that all required environment variables are present and valid
 * @throws {Error} If required variables are missing or invalid
 */
export function validateEnvironmentVariables(): void {
  const missingRequired: string[] = []
  const invalidValues: string[] = []

  // Check required variables
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    
    if (!value) {
      missingRequired.push(envVar)
    } else if (invalidPlaceholders.includes(value)) {
      invalidValues.push(`${envVar} contains placeholder value: ${value}`)
    } else if (value.includes('your_') || value.includes('placeholder') || value.includes('example')) {
      // Additional check for common placeholder patterns
      invalidValues.push(`${envVar} appears to contain a placeholder value`)
    }
  }

  // Report errors
  const errors: string[] = []
  
  if (missingRequired.length > 0) {
    errors.push(`Missing required environment variables: ${missingRequired.join(', ')}`)
  }
  
  if (invalidValues.length > 0) {
    errors.push(`Invalid placeholder values found: ${invalidValues.join('; ')}`)
  }

  if (errors.length > 0) {
    const errorMessage = [
      '❌ Environment Variable Validation Failed:',
      ...errors,
      '',
      '📝 To fix this:',
      '1. Copy .env.example to .env.local',
      '2. Fill in your actual API keys and configuration values',
      '3. Restart your development server',
      '',
      '📚 Documentation: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables'
    ].join('\n')
    
    throw new Error(errorMessage)
  }
}

/**
 * Type-safe environment variable accessor
 * Validates variables on first access and provides defaults
 */
class EnvironmentConfig {
  private validated = false
  private config: EnvironmentVariables | null = null

  private ensureValidated(): void {
    if (!this.validated) {
      // Skip validation during build time or if in CI
      const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL && !process.env.RUNTIME_ENV
      
      if (!isBuildTime) {
        validateEnvironmentVariables()
      }
      
      this.validated = true
      
      // Build config object with defaults
      this.config = {} as EnvironmentVariables
      
      // Add required variables (with fallbacks during build)
      for (const envVar of requiredEnvVars) {
        if (isBuildTime) {
          // Provide valid placeholders for build time
          const buildPlaceholders: Record<string, string> = {
            'GEMINI_API_KEY': 'build-time-gemini-key',
            'NEXT_PUBLIC_SUPABASE_URL': 'https://build-time-placeholder.supabase.co',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'build-time-anon-key'
          }
          this.config[envVar] = buildPlaceholders[envVar] || 'build-time-placeholder'
        } else {
          this.config[envVar] = process.env[envVar]!
        }
      }
      
      // Add optional variables with defaults
      for (const envVar of optionalEnvVars) {
        const value = process.env[envVar] || defaultValues[envVar]
        if (value !== undefined) {
          (this.config as any)[envVar] = value
        }
      }
    }
  }

  /**
   * Get environment variable value with type safety
   */
  get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] {
    this.ensureValidated()
    return this.config![key]
  }

  /**
   * Check if an optional environment variable is configured
   */
  has(key: keyof EnvironmentVariables): boolean {
    this.ensureValidated()
    const value = this.config![key]
    return value !== undefined && value !== null && value !== ''
  }

  /**
   * Get configuration status for debugging
   */
  getStatus() {
    this.ensureValidated()
    
    return {
      required: requiredEnvVars.reduce((acc, key) => {
        acc[key] = {
          configured: !!this.config![key],
          hasValue: !!this.config![key] && this.config![key] !== ''
        }
        return acc
      }, {} as Record<string, { configured: boolean; hasValue: boolean }>),
      
      optional: optionalEnvVars.reduce((acc, key) => {
        acc[key] = {
          configured: !!this.config![key],
          hasValue: !!this.config![key] && this.config![key] !== ''
        }
        return acc
      }, {} as Record<string, { configured: boolean; hasValue: boolean }>)
    }
  }
}

// Export singleton instance
export const env = new EnvironmentConfig()

// Convenience exports for common patterns
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'

/**
 * Initialize environment validation (call this in your app startup)
 * This should be called as early as possible in your application
 */
export function initializeEnvironment(): void {
  // Skip validation during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    return
  }

  try {
    validateEnvironmentVariables()
    console.log('✅ Environment variables validated successfully')
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Environment validation failed')
    
    if (isProduction) {
      // In production, exit the process if environment is invalid
      process.exit(1)
    } else {
      // In development, show warning but continue
      console.warn('⚠️ Continuing in development mode with invalid environment')
    }
  }
}
