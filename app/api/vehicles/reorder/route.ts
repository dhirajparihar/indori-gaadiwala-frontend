import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vehicle from '@/lib/models/Vehicle';
import { verifyAuth } from '@/lib/auth';

export async function PUT(req: NextRequest) {
    try {
        const currentUser = await verifyAuth(req);
        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'No authentication token, access denied'
            }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const items: { id: string; displayOrder: number }[] = body.items || body.orders || (Array.isArray(body) ? body : []);

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Invalid input format. Expected an array of items with id and displayOrder.'
            }, { status: 400 });
        }

        const bulkOps = items.map((item) => ({
            updateOne: {
                filter: { _id: item.id },
                update: { $set: { displayOrder: Number(item.displayOrder) } }
            }
        }));

        await Vehicle.bulkWrite(bulkOps);

        return NextResponse.json({
            success: true,
            message: 'Vehicle order updated successfully'
        });
    } catch (error: any) {
        console.error('Reorder vehicles error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
