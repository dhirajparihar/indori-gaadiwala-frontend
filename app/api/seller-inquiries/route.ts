import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SellerInquiry from '@/lib/models/SellerInquiry';
import { verifyAuth } from '@/lib/auth';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';
import { fetchVehicleDetails } from '@/lib/vehicleLookup';
import { validators, handleValidationError } from '@/lib/validation';

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

        // Optional inspection fields
        const inspectionDate = formData.get('inspectionDate') as string;
        const inspectionTimeSlot = formData.get('inspectionTimeSlot') as string;
        const inspectionLocation = formData.get('inspectionLocation') as string;

        // Validate required fields
        validators.required(name, 'Name');
        validators.required(phone, 'Phone number');
        validators.required(regNo, 'Registration number');
        validators.required(kmDriven, 'KM driven');
        validators.required(demand, 'Expected price');

        const formattedRegNo = regNo.toUpperCase().replace(/\s+/g, '');

        // Validate name length
        validators.name(name);

        // Validate phone number
        validators.phone(phone);

        // Validate registration number
        validators.regNo(formattedRegNo);

        // Validate kmDriven
        if (kmDriven !== undefined) {
            validators.kmDriven(kmDriven);
        }

        // Validate demand (price range)
        if (demand !== undefined) {
            validators.price(demand, 1000, 10000000);
        }

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

        const inquiryData: any = {
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

        if (inspectionDate) {
            inquiryData.inspectionDate = new Date(inspectionDate);
            inquiryData.inspectionTimeSlot = inspectionTimeSlot || '';
            inquiryData.inspectionLocation = inspectionLocation || '';
            inquiryData.status = 'inspection_scheduled';
        }

        const inquiry = await SellerInquiry.create(inquiryData);

        return NextResponse.json({
            success: true,
            message: 'Seller inquiry submitted successfully',
            data: inquiry,
            vehicleDetailsFound: !!vehicleDetails
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating seller inquiry:', error);
        
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
