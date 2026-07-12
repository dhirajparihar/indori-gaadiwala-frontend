import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const currentUser = await verifyAuth(req);

        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'No authentication token, access denied'
            }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: currentUser._id,
                    email: currentUser.email,
                    name: currentUser.name,
                    role: currentUser.role
                }
            }
        });
    } catch (error: any) {
        console.error('Verify error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Server error'
        }, { status: 500 });
    }
}
