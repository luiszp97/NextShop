import { FC, PropsWithChildren, useReducer } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
	isMenuOpen: boolean;
}

const INITIAL_STATE: UiState = {
	isMenuOpen: false
};

export const UiProvider: FC<PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(uiReducer, INITIAL_STATE);
	const toggleMenu = () => {
		dispatch({ type: 'Ui - ToggleMenu' });
	};
	return (
		<UiContext.Provider
			value={{
				...state,
				toggleMenu
			}}
		>
			{children}
		</UiContext.Provider>
	);
};
