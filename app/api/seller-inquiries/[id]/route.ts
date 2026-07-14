import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SellerInquiry from '@/lib/models/SellerInquiry';
import { verifyAuth } from '@/lib/auth';

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

        const inquiry = await SellerInquiry.findById(id);

        if (!inquiry) {
            return NextResponse.json({
                success: false,
                message: 'Seller inquiry not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: inquiry
        });
    } catch (error: any) {
        console.error('Error fetching seller inquiry:', error);
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
        const { status, notes, inspectionDate, inspectionTimeSlot, inspectionLocation } = await req.json();

        const inquiry = await SellerInquiry.findByIdAndUpdate(
            id,
            { 
                status, 
                notes,
                ...(inspectionDate !== undefined && { inspectionDate: inspectionDate ? new Date(inspectionDate) : null }),
                ...(inspectionTimeSlot !== undefined && { inspectionTimeSlot }),
                ...(inspectionLocation !== undefined && { inspectionLocation }),
            },
            { new: true }
        );

        if (!inquiry) {
            return NextResponse.json({
                success: false,
                message: 'Seller inquiry not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: inquiry
        });
    } catch (error: any) {
        console.error('Error updating seller inquiry:', error);
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

        const inquiry = await SellerInquiry.findByIdAndDelete(id);

        if (!inquiry) {
            return NextResponse.json({
                success: false,
                message: 'Seller inquiry not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Seller inquiry deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting seller inquiry:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
