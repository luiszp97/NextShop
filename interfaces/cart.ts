import { ISize } from "./";

export interface ICartProduct {
    _id: string;
    image: string;
    price: number;
    inStock: number;
    size?: ISize;
    slug: string;
    title: string;
    gender: 'men' | 'women' | 'kid' | 'unisex';
    quantity: number;
}




