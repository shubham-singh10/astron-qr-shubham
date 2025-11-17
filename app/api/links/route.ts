import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Link from '@/lib/models/Link';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { uploadQRToS3 } from '@/lib/s3';

// GET - List all links (Admin only)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const links = await Link.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ links });
    } catch (error) {
        console.error('Get Links Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch links' },
            { status: 500 }
        );
    }
}

// POST - Create new dynamic QR
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { destinationUrl } = await req.json();
        console.log("Des: ", destinationUrl)
        if (!destinationUrl) {
            return NextResponse.json(
                { error: 'Destination URL is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Generate unique short code
        const shortCode = nanoid(8);

        // Build short URL
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const shortUrl = `${baseUrl}/q/${shortCode}`;

        // Generate QR code as buffer
        const qrBuffer = await QRCode.toBuffer(shortUrl, {
            width: 512,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });

        // Upload to S3
        const qrImageUrl = await uploadQRToS3(qrBuffer, `${shortCode}.png`);

        // Save to MongoDB
        const link = await Link.create({
            shortCode,
            destinationUrl,
            qrImageUrl,
        });

        return NextResponse.json({
            success: true,
            link: {
                shortCode: link.shortCode,
                shortUrl,
                destinationUrl: link.destinationUrl,
                qrImageUrl: link.qrImageUrl,
                createdAt: link.createdAt,
                updatedAt: link.updatedAt,
            },
        });
    } catch (error) {
        console.error('Create Link Error:', error);
        return NextResponse.json(
            { error: 'Failed to create link' },
            { status: 500 }
        );
    }
}
