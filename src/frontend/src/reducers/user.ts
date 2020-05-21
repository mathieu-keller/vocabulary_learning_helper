import {userActions} from '../actions/actions.types';
import {UserStore} from "../store/store.types";
import {UserActions} from "../actions/user";

const initialState: UserStore = {
    isLogin: false,
    categories: [],
    vocabularyLists: []
};

export const user = (state = initialState, action: UserActions): UserStore => {
    switch (action.type) {
        case userActions.LOGIN:
            return {...state, isLogin: true};
        case userActions.LOGOUT:
            return {...state, isLogin: false};
        case userActions.STORE_CATEGORIES:
            return {...state, categories: action.payload};
        case userActions.STORE_VOCABULARY_LISTS:
            return {...state, vocabularyLists: action.payload};
        default:
            return state;
    }
};