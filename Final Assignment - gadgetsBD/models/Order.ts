import mongoose, { Schema, model, models } from 'mongoose';

interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    shopId: mongoose.Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

interface IDeliveryAddress {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
}

interface IPaymentInfo {
    cardNumber: string;
    cardHolder: string;
    method: string;
}

export interface IOrder {
    _id: string;
    orderNumber: string;
    customerId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    deliveryAddress: IDeliveryAddress;
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    totalAmount: number;
    paymentInfo: IPaymentInfo;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    invoiceUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
});

const DeliveryAddressSchema = new Schema<IDeliveryAddress>({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
});

const PaymentInfoSchema = new Schema<IPaymentInfo>({
    cardNumber: { type: String, required: true },
    cardHolder: { type: String, required: true },
    method: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
    {
        orderNumber: { type: String, required: true, unique: true },
        customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [OrderItemSchema],
        deliveryAddress: { type: DeliveryAddressSchema, required: true },
        subtotal: { type: Number, required: true },
        deliveryFee: { type: Number, required: true },
        serviceFee: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        paymentInfo: { type: PaymentInfoSchema, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        invoiceUrl: { type: String },
    },
    { timestamps: true }
);

// Index for customer orders
OrderSchema.index({ customerId: 1, createdAt: -1 });
// Index for shop owner orders
OrderSchema.index({ 'items.shopId': 1, createdAt: -1 });

export const Order = models.Order || model<IOrder>('Order', OrderSchema);
