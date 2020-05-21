import {userActions} from '../actions/actions.types';
import {AppStore, UserStore} from "../store/store.types";
import {UserActions} from "../actions/user";

const initialState: UserStore = {
    isLogin: false,
    categories: []
};

/*const getProduct = (state: Products, selectedProduct: Product): Product[] =>
    state.products.map((product: Product) =>
        (product.id === selectedProduct.id ? {...product, quantity: product.quantity - 1} : product));

 */

export const user = (state = initialState, action: UserActions): UserStore => {
    switch (action.type) {
        case userActions.LOGIN:
            return {
                ...state,
                isLogin: true
            };
        case userActions.LOGOUT:
            return {
                ...state,
                isLogin: false
            };
        case userActions.SAVE_CATEGORIES:
            return {...state, categories: action.payload};
        default:
            return {
                ...state
            };
    }
};