import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { verifyAuth } from '@/lib/auth';
import { validators, handleValidationError } from '@/lib/validation';

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

        // Validate required fields
        validators.required(email, 'Email');
        validators.required(password, 'Password');
        validators.required(name, 'Name');

        // Validate email format
        validators.email(email);

        // Validate name length
        validators.name(name);

        // Validate password length
        validators.password(password);

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
    } catch (error: unknown) {
        console.error('Register error:', error);
        
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
