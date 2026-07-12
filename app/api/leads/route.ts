import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Lead from '@/lib/models/Lead';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { name, phone, source } = await req.json();

        if (!name || !phone) {
            return NextResponse.json({
                success: false,
                message: 'Name and phone number are required'
            }, { status: 400 });
        }

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
    } catch (error: any) {
        console.error('Error creating lead:', error);
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
