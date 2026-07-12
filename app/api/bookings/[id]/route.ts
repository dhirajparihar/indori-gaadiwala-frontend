import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/lib/models/Booking';
import { verifyAuth } from '@/lib/auth';
import '@/lib/models/Vehicle'; // Ensure Vehicle model is registered for populate

export async function GET(
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

        const booking = await Booking.findById(id).populate('vehicle');

        if (!booking) {
            return NextResponse.json({
                success: false,
                message: 'Booking not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: booking
        });
    } catch (error: any) {
        console.error('Get booking error:', error);
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
        const body = await req.json();

        let booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json({
                success: false,
                message: 'Booking not found'
            }, { status: 404 });
        }

        booking = await Booking.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        ).populate('vehicle');

        return NextResponse.json({
            success: true,
            message: 'Booking updated successfully',
            data: booking
        });
    } catch (error: any) {
        console.error('Update booking error:', error);
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

        const booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json({
                success: false,
                message: 'Booking not found'
            }, { status: 404 });
        }

        await Booking.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error: any) {
        console.error('Delete booking error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
