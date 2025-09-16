// API endpoint for virtual try-on application
export const runtime = 'nodejs';
// Allow bigger payloads since images are passed as data URLs between steps
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';
import { env } from '@/lib/env';
import { createClient } from '@supabase/supabase-js'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'

// Initialize Google Generative AI with environment variable
const genAI = new GoogleGenerativeAI(env.get('GEMINI_API_KEY'));
const geminiImageModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-image-preview',
  generationConfig: {
    temperature: 0.4, // Slightly higher for creative try-on application
    maxOutputTokens: 2048,
  }
});

interface TryOnRequest {
  userImageUrl: string; // Base64 data URL from extension
  productImageUrl: string; // Isolated product image URL or base64
  productType: 'tshirt' | 'shoes' | 'accessories' | 'pants' | 'dress' | 'jacket';
  fitInstructions?: string;
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request as unknown as Request)
}

export async function POST(request: NextRequest) {
  const corsHeaders = buildCorsHeaders(request as unknown as Request)
  try {
    // Authenticate via Authorization: Bearer or HttpOnly cookie sb_at
    const authHeader = request.headers.get('authorization') || ''
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i)
    let accessToken = bearerMatch ? bearerMatch[1] : ''
    if (!accessToken) {
      const rawCookie = request.headers.get('cookie') || ''
      const cookiePairs = rawCookie
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const idx = s.indexOf('=');
          const key = idx === -1 ? s : s.slice(0, idx);
          const val = idx === -1 ? '' : decodeURIComponent(s.slice(idx + 1));
          return [key, val] as [string, string];
        })
      const map = new Map<string, string>(cookiePairs)
      accessToken = map.get('sb_at') || ''
    }
    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'Unauthorized: missing access token' }, { status: 401, headers: corsHeaders })
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    const db = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${accessToken}` } } })

    // Identify user and ensure monthly top-up
    const { data: userRes } = await db.auth.getUser()
    const userId = userRes?.user?.id
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }
    await db.rpc('ensure_monthly_topup', { p_user_id: userId })
    // Consume 1 credit atomically; block if none
    const { data: consumed } = await db.rpc('consume_credits', { p_user_id: userId, p_delta: 1 })
    if (!consumed) {
      return NextResponse.json({ ok: false, error: 'Not enough credits' }, { status: 402, headers: corsHeaders })
    }
    // Safely parse JSON body
    const rawBody = await request.text().catch(() => '')
    if (!rawBody) {
      return NextResponse.json(
        { error: 'Request body is required (JSON with userImageUrl, productImageUrl, productType)' },
        { status: 400, headers: corsHeaders }
      )
    }
    let parsed: unknown
    try {
      parsed = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: corsHeaders })
    }
    const body = parsed as Partial<TryOnRequest>
    const userImageUrl = typeof body.userImageUrl === 'string' ? body.userImageUrl : ''
    const productImageUrl = typeof body.productImageUrl === 'string' ? body.productImageUrl : ''
    const productType = typeof body.productType === 'string' && ['tshirt','shoes','accessories','pants','dress','jacket'].includes(body.productType as string)
      ? (body.productType as TryOnRequest['productType'])
      : undefined
    const fitInstructions = typeof body.fitInstructions === 'string' ? body.fitInstructions : undefined

    if (!userImageUrl || !productImageUrl || !productType) {
      return NextResponse.json(
        { error: 'User image, product image, and product type are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('👕 Starting virtual try-on with Gemini 2.5 Flash Image...');
    console.log('Product Type:', productType);

    // Step 1: Process user image (from base64 data URL)
    console.log('👤 Processing user image...');
    let userImageBuffer: Buffer;
    
    if (userImageUrl.startsWith('data:')) {
      // Extract base64 data from data URL
      const base64Data = userImageUrl.split(',')[1];
      userImageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      // Download if it's a URL
      const userResponse = await fetch(userImageUrl);
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user image: ${userResponse.status}`);
      }
      userImageBuffer = Buffer.from(await userResponse.arrayBuffer());
    }

    // Step 2: Process product image (could be URL or base64)
    console.log('🛍️ Processing product image...');
    let productImageBuffer: Buffer;
    
    if (productImageUrl.startsWith('data:')) {
      const base64Data = productImageUrl.split(',')[1];
      productImageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      const productResponse = await fetch(productImageUrl);
      if (!productResponse.ok) {
        throw new Error(`Failed to fetch product image: ${productResponse.status}`);
      }
      productImageBuffer = Buffer.from(await productResponse.arrayBuffer());
    }

    // Step 3: Optimize both images with Sharp
    console.log('🔧 Optimizing images for try-on...');
    
    const optimizedUserImage = await sharp(userImageBuffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    const optimizedProductImage = await sharp(productImageBuffer)
      .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Step 4: Create try-on prompt
    const tryOnPrompt = createTryOnPrompt(productType, fitInstructions);

    console.log('🤖 Sending to Gemini for virtual try-on...');
    console.log('📋 Prompt:', tryOnPrompt);

    // Step 5: Send both images to Gemini for try-on
    let response;
    try {
      response = await geminiImageModel.generateContent([
        tryOnPrompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: optimizedUserImage.toString('base64')
          }
        },
        "Now apply this product to the person:",
        {
          inlineData: {
            mimeType: 'image/jpeg', 
            data: optimizedProductImage.toString('base64')
          }
        }
      ]);

      console.log('✅ Received try-on response from Gemini');

    } catch (geminiError: any) {
      console.error('❌ Gemini try-on error:', geminiError);
      throw geminiError;
    }

    // Step 6: Process response
    const generatedImages: string[] = [];

    if (response.response?.candidates?.[0]?.finishReason === 'SAFETY') {
      return NextResponse.json({
        ok: false,
        error: 'Content blocked by safety filters. Please try different images.',
        method: 'safety_blocked'
      }, { headers: corsHeaders });
    }

    if (response.response?.candidates?.[0]?.content?.parts) {
      for (const part of response.response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          const dataUrl = `data:${mimeType};base64,${imageData}`;
          generatedImages.push(dataUrl);
          console.log(`✅ Generated try-on image: ${mimeType}`);
        }
      }
    }

    if (generatedImages.length === 0) {
      return NextResponse.json({
        ok: false,
        error: 'Failed to generate try-on image. Please try again with different images.',
        method: 'no_generation'
      }, { headers: corsHeaders });
    }

    console.log('🎉 Virtual try-on successful!');

    return NextResponse.json({
      ok: true,
      tryOnImage: generatedImages[0],
      method: 'gemini_tryon',
      productType: productType,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ Virtual try-on error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to process virtual try-on',
        timestamp: new Date().toISOString()
      },
      { status: 500, headers: corsHeaders }
    );
  }

}

