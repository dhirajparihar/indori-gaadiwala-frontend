import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vehicle from '@/lib/models/Vehicle';
import { verifyAuth } from '@/lib/auth';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';
import { validators, handleValidationError } from '@/lib/validation';

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
        const limit = searchParams.get('limit');
        const fields = searchParams.get('fields');

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

        let query = Vehicle.find(filter).sort({ createdAt: -1 });

        if (fields) {
            query = query.select(fields.split(',').join(' '));
        }

        if (limit && !isNaN(Number(limit))) {
            query = query.limit(Number(limit));
        }

        const vehicles = await query;

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

        // Validate required fields
        validators.required(title, 'Title');
        validators.required(type, 'Type');
        validators.required(brand, 'Brand');
        validators.required(model, 'Model');
        validators.required(year, 'Year');
        validators.required(price, 'Price');
        validators.required(originalPrice, 'Original price');
        validators.required(mileage, 'Mileage');
        validators.required(fuelType, 'Fuel type');
        validators.required(transmission, 'Transmission');
        validators.required(description, 'Description');

        // Validate title length
        validators.minLength(title, 5, 'Title');

        // Validate year
        if (year !== undefined) {
            validators.year(year);
        }

        // Validate price
        if (price !== undefined) {
            validators.price(price, 10000, 100000000);
        }

        // Validate original price (should be greater than or equal to price)
        if (originalPrice !== undefined && price !== undefined) {
            if (originalPrice < price) {
                throw new Error('Original price cannot be less than selling price');
            }
        }

        // Validate mileage
        validators.mileage(mileage);

        // Validate owner count
        validators.ownerCount(ownerCount);

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
    } catch (error: unknown) {
        console.error('Create vehicle error:', error);
        
        // Handle validation errors
        const validationError = handleValidationError(error);
        if (validationError.statusCode === 400) {
            return NextResponse.json(validationError, { status: validationError.statusCode });
        }
        
        // Handle other errors
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Server error'
        }, { status: 500 });
    }
}
