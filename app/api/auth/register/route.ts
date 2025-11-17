import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Check if email is in admin list
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
        const isAdmin = adminEmails.includes(email.toLowerCase());

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            isAdmin,
        });

        return NextResponse.json({
            success: true,
            message: 'Registration successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}