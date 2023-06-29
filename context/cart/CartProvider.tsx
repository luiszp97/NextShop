import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, IOrderItem, IProduct, ShippingAddress } from '@/interfaces';
import { shopApi } from '@/api';

export interface CartState {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subtotal: number;
	tax: number;
	total: number;
	shippingAddress?: ShippingAddress;
}

const INITIAL_STATE: CartState = {
	isLoaded: false,
	cart: [],
	numberOfItems: 0,
	subtotal: 0,
	tax: 0,
	total: 0,
	shippingAddress: undefined
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);

	const addProductToCart = (product: ICartProduct) => {
		const productInCart = state.cart.some((p) => p._id === product._id && p.size === product.size);
		if (!productInCart)
			return dispatch({ type: 'Cart - Add product ', payload: [...state.cart, product] });

		const updatedProduct = state.cart.map((item) => {
			if (item._id === product._id && item.size === product.size) {
				item.quantity += product.quantity;
				return item;
			}

			return item;
		});

		dispatch({ type: 'Cart - Add product ', payload: updatedProduct });
	};

	const removeProductToCart = (product: ICartProduct) => {
		const updatedCart = state.cart.filter(
			(item) => !(item._id === product._id && item.size === product.size)
		);
		dispatch({ type: 'Cart - Remove product ', payload: updatedCart });
	};

	const updateCartQuantity = (product: ICartProduct) => {
		dispatch({ type: 'Cart - Chage cart quantity ', payload: product });
	};

	const updateAddress = (address: ShippingAddress) => {
		Cookies.set('firstName', address.firstName);
		Cookies.set('lastName', address.lastName);
		Cookies.set('address', address.address);
		Cookies.set('address2', address.address2 || '');
		Cookies.set('zip', address.zip);
		Cookies.set('city', address.city);
		Cookies.set('country', address.country);
		Cookies.set('phone', address.phone);

		dispatch({ type: 'Cart - Update shipping Address', payload: address });
	};

	const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
		if (!state.shippingAddress) {
			throw new Error('No hay direccion de entrega');
		}

		const body: IOrder = {
			orderItems: state.cart.map((p) => ({
				...p,
				size: p.size!
			})),
			shippingAddress: state.shippingAddress,
			numberOfItems: state.numberOfItems,
			subtotal: state.subtotal,
			tax: state.tax,
			total: state.total,
			isPaid: false
		};
		try {
			const { data } = await shopApi.post('/orders', body);

			dispatch({ type: 'Cart - Order complete ' });

			return {
				hasError: false,
				message: data._id!
			};
		} catch (error) {
			console.log(error);

			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data.message
				};
			}

			return {
				hasError: true,
				message: 'Error no controlado'
			};
		}
	};

	/* LOAD ADDRESS FROM COOKIES */

	useEffect(() => {
		if (Cookies.get('firstName')) {
			const adress: ShippingAddress = {
				firstName: Cookies.get('firstName') || '',
				lastName: Cookies.get('lastName') || '',
				address: Cookies.get('address') || '',
				address2: Cookies.get('address2') || '',
				zip: Cookies.get('zip') || '',
				city: Cookies.get('city') || '',
				country: Cookies.get('country') || '',
				phone: Cookies.get('phone') || ''
			};
			dispatch({ type: 'Cart - LoadAddress from cookies | storage', payload: adress });
		}
	}, []);

	/* LOAD SHOPPING CART FROM COOKIES */

	useEffect(() => {
		try {
			const cookieProduct = Cookies.get('_c@rt_') ? JSON.parse(Cookies.get('_c@rt_')!) : [];
			dispatch({ type: 'Cart - LoadCart from cookies | storage', payload: cookieProduct });
		} catch (error) {
			dispatch({ type: 'Cart - LoadCart from cookies | storage', payload: [] });
		}
	}, []);

	/* SAVE SHOPPING CART IN COOKIES */

	useEffect(() => {
		Cookies.set('_c@rt_', JSON.stringify(state.cart));
	}, [state.cart]);

	/* CALCUATE PRICE IN ORDER  */

	useEffect(() => {
		const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
		const subtotal = state.cart.reduce(
			(prev, current) => current.price * current.quantity + prev,
			0
		);
		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

		const orderSumary = {
			numberOfItems,
			subtotal,
			tax: subtotal * taxRate,
			total: subtotal + subtotal * taxRate
		};

		dispatch({ type: 'Cart - Update order sumary ', payload: orderSumary });
	}, [state.cart]);

	return (
		<CartContext.Provider
			value={{
				...state,

				addProductToCart,
				updateAddress,
				updateCartQuantity,
				removeProductToCart,
				createOrder
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
