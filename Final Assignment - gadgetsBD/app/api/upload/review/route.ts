import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadMultipleImages } from '@/lib/imagekit';

// POST /api/upload/review - Upload review images (any authenticated user)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        if (files.length > 5) {
            return NextResponse.json(
                { error: 'Maximum 5 images allowed per review' },
                { status: 400 }
            );
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json(
                    { error: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.` },
                    { status: 400 }
                );
            }
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                return NextResponse.json(
                    { error: `File ${file.name} is too large. Maximum size is 5MB.` },
                    { status: 400 }
                );
            }
        }

        const fileBuffers = await Promise.all(
            files.map(async (file) => {
                const bytes = await file.arrayBuffer();
                return {
                    buffer: Buffer.from(bytes),
                    name: file.name,
                };
            })
        );

        const uploadedImages = await uploadMultipleImages(
            fileBuffers,
            'reviews'
        );
        console.log('[Review Upload] Uploaded images:', JSON.stringify(uploadedImages));

        return NextResponse.json({
            success: true,
            images: uploadedImages,
        });
    } catch (error: any) {
        console.error('Review upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload images' },
            { status: 500 }
        );
    }
}
