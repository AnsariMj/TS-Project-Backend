export interface OrderData {
    phoneNumber: string,
    shippingAddress: string,
    totalAmount: number,
    paymentDetails: {
        paymentMethod: PaymentMethod,
        paymentStatus?: Paymentstatus,
        pidx?: string,
    },
    items: OrderDetails[]
}

export interface OrderDetails {
    quantity: number,
    productId: string,
}

export enum PaymentMethod {
    Cod = 'cod',
    khalti = 'khalti',
}
enum Paymentstatus {
    Paid = 'paid',
    Unpaid = 'unpaid',
}

export interface khaltiResponse {
    pidx: string,
    payment_url: string,
    expires_at: Date | string,
    expires_in: number,
    user_fee: number,
}