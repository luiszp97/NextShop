import { ISize } from "./products";
import { Iuser } from "./user";

export interface IOrder {
    _id?: string;
    user?: Iuser | string;
    orderItems: IOrderItem[];
    shippingAddress: ShippingAddress;
    paymentResult?: string;

    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;

    isPaid: boolean;
    paiAt?: string;
    transactionId?: string;

}

export interface IOrderItem {
    _id: string;
    title: string;
    size: ISize;
    quantity: number;
    slug: string;
    image: string;
    price: number;
    gender: string;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}