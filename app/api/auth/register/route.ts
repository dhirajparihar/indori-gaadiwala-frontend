import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const currentUser = await verifyAuth(req);

        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'No authentication token, access denied'
            }, { status: 401 });
        }

        if (currentUser.role !== 'superadmin') {
            return NextResponse.json({
                success: false,
                message: 'Only superadmin can create new admins'
            }, { status: 403 });
        }

        await dbConnect();
        const { email, password, name, role } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({
                success: false,
                message: 'Name, email and password are required'
            }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({
                success: false,
                message: 'Password must be at least 6 characters'
            }, { status: 400 });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({
                success: false,
                message: 'User already exists'
            }, { status: 400 });
        }

        // Create new user
        user = new User({
            email,
            password,
            name,
            role: role || 'admin'
        });

        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Admin created successfully',
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
