import { ICartProduct, ShippingAddress } from '@/interfaces';
import { CartState } from './CartProvider';


type CartActionType =
    | { type: 'Cart - LoadCart from cookies | storage', payload: ICartProduct[]; }
    | { type: 'Cart - LoadAddress from cookies | storage', payload: ShippingAddress; }
    | { type: 'Cart - Add product ', payload: ICartProduct[]; }
    | { type: 'Cart - Remove product ', payload: ICartProduct[]; }
    | { type: 'Cart - Chage cart quantity ', payload: ICartProduct; }
    | { type: 'Cart - Order complete '; }
    | {
        type: 'Cart - Update order sumary ', payload: {
            numberOfItems: number;
            subtotal: number,
            tax: number;
            total: number;
        };

    }
    | { type: 'Cart - Update shipping Address', payload: ShippingAddress; };


export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        case 'Cart - LoadCart from cookies | storage':

            return {
                ...state,
                cart: action.payload,
                isLoaded: true
            };
        case 'Cart - LoadAddress from cookies | storage':
        case 'Cart - Update shipping Address':

            return {
                ...state,
                shippingAddress: action.payload
            };
        case 'Cart - Add product ':
            return {
                ...state,
                cart: [...action.payload]
            };
        case 'Cart - Remove product ':
            return {
                ...state,
                cart: [...action.payload]
            };
        case 'Cart - Chage cart quantity ':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;

                    return action.payload;
                })
            };
        case 'Cart - Update order sumary ':
            return {
                ...state,
                ...action.payload
            };
        case 'Cart - Order complete ':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                tax: 0,
                subtotal: 0,
                total: 0

            };

        default:
            return state;
    }

};