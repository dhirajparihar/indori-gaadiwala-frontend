/**
 * Utility function to compress images using HTML5 Canvas on client side.
 * Reduces dimension if it exceeds max size, and compresses quality.
 * 
 * @param file The original image file
 * @param maxWidth Maximum width in pixels (default 1600)
 * @param maxHeight Maximum height in pixels (default 1600)
 * @param quality Quality factor between 0.0 and 1.0 (default 0.8)
 */
export const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.7): Promise<File> => {
    return new Promise((resolve) => {
        // If it's not an image file or if window/FileReader is not available (SSR), return the original file
        if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
            return resolve(file);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return resolve(file);
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            return resolve(file);
                        }
                        // Create a new File from the Blob
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        
                        console.log(`[Image Compressor] "${file.name}": Original size = ${(file.size / 1024 / 1024).toFixed(2)}MB, Compressed size = ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                        
                        // Only return the compressed file if it's actually smaller
                        if (compressedFile.size < file.size) {
                            resolve(compressedFile);
                        } else {
                            resolve(file);
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
};
