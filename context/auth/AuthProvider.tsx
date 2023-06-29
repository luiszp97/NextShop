import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext, authReducer } from './';
import { Iuser } from '@/interfaces';
import { shopApi } from '@/api';

export interface AuthState {
	isLoggedIn: boolean;
	user?: Iuser;
}

interface Return {
	hasError: boolean;
	message?: string;
}

const INITIAL_STATE: AuthState = {
	isLoggedIn: false,
	user: undefined
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

	const { data, status } = useSession();

	// useEffect(() => {
	// 	checkToken();
	// }, []);

	// const checkToken = async () => {
	// 	if (!Cookies.get('T0ken')) return;
	// 	try {
	// 		const { data } = await shopApi.get('/user/validate-token');
	// 		const { user, token } = data;

	// 		Cookies.set('T0ken', token);

	// 		dispatch({ type: 'Auth - Login', payload: user });
	// 	} catch (error) {
	// 		Cookies.remove('T0ken');
	// 	}
	// };

	useEffect(() => {
		if (status === 'authenticated') {
			const { user } = data;

			const newUser: Iuser = {
				name: user.name!,
				email: user.email!,
				_id: user._id!,
				role: user.role!
			};

			dispatch({ type: 'Auth - Login', payload: newUser });
		}
	}, [status, data]);

	const registerUser = async (name: string, email: string, password: string): Promise<Return> => {
		try {
			const { data } = await shopApi.post('/user/register', { email, password, name });
			const { token, user } = data;
			Cookies.set('T0ken', token);

			dispatch({ type: 'Auth - Login', payload: user });
			return {
				hasError: false
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data.message
				};
			}

			return {
				hasError: true,
				message: 'No se pudo crear el usuario - intente de nuevo'
			};
		}
	};

	const loginUser = async (email: string, password: string): Promise<boolean> => {
		try {
			const { data } = await shopApi.post('/user/login', { email, password });
			const { token, user } = data;
			Cookies.set('T0ken', token);

			dispatch({ type: 'Auth - Login', payload: user });
			return true;
		} catch (error) {
			return false;
		}
	};

	const logoutUser = () => {
		// Cookies.remove('T0ken');
		Cookies.remove('_c@rt_');
		Cookies.remove('firstName');
		Cookies.remove('lastName');
		Cookies.remove('address');
		Cookies.remove('address2');
		Cookies.remove('zip');
		Cookies.remove('city');
		Cookies.remove('country');
		Cookies.remove('phone');
		dispatch({ type: 'Auth - Logout' });
		signOut();
	};

	return (
		<AuthContext.Provider
			value={{
				...state,
				loginUser,
				registerUser,
				logoutUser
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
