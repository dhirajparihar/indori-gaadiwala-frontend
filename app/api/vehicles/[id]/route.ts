import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vehicle from '@/lib/models/Vehicle';
import { verifyAuth } from '@/lib/auth';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return NextResponse.json({
                success: false,
                message: 'Vehicle not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: vehicle
        });
    } catch (error: any) {
        console.error('Get vehicle error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await verifyAuth(req);
        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'No authentication token, access denied'
            }, { status: 401 });
        }

        await dbConnect();
        const { id } = await context.params;

        let vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return NextResponse.json({
                success: false,
                message: 'Vehicle not found'
            }, { status: 404 });
        }

        let title, type, brand, model, year, price, originalPrice, mileage, fuelType, transmission, description, ownerCount, location, featured, status, newFeatures: string[] | undefined, imageFiles: File[] = [];

        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            title = formData.get('title') as string;
            type = formData.get('type') as string;
            brand = formData.get('brand') as string;
            model = formData.get('model') as string;
            year = formData.get('year') ? Number(formData.get('year')) : undefined;
            price = formData.get('price') ? Number(formData.get('price')) : undefined;
            originalPrice = formData.get('originalPrice') ? Number(formData.get('originalPrice')) : undefined;
            mileage = formData.get('mileage') as string;
            fuelType = formData.get('fuelType') as string;
            transmission = formData.get('transmission') as string;
            description = formData.get('description') as string;
            ownerCount = formData.get('ownerCount') ? Number(formData.get('ownerCount')) : undefined;
            location = formData.get('location') as string;
            featured = formData.get('featured') !== null ? formData.get('featured') === 'true' : undefined;
            status = formData.get('status') as string;
            
            const rawFeatures = formData.get('features');
            if (rawFeatures) {
                if (typeof rawFeatures === 'string') {
                    try {
                        newFeatures = JSON.parse(rawFeatures);
                    } catch (e) {
                        newFeatures = rawFeatures.split(',').map((f: string) => f.trim()).filter(Boolean);
                    }
                }
            }
            
            imageFiles = formData.getAll('images') as File[];
        } else {
            const body = await req.json();
            title = body.title;
            type = body.type;
            brand = body.brand;
            model = body.model;
            year = body.year !== undefined ? Number(body.year) : undefined;
            price = body.price !== undefined ? Number(body.price) : undefined;
            originalPrice = body.originalPrice !== undefined ? Number(body.originalPrice) : undefined;
            mileage = body.mileage;
            fuelType = body.fuelType;
            transmission = body.transmission;
            description = body.description;
            ownerCount = body.ownerCount !== undefined ? Number(body.ownerCount) : undefined;
            location = body.location;
            featured = body.featured;
            status = body.status;
            newFeatures = body.features;
        }

        // Upload any new images
        const newImages: string[] = [];
        for (const file of imageFiles) {
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const secureUrl = await uploadBufferToCloudinary(buffer, 'gaadiwala/vehicles');
                newImages.push(secureUrl);
            }
        }

        // Build update object
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (type !== undefined) updateData.type = type;
        if (brand !== undefined) updateData.brand = brand;
        if (model !== undefined) updateData.model = model;
        if (year !== undefined) updateData.year = year;
        if (price !== undefined) updateData.price = price;
        if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
        if (mileage !== undefined) updateData.mileage = mileage;
        if (fuelType !== undefined) updateData.fuelType = fuelType;
        if (transmission !== undefined) updateData.transmission = transmission;
        if (description !== undefined) updateData.description = description;
        if (ownerCount !== undefined) updateData.ownerCount = ownerCount;
        if (location !== undefined) updateData.location = location;
        if (featured !== undefined) updateData.featured = featured;
        if (status !== undefined) updateData.status = status;
        if (newFeatures !== undefined) updateData.features = newFeatures;

        // Add new images to existing list
        if (newImages.length > 0) {
            updateData.images = [...(vehicle.images || []), ...newImages];
        }

        // Recalculate discount if price or originalPrice changes
        const currentPrice = price !== undefined ? price : vehicle.price;
        const currentOriginalPrice = originalPrice !== undefined ? originalPrice : vehicle.originalPrice;
        if (currentPrice && currentOriginalPrice) {
            updateData.discount = Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100);
        }

        vehicle = await Vehicle.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Vehicle updated successfully',
            data: vehicle
        });
    } catch (error: any) {
        console.error('Update vehicle error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await verifyAuth(req);
        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'No authentication token, access denied'
            }, { status: 401 });
        }

        await dbConnect();
        const { id } = await context.params;

        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return NextResponse.json({
                success: false,
                message: 'Vehicle not found'
            }, { status: 404 });
        }

        // Delete images from Cloudinary
        if (vehicle.images && vehicle.images.length > 0) {
            for (const imageUrl of vehicle.images) {
                await deleteFromCloudinary(imageUrl);
            }
        }

        await Vehicle.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Vehicle deleted successfully'
        });
    } catch (error: any) {
        console.error('Delete vehicle error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
