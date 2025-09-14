import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Create Supabase client with environment variables
export const supabase = createClient(
  env.get('NEXT_PUBLIC_SUPABASE_URL'),
  env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }
      reddit_posts: {
        Row: {
          id: string
          post_id: string
          title: string
          description: string | null
          image_url: string
          author: string
          subreddit: string
          score: number
          num_comments: number
          created_utc: number
          permalink: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          title: string
          description?: string | null
          image_url: string
          author: string
          subreddit: string
          score: number
          num_comments: number
          created_utc: number
          permalink?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          title?: string
          description?: string | null
          image_url?: string
          author?: string
          subreddit?: string
          score?: number
          num_comments?: number
          created_utc?: number
          permalink?: string | null
          created_at?: string
        }
      }
      edit_history: {
        Row: {
          id: string
          user_id: string
          post_id: string
          post_title: string
          request_text: string
          analysis: string
          edit_prompt: string
          original_image_url: string
          edited_image_url: string | null
          method: string
          status: 'completed' | 'failed'
          processing_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          post_title: string
          request_text: string
          analysis: string
          edit_prompt: string
          original_image_url: string
          edited_image_url?: string | null
          method: string
          status?: 'completed' | 'failed'
          processing_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          post_title?: string
          request_text?: string
          analysis?: string
          edit_prompt?: string
          original_image_url?: string
          edited_image_url?: string | null
          method?: string
          status?: 'completed' | 'failed'
          processing_time?: number | null
          updated_at?: string
        }
      }
    }
  }
}
