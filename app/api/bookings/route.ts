import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/lib/models/Booking';
import { verifyAuth } from '@/lib/auth';
import '@/lib/models/Vehicle'; // Ensure Vehicle model is registered for populate

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        const { vehicle, customerName, customerPhone } = body;

        if (!vehicle || !customerName || !customerPhone) {
            return NextResponse.json({
                success: false,
                message: 'Vehicle, name and phone number are required'
            }, { status: 400 });
        }

        const booking = new Booking(body);
        await booking.save();

        // Populate vehicle details
        await booking.populate('vehicle');

        return NextResponse.json({
            success: true,
            message: 'Booking request submitted successfully! We will contact you soon.',
            data: booking
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create booking error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
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
