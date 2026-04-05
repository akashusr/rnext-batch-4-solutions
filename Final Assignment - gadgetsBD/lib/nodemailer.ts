import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server error:', error);
    return false;
  }
}

// Send password reset email
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  userName: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Gadgets BD" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset Request - Gadgets BD',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #232F3E, #37475A); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 30px; background: #FF9900; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Gadgets BD</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hi ${userName},</p>
              <p>We received a request to reset your password for your Gadgets BD account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066c0;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p>Thanks,<br>The Gadgets BD Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Gadgets BD. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error };
  }
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(
  to: string,
  orderDetails: {
    orderId: string;
    customerName: string;
    items: Array<{ title: string; quantity: number; price: number }>;
    totalAmount: number;
    deliveryAddress: string;
  }
) {
  const itemsHtml = orderDetails.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">৳${item.price.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const mailOptions = {
    from: `"Gadgets BD" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Order Confirmation #${orderDetails.orderId} - Gadgets BD`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #232F3E, #37475A); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .total { font-size: 18px; font-weight: bold; color: #B12704; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Gadgets BD</h1>
              <p>Order Confirmation</p>
            </div>
            <div class="content">
              <h2>Thank you for your order!</h2>
              <p>Hi ${orderDetails.customerName},</p>
              <p>Your order has been confirmed and will be delivered soon.</p>
              
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              
              <table class="order-table">
                <thead>
                  <tr style="background: #f0f0f0;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <p class="total">Total Amount: ৳${orderDetails.totalAmount.toLocaleString()}</p>
              
              <h3>Delivery Address</h3>
              <p>${orderDetails.deliveryAddress}</p>
              
              <p>You can track your order status in your account dashboard.</p>
              <p>Thanks for shopping with us!</p>
              <p>The Gadgets BD Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Gadgets BD. All rights reserved.</p>
              <p>Need help? Contact us at support@gadgetsbd.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

// Send welcome email
export async function sendWelcomeEmail(to: string, userName: string) {
  const mailOptions = {
    from: `"Gadgets BD" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Welcome to Gadgets BD!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #232F3E, #37475A); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 30px; background: #FF9900; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Gadgets BD!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName}! 👋</h2>
              <p>Thank you for joining Gadgets BD - Bangladesh's premier tech marketplace!</p>
              <p>We're excited to have you on board. Here's what you can do:</p>
              <ul>
                <li>Browse thousands of authentic tech products</li>
                <li>Get fast delivery across Bangladesh</li>
                <li>Enjoy secure payment options</li>
                <li>Track your orders in real-time</li>
              </ul>
              <a href="${process.env.NEXTAUTH_URL}/products" class="button">Start Shopping</a>
              <p>If you have any questions, our support team is here to help!</p>
              <p>Happy Shopping!<br>The Gadgets BD Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Gadgets BD. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error };
  }
}

// Send order invoice email with PDF attachment
export async function sendOrderInvoiceEmail(
  to: string,
  customerName: string,
  order: any
) {
  // Generate PDF invoice inline
  const PDFDocument = (await import('pdfkit')).default;

  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
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

    doc.fontSize(18).font('Helvetica-Bold').text('INVOICE', { align: 'right' });
    doc.moveDown(0.5);

    const orderDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
      : '';

    doc.fontSize(10).font('Helvetica');
    doc.text(`Order Number: #${order.orderNumber}`);
    doc.text(`Date: ${orderDate}`);
    doc.moveDown(1);

    // Delivery address
    if (order.deliveryAddress) {
      doc.font('Helvetica-Bold').text('Delivery Address:');
      doc.font('Helvetica');
      doc.text(order.deliveryAddress.name || '');
      doc.text(order.deliveryAddress.address || '');
      doc.text(`${order.deliveryAddress.city || ''}${order.deliveryAddress.postalCode ? ', ' + order.deliveryAddress.postalCode : ''}`);
      doc.moveDown(1);
    }

    // Items
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

    doc.fontSize(10);
    doc.text(`Subtotal: BDT ${order.subtotal?.toLocaleString()}`, { align: 'right' });
    doc.text(`Delivery Fee: ${order.deliveryFee === 0 ? 'FREE' : 'BDT ' + order.deliveryFee?.toLocaleString()}`, { align: 'right' });
    doc.text(`Service Fee: BDT ${order.serviceFee?.toLocaleString()}`, { align: 'right' });
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text(`Total: BDT ${order.totalAmount?.toLocaleString()}`, { align: 'right' });

    doc.moveDown(2);
    doc.fontSize(8).font('Helvetica').fillColor('#666');
    doc.text('Thank you for shopping with Gadgets BD!', { align: 'center' });

    doc.end();
  });

  const mailOptions = {
    from: `"Gadgets BD" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Invoice for Order #${order.orderNumber} - Gadgets BD`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #232F3E, #37475A); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 30px; background: #FF9900; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Gadgets BD</h1>
              <p>Order Confirmation & Invoice</p>
            </div>
            <div class="content">
              <h2>Thank you for your order, ${customerName}!</h2>
              <p>Your order <strong>#${order.orderNumber}</strong> has been placed successfully.</p>
              <p><strong>Total Amount:</strong> ৳${order.totalAmount?.toLocaleString()}</p>
              <p>Please find your invoice attached to this email as a PDF.</p>
              <p>You can track your order status in your account dashboard.</p>
              <a href="${process.env.NEXTAUTH_URL}/orders" class="button">View My Orders</a>
              <p>Thanks for shopping with us!<br>The Gadgets BD Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Gadgets BD. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    attachments: [
      {
        filename: `invoice-${order.orderNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invoice email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending invoice email:', error);
    return { success: false, error };
  }
}

// Send order status update email
export async function sendOrderStatusEmail(
  to: string,
  orderDetails: {
    orderNumber: string;
    customerName: string;
    newStatus: string;
    totalAmount: number;
  }
) {
  const statusMessages: Record<string, { emoji: string; title: string; message: string; color: string }> = {
    confirmed: {
      emoji: '✅',
      title: 'Order Confirmed',
      message: 'Great news! Your order has been confirmed by the seller and is being prepared.',
      color: '#2E7D32',
    },
    shipped: {
      emoji: '🚚',
      title: 'Order Shipped',
      message: 'Your order is on its way! It has been handed over to our delivery partner.',
      color: '#1565C0',
    },
    delivered: {
      emoji: '📦',
      title: 'Order Delivered',
      message: 'Your order has been delivered successfully. We hope you love your purchase!',
      color: '#2E7D32',
    },
    cancelled: {
      emoji: '❌',
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. If you have any questions, please contact support.',
      color: '#C62828',
    },
  };

  const info = statusMessages[orderDetails.newStatus] || {
    emoji: '📋',
    title: 'Order Update',
    message: `Your order status has been updated to: ${orderDetails.newStatus}`,
    color: '#FF9900',
  };

  const mailOptions = {
    from: `"Gadgets BD" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `${info.emoji} ${info.title} - Order #${orderDetails.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #232F3E, #37475A); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .status-badge { display: inline-block; padding: 8px 20px; background: ${info.color}; color: white; border-radius: 4px; font-weight: bold; font-size: 16px; }
            .button { display: inline-block; padding: 12px 30px; background: #FF9900; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Gadgets BD</h1>
              <p>Order Status Update</p>
            </div>
            <div class="content">
              <h2>Hi ${orderDetails.customerName},</h2>
              <p style="text-align: center;">
                <span class="status-badge">${info.emoji} ${info.title}</span>
              </p>
              <p>${info.message}</p>
              <p><strong>Order Number:</strong> #${orderDetails.orderNumber}</p>
              <p><strong>Total Amount:</strong> ৳${orderDetails.totalAmount?.toLocaleString()}</p>
              <a href="${process.env.NEXTAUTH_URL}/orders" class="button">View My Orders</a>
              <p>Thanks for shopping with us!<br>The Gadgets BD Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Gadgets BD. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order status email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending order status email:', error);
    return { success: false, error };
  }
}

