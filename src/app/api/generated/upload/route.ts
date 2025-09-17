import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { handleCorsOptions, buildCorsHeaders } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request as unknown as Request);
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500, headers: buildCorsHeaders(req as unknown as Request) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body = await req.json();
    const { dataUrl, userId, sourceUrl, productType } = body;

    if (!dataUrl || !userId) {
      return NextResponse.json(
        { error: 'dataUrl and userId are required' },
        { status: 400, headers: buildCorsHeaders(req as unknown as Request) }
      );
    }

    // Convert data URL to buffer
    const base64Data = dataUrl.split(',')[1];
    if (!base64Data) {
      return NextResponse.json(
        { error: 'Invalid data URL format' },
        { status: 400, headers: buildCorsHeaders(req as unknown as Request) }
      );
    }

    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const timestamp = Date.now();
    const storagePath = `${userId}/${timestamp}.png`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated-tryons')
      .upload(storagePath, buffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500, headers: buildCorsHeaders(req as unknown as Request) }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('generated-tryons')
      .getPublicUrl(storagePath);

    // Save metadata to database
    const { data: metadataData, error: metadataError } = await supabase
      .from('generated_images')
      .insert({
        user_id: userId,
        storage_path: storagePath,
        public_url: urlData.publicUrl,
        source_url: sourceUrl,
        product_type: productType
      })
      .select()
      .single();

    if (metadataError) {
      console.error('Metadata error:', metadataError);
      // Try to clean up uploaded file
      await supabase.storage.from('generated-tryons').remove([storagePath]);
      return NextResponse.json(
        { error: 'Failed to save metadata' },
        { status: 500, headers: buildCorsHeaders(req as unknown as Request) }
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: metadataData.id,
        publicUrl: urlData.publicUrl,
        storagePath
      },
      { status: 200, headers: buildCorsHeaders(req as unknown as Request) }
    );

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: buildCorsHeaders(req as unknown as Request) }
    );
  }
}
