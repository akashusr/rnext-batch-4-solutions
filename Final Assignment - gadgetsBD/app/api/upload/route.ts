import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage, uploadMultipleImages } from '@/lib/imagekit';

// POST /api/upload - Upload images to ImageKit
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Only shop owners can upload images
        if (!session || session.user.userType !== 'shopOwner') {
            return NextResponse.json(
                { error: 'Unauthorized. Only shop owners can upload images.' },
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

        // Validate file types
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json(
                    { error: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.` },
                    { status: 400 }
                );
            }

            // Validate file size (max 5MB per file)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return NextResponse.json(
                    { error: `File ${file.name} is too large. Maximum size is 5MB.` },
                    { status: 400 }
                );
            }
        }

        // Convert files to buffers
        const fileBuffers = await Promise.all(
            files.map(async (file) => {
                const bytes = await file.arrayBuffer();
                return {
                    buffer: Buffer.from(bytes),
                    name: file.name,
                };
            })
        );

        // Upload to ImageKit
        const uploadedImages = await uploadMultipleImages(
            fileBuffers,
            'products' // folder name in ImageKit
        );

        return NextResponse.json({
            success: true,
            images: uploadedImages,
            message: `Successfully uploaded ${uploadedImages.length} image(s)`,
        });
    } catch (error: any) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload images' },
            { status: 500 }
        );
    }
}
