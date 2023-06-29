import { UiState } from './UiProvider';


type uiActionType =
    | { type: 'Ui - ToggleMenu'; };


export const uiReducer = (state: UiState, action: uiActionType): UiState => {

    switch (action.type) {
        case 'Ui - ToggleMenu':

            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            };

        default:
            return state;
    }

};