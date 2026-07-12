import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { fetchVehicleDetails } from '@/lib/vehicleLookup';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ regNo: string }> }
) {
    try {
        const currentUser = await verifyAuth(req);
        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'No authentication token, access denied'
            }, { status: 401 });
        }

        const { regNo } = await context.params;
        const formattedRegNo = regNo.toUpperCase().replace(/\s+/g, '');

        if (!formattedRegNo) {
            return NextResponse.json({
                success: false,
                message: 'Registration number is required'
            }, { status: 400 });
        }

        const vehicleDetails = await fetchVehicleDetails(formattedRegNo);

        if (!vehicleDetails) {
            return NextResponse.json({
                success: false,
                message: 'Vehicle details not found for this registration number'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                regNo: formattedRegNo,
                ...vehicleDetails
            }
        });
    } catch (error: any) {
        console.error('Error looking up vehicle:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
