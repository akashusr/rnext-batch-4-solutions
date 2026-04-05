import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PDFDocument from 'pdfkit';

// GET /api/orders/[id]/invoice - Generate PDF invoice
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const order = await Order.findById(params.id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check authorization
        if (
            session.user.userType === 'customer' &&
            order.customerId.toString() !== session.user.id
        ) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Generate PDF
        const pdfBuffer = await generateInvoicePDF(order);

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error generating invoice:', error);
        return NextResponse.json(
            { error: 'Failed to generate invoice' },
            { status: 500 }
        );
    }
}

async function generateInvoicePDF(order: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text('Gadgets BD', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text('Premium Tech Marketplace', { align: 'center' });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#FF9900');
        doc.moveDown(1);

        // Invoice title
        doc.fontSize(18).font('Helvetica-Bold').text('INVOICE', { align: 'right' });
        doc.moveDown(0.5);

        // Order info
        doc.fontSize(10).font('Helvetica');
        const orderDate = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            : '';

        doc.text(`Order Number: #${order.orderNumber}`);
        doc.text(`Date: ${orderDate}`);
        doc.text(`Status: ${order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}`);
        doc.moveDown(1);

        // Delivery address
        if (order.deliveryAddress) {
            doc.font('Helvetica-Bold').text('Delivery Address:');
            doc.font('Helvetica');
            doc.text(order.deliveryAddress.name || '');
            doc.text(order.deliveryAddress.address || '');
            doc.text(`${order.deliveryAddress.city || ''}${order.deliveryAddress.postalCode ? ', ' + order.deliveryAddress.postalCode : ''}`);
            if (order.deliveryAddress.phone) doc.text(`Phone: ${order.deliveryAddress.phone}`);
            doc.moveDown(1);
        }

        // Items table header
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ddd');
        doc.moveDown(0.3);

        const tableTop = doc.y;
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('Product', 50, tableTop, { width: 250 });
        doc.text('Qty', 320, tableTop, { width: 50, align: 'center' });
        doc.text('Price', 380, tableTop, { width: 80, align: 'right' });
        doc.text('Total', 470, tableTop, { width: 75, align: 'right' });
        doc.moveDown(0.5);

        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ddd');
        doc.moveDown(0.3);

        // Items
        doc.font('Helvetica').fontSize(9);
        for (const item of order.items) {
            const y = doc.y;
            doc.text(item.title || 'Product', 50, y, { width: 250 });
            doc.text(String(item.quantity), 320, y, { width: 50, align: 'center' });
            doc.text(`BDT ${item.price?.toLocaleString()}`, 380, y, { width: 80, align: 'right' });
            doc.text(`BDT ${(item.price * item.quantity)?.toLocaleString()}`, 470, y, { width: 75, align: 'right' });
            doc.moveDown(0.8);
        }

        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ddd');
        doc.moveDown(0.5);

        // Totals
        const totalsX = 380;
        doc.fontSize(10);
        doc.text('Subtotal:', totalsX, doc.y, { width: 80, continued: false });
        doc.text(`BDT ${order.subtotal?.toLocaleString()}`, 470, doc.y - 12, { width: 75, align: 'right' });

        doc.text('Delivery Fee:', totalsX, doc.y, { width: 80 });
        doc.text(order.deliveryFee === 0 ? 'FREE' : `BDT ${order.deliveryFee?.toLocaleString()}`, 470, doc.y - 12, { width: 75, align: 'right' });

        doc.text('Service Fee:', totalsX, doc.y, { width: 80 });
        doc.text(`BDT ${order.serviceFee?.toLocaleString()}`, 470, doc.y - 12, { width: 75, align: 'right' });

        doc.moveDown(0.3);
        doc.moveTo(380, doc.y).lineTo(545, doc.y).stroke('#FF9900');
        doc.moveDown(0.3);

        doc.font('Helvetica-Bold').fontSize(12);
        doc.text('Total:', totalsX, doc.y, { width: 80 });
        doc.text(`BDT ${order.totalAmount?.toLocaleString()}`, 470, doc.y - 14, { width: 75, align: 'right' });

        // Payment info
        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica-Bold').text('Payment Information:');
        doc.font('Helvetica').fontSize(9);
        doc.text(`Method: ${order.paymentInfo?.method || 'Credit Card'}`);
        if (order.paymentInfo?.cardNumber) {
            doc.text(`Card: **** **** **** ${order.paymentInfo.cardNumber}`);
        }

        // Footer
        doc.moveDown(2);
        doc.fontSize(8).fillColor('#666').text('Thank you for shopping with Gadgets BD!', { align: 'center' });
        doc.text('© 2026 Gadgets BD - Premium Tech Marketplace. All rights reserved.', { align: 'center' });

        doc.end();
    });
}

// Note: To reuse generateInvoicePDF in email, import the logic directly
// Next.js route files cannot export non-HTTP-method symbols
