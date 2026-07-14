import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HappyCustomer from '@/lib/models/HappyCustomer';
import { verifyAuth } from '@/lib/auth';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';
import { validators, handleValidationError } from '@/lib/validation';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const customers = await HappyCustomer.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error: any) {
        console.error('Get happy customers error:', error);
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

        const name = formData.get('name') as string;
        const vehicleName = formData.get('vehicleName') as string;
        const review = formData.get('review') as string;
        const ratingVal = formData.get('rating');
        const rating = ratingVal ? Number(ratingVal) : 5;
        const deliveryDate = formData.get('deliveryDate') as string;

        // Validate required fields
        validators.required(name, 'Name');
        validators.required(vehicleName, 'Vehicle name');
        validators.required(review, 'Review');

        // Validate name length
        validators.name(name);

        // Validate vehicle name length
        validators.minLength(vehicleName, 3, 'Vehicle name');

        // Validate review length
        validators.minLength(review, 10, 'Review');

        // Validate rating range
        validators.rating(rating);

        const file = formData.get('image') as File;
        if (!file || file.size === 0) {
            return NextResponse.json({
                success: false,
                message: 'Customer delivery photo is required'
            }, { status: 400 });
        }

        // Upload image to Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageUrl = await uploadBufferToCloudinary(buffer, 'gaadiwala/customers');

        if (!imageUrl) {
            return NextResponse.json({
                success: false,
                message: 'Image upload failed'
            }, { status: 500 });
        }

        const newCustomer = await HappyCustomer.create({
            name,
            vehicleName,
            review,
            rating,
            imageUrl,
            deliveryDate: deliveryDate || undefined
        });

        return NextResponse.json({
            success: true,
            data: newCustomer
        }, { status: 201 });

    } catch (error: unknown) {
        console.error('Create happy customer error:', error);
        
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
