import ImageKit from 'imagekit';

// Validate environment variables
if (!process.env.IMAGEKIT_PUBLIC_KEY) {
    throw new Error('IMAGEKIT_PUBLIC_KEY is not defined in .env file');
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is not defined in .env file');
}

if (!process.env.IMAGEKIT_URL_ENDPOINT) {
    throw new Error('IMAGEKIT_URL_ENDPOINT is not defined in .env file');
}

// Initialize ImageKit instance
export const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload an image to ImageKit
 * @param file - File buffer
 * @param fileName - Name of the file
 * @param folder - Folder path in ImageKit (default: 'products')
 * @returns Image URL
 */
export async function uploadImage(
    file: Buffer,
    fileName: string,
    folder: string = 'products'
): Promise<{ url: string; fileId: string }> {
    try {
        const response = await imagekit.upload({
            file: file,
            fileName: fileName,
            folder: folder,
            useUniqueFileName: true,
            tags: ['gadgets-bd'],
        });

        return {
            url: response.url,
            fileId: response.fileId,
        };
    } catch (error: any) {
        console.error('ImageKit upload error:', error);
        throw new Error(error.message || 'Failed to upload image to ImageKit');
    }
}

/**
 * Upload multiple images to ImageKit
 * @param files - Array of file buffers with names
 * @param folder - Folder path in ImageKit
 * @returns Array of image URLs
 */
export async function uploadMultipleImages(
    files: Array<{ buffer: Buffer; name: string }>,
    folder: string = 'products'
): Promise<Array<{ url: string; fileId: string }>> {
    try {
        const uploadPromises = files.map((file) =>
            uploadImage(file.buffer, file.name, folder)
        );

        return await Promise.all(uploadPromises);
    } catch (error: any) {
        console.error('ImageKit multiple upload error:', error);
        throw new Error('Failed to upload images to ImageKit');
    }
}

/**
 * Delete an image from ImageKit
 * @param fileId - ImageKit file ID
 */
export async function deleteImage(fileId: string): Promise<void> {
    try {
        await imagekit.deleteFile(fileId);
    } catch (error: any) {
        console.error('ImageKit delete error:', error);
        throw new Error('Failed to delete image from ImageKit');
    }
}

/**
 * Get optimized image URL with transformations
 * @param url - Original image URL
 * @param width - Width in pixels
 * @param height - Height in pixels
 * @param quality - Quality (1-100)
 * @returns Transformed image URL
 */
export function getOptimizedImageUrl(
    url: string,
    width?: number,
    height?: number,
    quality: number = 80
): string {
    const transformations: string[] = [];

    if (width) transformations.push(`w-${width}`);
    if (height) transformations.push(`h-${height}`);
    transformations.push(`q-${quality}`);
    transformations.push('f-auto'); // Auto format (WebP, AVIF)

    const tr = transformations.join(',');
    return `${url}?tr=${tr}`;
}
