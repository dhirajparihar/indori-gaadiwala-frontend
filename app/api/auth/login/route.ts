import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { validators, handleValidationError } from '@/lib/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'gaadiwala-secret-key-2026-change-this-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        // Validate required fields
        validators.required(email, 'Email');
        validators.required(password, 'Password');

        // Validate email format
        validators.email(email);

        // Validate password length
        validators.password(password);

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Invalid credentials'
            }, { status: 401 });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json({
                success: false,
                message: 'Invalid credentials'
            }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE as any }
        );

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        });

        // Set HTTP-only cookie with token
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 // 24 hours in seconds
        });

        return response;
    } catch (error: unknown) {
        console.error('Login error:', error);
        
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
