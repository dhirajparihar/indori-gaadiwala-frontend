import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HappyCustomer from '@/lib/models/HappyCustomer';
import { verifyAuth } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

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

        const customer = await HappyCustomer.findById(id);
        if (!customer) {
            return NextResponse.json({
                success: false,
                message: 'Happy customer record not found'
            }, { status: 404 });
        }

        // Delete image from Cloudinary if it's stored there
        if (customer.imageUrl && customer.imageUrl.includes('cloudinary.com')) {
            await deleteFromCloudinary(customer.imageUrl);
        }

        // Delete from MongoDB
        await HappyCustomer.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Happy customer testimonial deleted successfully'
        });

    } catch (error: any) {
        console.error('Delete happy customer error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
