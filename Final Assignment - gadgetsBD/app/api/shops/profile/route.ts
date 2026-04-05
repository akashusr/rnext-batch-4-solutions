import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Shop } from '@/models/Shop';
import { User } from '@/models/User';

// GET /api/shops/profile - Get the current shop owner's shop
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.userType !== 'shopOwner') {
            return NextResponse.json(
                { error: 'Unauthorized. Shop owners only.' },
                { status: 401 }
            );
        }

        await connectDB();

        const shop = await Shop.findOne({ ownerId: session.user.id }).lean();

        if (!shop) {
            return NextResponse.json(
                { error: 'Shop not found' },
                { status: 404 }
            );
        }

        // Also get owner info
        const owner = await User.findById(session.user.id).select('name email mobile').lean();

        return NextResponse.json({ shop, owner });
    } catch (error) {
        console.error('Error fetching shop profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shop profile' },
            { status: 500 }
        );
    }
}

// PUT /api/shops/profile - Update shop profile
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.userType !== 'shopOwner') {
            return NextResponse.json(
                { error: 'Unauthorized. Shop owners only.' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            shopName,
            description,
            address,
            phone,
            city,
            specialization,
            yearEstablished,
            employees,
            brandPartnerships,
            website,
            banner,
        } = body;

        if (!shopName) {
            return NextResponse.json(
                { error: 'Shop name is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Build update object, handling optional fields properly
        const updateFields: Record<string, any> = {
            shopName,
            description: description || '',
            address: address || '',
            phone: phone || '',
            city: city || '',
            specialization: specialization || '',
            brandPartnerships: brandPartnerships || '',
            website: website || '',
        };

        // Handle optional number fields - set or unset
        if (yearEstablished) {
            updateFields.yearEstablished = Number(yearEstablished);
        }
        if (employees) {
            updateFields.employees = Number(employees);
        }
        if (banner !== undefined) {
            updateFields.banner = banner;
        }

        // Build $unset for cleared optional fields
        const unsetFields: Record<string, any> = {};
        if (!yearEstablished) unsetFields.yearEstablished = '';
        if (!employees) unsetFields.employees = '';

        const updateQuery: Record<string, any> = { $set: updateFields };
        if (Object.keys(unsetFields).length > 0) {
            updateQuery.$unset = unsetFields;
        }

        const shop = await Shop.findOneAndUpdate(
            { ownerId: session.user.id },
            updateQuery,
            { new: true }
        );

        if (!shop) {
            return NextResponse.json(
                { error: 'Shop not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Shop profile updated successfully', shop });
    } catch (error) {
        console.error('Error updating shop profile:', error);
        return NextResponse.json(
            { error: 'Failed to update shop profile' },
            { status: 500 }
        );
    }
}
