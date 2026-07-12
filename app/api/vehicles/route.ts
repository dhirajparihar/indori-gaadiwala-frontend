import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vehicle from '@/lib/models/Vehicle';
import { verifyAuth } from '@/lib/auth';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);

        const type = searchParams.get('type');
        const brand = searchParams.get('brand');
        const fuelType = searchParams.get('fuelType');
        const transmission = searchParams.get('transmission');
        const status = searchParams.get('status');
        const featured = searchParams.get('featured');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');

        // Build filter object
        let filter: any = {};

        if (type) filter.type = type;
        if (brand) filter.brand = new RegExp(brand, 'i');
        if (fuelType) filter.fuelType = fuelType;
        if (transmission) filter.transmission = transmission;
        if (status) filter.status = status;
        if (featured) filter.featured = featured === 'true';

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice && !isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice);
            if (maxPrice && !isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
        }

        const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
    } catch (error: any) {
        console.error('Get vehicles error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const currentUser = await verifyAuth(req);
        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'No authentication token, access denied'
            }, { status: 401 });
        }

        await dbConnect();
        const formData = await req.formData();

        // Extract text fields
        const title = formData.get('title') as string;
        const type = formData.get('type') as string;
        const brand = formData.get('brand') as string;
        const model = formData.get('model') as string;
        const year = formData.get('year') ? Number(formData.get('year')) : undefined;
        const price = formData.get('price') ? Number(formData.get('price')) : undefined;
        const originalPrice = formData.get('originalPrice') ? Number(formData.get('originalPrice')) : undefined;
        const mileage = formData.get('mileage') as string;
        const fuelType = formData.get('fuelType') as string;
        const transmission = formData.get('transmission') as string;
        const description = formData.get('description') as string;
        const ownerCount = formData.get('ownerCount') ? Number(formData.get('ownerCount')) : 1;
        const location = (formData.get('location') as string) || 'India';
        const featured = formData.get('featured') === 'true';
        const status = (formData.get('status') as string) || 'available';

        // Validate basic fields
        if (!title || !type || !brand || !model || !year || !price || !originalPrice || !mileage || !fuelType || !transmission || !description) {
            return NextResponse.json({
                success: false,
                message: 'Please fill in all required fields'
            }, { status: 400 });
        }

        // Upload images
        const images: string[] = [];
        const imageFiles = formData.getAll('images') as File[];
        for (const file of imageFiles) {
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const secureUrl = await uploadBufferToCloudinary(buffer, 'gaadiwala/vehicles');
                images.push(secureUrl);
            }
        }

        // Parse features
        let features: string[] = [];
        const rawFeatures = formData.get('features');
        if (rawFeatures) {
            if (typeof rawFeatures === 'string') {
                try {
                    features = JSON.parse(rawFeatures);
                } catch (e) {
                    features = rawFeatures.split(',').map((f: string) => f.trim()).filter(Boolean);
                }
            }
        }

        const vehicleData = {
            title,
            type,
            brand,
            model,
            year,
            price,
            originalPrice,
            mileage,
            fuelType,
            transmission,
            description,
            ownerCount,
            location,
            featured,
            status,
            images,
            features
        };

        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();

        return NextResponse.json({
            success: true,
            message: 'Vehicle created successfully',
            data: vehicle
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create vehicle error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
