import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Lead from '@/lib/models/Lead';
import { verifyAuth } from '@/lib/auth';
import { validators, handleValidationError } from '@/lib/validation';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { name, phone, source } = await req.json();

        // Validate required fields
        validators.required(name, 'Name');
        validators.required(phone, 'Phone number');

        // Validate name length
        validators.name(name);

        // Validate phone number
        validators.phone(phone);

        // Check if lead with same phone already exists
        const existingLead = await Lead.findOne({ phone });

        if (existingLead) {
            // Update existing lead with new visit timestamp
            existingLead.updatedAt = new Date();
            await existingLead.save();
            return NextResponse.json({
                success: true,
                message: 'Lead already exists, updated timestamp',
                data: existingLead
            });
        }

        const lead = await Lead.create({
            name,
            phone,
            source: source || 'welcome_popup'
        });

        return NextResponse.json({
            success: true,
            message: 'Lead created successfully',
            data: lead
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating lead:', error);
        
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
        const leads = await Lead.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: leads.length,
            data: leads
        });
    } catch (error: any) {
        console.error('Error fetching leads:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
