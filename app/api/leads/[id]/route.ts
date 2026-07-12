import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Lead from '@/lib/models/Lead';
import { verifyAuth } from '@/lib/auth';

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
        const { status, notes } = await req.json();

        const lead = await Lead.findByIdAndUpdate(
            id,
            { status, notes },
            { new: true }
        );

        if (!lead) {
            return NextResponse.json({
                success: false,
                message: 'Lead not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: lead
        });
    } catch (error: any) {
        console.error('Error updating lead:', error);
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

        const lead = await Lead.findByIdAndDelete(id);

        if (!lead) {
            return NextResponse.json({
                success: false,
                message: 'Lead not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Lead deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting lead:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
