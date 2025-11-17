import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Link from '@/lib/models/Link';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await context.params
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const link = await Link.findOne({ shortCode: code });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json({ link });
    } catch (error) {
        console.error('Get Link Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch link' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await context.params
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { destinationUrl } = await req.json();

        if (!destinationUrl) {
            return NextResponse.json(
                { error: 'Destination URL is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const link = await Link.findOneAndUpdate(
            { shortCode: code },
            {
                destinationUrl,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            link,
        });
    } catch (error) {
        console.error('Update Link Error:', error);
        return NextResponse.json(
            { error: 'Failed to update link' },
            { status: 500 }
        );
    }
}