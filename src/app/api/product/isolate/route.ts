// API endpoint for isolating product on white background
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';
import { env } from '@/lib/env';

// Initialize Google Generative AI with environment variable
const genAI = new GoogleGenerativeAI(env.get('GEMINI_API_KEY'));
const geminiImageModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-image-preview',
  generationConfig: {
    temperature: 0.3, // Lower temperature for consistent product isolation
    maxOutputTokens: 2048,
  }
});

interface ProductIsolateRequest {
  imageUrl: string;
  productType: 'tshirt' | 'shoes' | 'accessories' | 'pants' | 'dress' | 'jacket';
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, productType }: ProductIsolateRequest = await request.json();

    if (!imageUrl || !productType) {
      return NextResponse.json(
        { error: 'Image URL and product type are required' },
        { status: 400 }
      );
    }

    console.log('🎯 Isolating product with Gemini 2.5 Flash Image...');
    console.log('Image URL:', imageUrl);
    console.log('Product Type:', productType);

    // Step 1: Download the product image
    console.log('📥 Downloading product image...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const imageResponse = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    console.log('✅ Downloaded image, size:', imageBuffer.byteLength, 'bytes');

    // Step 2: Process with Sharp for optimization
    let processedImageBuffer: Buffer;

    try {
      const sharpImage = sharp(Buffer.from(imageBuffer));
      const metadata = await sharpImage.metadata();
      console.log(`🖼️ Image info: ${metadata.format} ${metadata.width}x${metadata.height}`);

      // Optimize image for processing
      processedImageBuffer = await sharpImage
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer();

    } catch (sharpError) {
      console.error('❌ Sharp processing error:', sharpError);
      processedImageBuffer = Buffer.from(imageBuffer);
    }

    // Step 3: Create isolation prompt based on product type
    const isolationPrompt = createIsolationPrompt(productType);

    console.log('🤖 Sending to Gemini for product isolation...');
    console.log('📋 Prompt:', isolationPrompt);

    let response;
    try {
      response = await geminiImageModel.generateContent([
        isolationPrompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: processedImageBuffer.toString('base64')
          }
        }
      ]);

      console.log('✅ Received response from Gemini');

    } catch (geminiError: any) {
      console.error('❌ Gemini API error:', geminiError);
      throw geminiError;
    }

    // Step 4: Process response and extract isolated product image
    const generatedImages: string[] = [];

    if (response.response?.candidates?.[0]?.finishReason === 'SAFETY') {
      console.log('🚫 Content blocked by safety filters');
      return NextResponse.json({
        ok: false,
        error: 'Content blocked by safety filters. Please try a different image.',
        method: 'safety_blocked'
      });
    }

    if (response.response?.candidates?.[0]?.content?.parts) {
      for (const part of response.response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          const dataUrl = `data:${mimeType};base64,${imageData}`;
          generatedImages.push(dataUrl);
          console.log(`✅ Generated isolated product image: ${mimeType}`);
        }
      }
    }

    if (generatedImages.length === 0) {
      console.log('⚠️ No isolated image generated, returning enhanced original');
      
      // Fallback: Return optimized original image
      const fallbackImage = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;
      
      return NextResponse.json({
        ok: true,
        isolatedImage: fallbackImage,
        method: 'fallback_original',
        note: 'Used optimized original image - Gemini did not generate isolated version'
      });
    }

    console.log('🎉 Product isolation successful!');

    return NextResponse.json({
      ok: true,
      isolatedImage: generatedImages[0],
      method: 'gemini_isolation',
      productType: productType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Product isolation error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to isolate product',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }

}

// Helper function for creating isolation prompts
function createIsolationPrompt(productType: string): string {
  const basePrompt = "Remove the background and isolate only the product on a clean white background. Keep the product exactly as it is - same colors, textures, and details. Make sure the product is centered and well-lit.";
  
  const typeSpecificInstructions: Record<string, string> = {
    'tshirt': 'Focus on the t-shirt/shirt. Remove any person wearing it and place just the garment on white background as if laid flat or on a mannequin.',
    'shoes': 'Isolate the shoes/footwear only. Remove any background, floor, or other objects. Place shoes on white background.',
    'pants': 'Extract the pants/trousers only. Remove the person and background. Show the garment on white background.',
    'dress': 'Isolate the dress/garment only. Remove the person wearing it and place the dress on white background.',
    'jacket': 'Extract the jacket/outerwear only. Remove the person and background. Show the jacket on white background.',
    'accessories': 'Isolate the accessory (watch, jewelry, bag, etc.) only. Remove all background and place on clean white background.'
  };

  return `${basePrompt} ${typeSpecificInstructions[productType] || typeSpecificInstructions['tshirt']}`;
}
