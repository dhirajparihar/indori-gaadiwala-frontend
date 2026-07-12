import { compressImage } from './imageCompressor';

// Helper function to create vehicle
export const createVehicleWithImages = async (formData: any, images: File[]) => {
    const data = new FormData();

    // Append all form fields
    Object.keys(formData).forEach(key => {
        if (key === 'features') {
            const featuresArray = formData[key]
                .split(',')
                .map((f: string) => f.trim())
                .filter((f: string) => f);
            data.append(key, JSON.stringify(featuresArray));
        } else {
            data.append(key, formData[key].toString());
        }
    });

    // Compress and append images
    const compressedImages = await Promise.all(images.map(image => compressImage(image)));
    compressedImages.forEach((image) => {
        data.append('images', image);
    });

    return data;
};
