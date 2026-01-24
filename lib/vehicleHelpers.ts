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

    // Append images
    images.forEach((image) => {
        data.append('images', image);
    });

    return data;
};
