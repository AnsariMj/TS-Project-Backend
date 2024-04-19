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


export interface TransactionVerificationResponse {
    pidx: string,
    total_amount: number,
    status: TransactionStatus,
    transaction_id: string,
    fee: number,
    refunded: boolean

}
export enum TransactionStatus {
    Completed = 'Completed',
    Refunded = 'Refunded',
    Pending = 'Pending',
    Initiated = 'Initiated',

}

export enum OrderStatus {
    Pending = "pending",
    cancelled = "cancelled",
    OntheWay = "ontheway",
    Delivered = "delivered",
    Prepration = "prepration"
}