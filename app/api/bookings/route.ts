import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/lib/models/Booking';
import { verifyAuth } from '@/lib/auth';
import '@/lib/models/Vehicle'; // Ensure Vehicle model is registered for populate
import { validators, handleValidationError } from '@/lib/validation';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        const { vehicle, customerName, customerPhone, bookingType } = body;
        const isThirdParty = bookingType === 'third_party_inspection';

        // Validate required fields
        validators.required(customerName, 'Name');
        validators.required(customerPhone, 'Phone number');
        if (!isThirdParty) {
            validators.required(vehicle, 'Vehicle');
        }

        // Validate name length
        validators.name(customerName);

        // Validate phone number
        validators.phone(customerPhone);

        const booking = new Booking(body);
        await booking.save();

        // Populate vehicle details if present
        if (booking.vehicle) {
            await booking.populate('vehicle');
        }

        return NextResponse.json({
            success: true,
            message: 'Booking request submitted successfully! We will contact you soon.',
            data: booking
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Create booking error:', error);
        
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

export async function GET(req: NextRequest) {
    try {
        const currentUser = await verifyAuth(req);
        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'No authentication token, access denied'
            }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        let filter: any = {};
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('vehicle')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error: any) {
        console.error('Get bookings error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
