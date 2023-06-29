import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '@/interfaces';

interface ContextProps {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subtotal: number;
	tax: number;
	total: number;
	shippingAddress?: ShippingAddress;
	addProductToCart: (Product: ICartProduct) => void;
	updateAddress: (adress: ShippingAddress) => void;
	updateCartQuantity: (product: ICartProduct) => void;
	removeProductToCart: (product: ICartProduct) => void;
	createOrder: () => Promise<{ hasError: boolean; message: string }>;
}

export const CartContext = createContext({} as ContextProps);
