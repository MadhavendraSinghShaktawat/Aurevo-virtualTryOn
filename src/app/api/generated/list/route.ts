import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { handleCorsOptions, buildCorsHeaders } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request as unknown as Request);
}

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500, headers: buildCorsHeaders(req as unknown as Request) }
      );
    }

    // Get access token from cookies
    const cookies = req.headers.get('cookie') || '';
    const accessTokenMatch = cookies.match(/sb_at=([^;]+)/);
    const accessToken = accessTokenMatch ? decodeURIComponent(accessTokenMatch[1]) : null;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: buildCorsHeaders(req as unknown as Request) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    });

    // Get user's generated images, ordered by most recent
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50); // Limit to last 50 images

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500, headers: buildCorsHeaders(req as unknown as Request) }
      );
    }

    return NextResponse.json(
      { images: data || [] },
      { status: 200, headers: buildCorsHeaders(req as unknown as Request) }
    );

  } catch (error) {
    console.error('List API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: buildCorsHeaders(req as unknown as Request) }
    );
  }
}