// Helper function for creating try-on prompts
function createTryOnPrompt(productType: string, customInstructions?: string): string {
  const basePrompt = "Create a realistic virtual try-on image showing the person wearing the provided product. Maintain the person's pose, lighting, and background while naturally applying the product to them.";
  
  const typeSpecificInstructions: Record<string, string> = {
    'tshirt': 'Apply the t-shirt/shirt to the person. Make sure it fits naturally on their body, matching their pose and body shape. Keep the original colors and design of the garment.',
    'shoes': 'Place the shoes on the person\'s feet. Ensure they look natural and properly sized for their feet. Maintain the shoe\'s original design and colors.',
    'pants': 'Apply the pants/trousers to the person. Make sure they fit naturally on their legs and waist. Keep the original style and color of the pants.',
    'dress': 'Apply the dress to the person. Ensure it fits naturally on their body shape and pose. Maintain the dress\'s original design, color, and style.',
    'jacket': 'Apply the jacket/outerwear to the person. Make sure it fits over their existing clothing naturally. Keep the jacket\'s original design and color.',
    'accessories': 'Apply the accessory (watch, jewelry, bag, etc.) to the appropriate part of the person\'s body. Make it look natural and properly positioned.'
  };

  const specificInstruction = typeSpecificInstructions[productType] || typeSpecificInstructions['tshirt'];
  
  if (customInstructions) {
    return `${basePrompt} ${specificInstruction} Additional instructions: ${customInstructions}`;
  }
  
  return `${basePrompt} ${specificInstruction}`;
}
