import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SellerInquiry from '@/lib/models/SellerInquiry';
import { verifyAuth } from '@/lib/auth';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';
import { fetchVehicleDetails } from '@/lib/vehicleLookup';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const formData = await req.formData();

        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const regNo = formData.get('regNo') as string;
        const kmDriven = formData.get('kmDriven') ? Number(formData.get('kmDriven')) : undefined;
        const demand = formData.get('demand') ? Number(formData.get('demand')) : undefined;
        const type = (formData.get('type') as string) || 'car';

        if (!name || !phone || !regNo || kmDriven === undefined || demand === undefined) {
            return NextResponse.json({
                success: false,
                message: 'Name, phone, registration number, KM driven, and demand are required'
            }, { status: 400 });
        }

        const formattedRegNo = regNo.toUpperCase().replace(/\s+/g, '');

        // Upload photos
        const photoUrls: string[] = [];
        const photoFiles = formData.getAll('photo') as File[];
        for (const file of photoFiles) {
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const url = await uploadBufferToCloudinary(buffer, 'gaadiwala/seller-inquiries');
                photoUrls.push(url);
            }
        }

        // Upload RC Card
        let rcCardUrl = '';
        const rcCardFile = formData.get('rcCard') as File;
        if (rcCardFile && rcCardFile.size > 0) {
            const buffer = Buffer.from(await rcCardFile.arrayBuffer());
            rcCardUrl = await uploadBufferToCloudinary(buffer, 'gaadiwala/seller-inquiries');
        }

        // Fetch vehicle details from Cars24 lookup API
        const vehicleDetails = await fetchVehicleDetails(formattedRegNo);

        const inquiryData = {
            name,
            phone,
            regNo: formattedRegNo,
            kmDriven,
            demand,
            type,
            photos: photoUrls,
            rcCard: rcCardUrl,
            ...(vehicleDetails || {})
        };

        const inquiry = await SellerInquiry.create(inquiryData);

        return NextResponse.json({
            success: true,
            message: 'Seller inquiry submitted successfully',
            data: inquiry,
            vehicleDetailsFound: !!vehicleDetails
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating seller inquiry:', error);
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
        const inquiries = await SellerInquiry.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error: any) {
        console.error('Error fetching seller inquiries:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
