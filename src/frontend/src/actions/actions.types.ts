export enum userActions {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    STORE_CATEGORIES = 'STORE_CATEGORIES',
    STORE_VOCABULARY_LISTS = 'STORE_VOCABULARY_LISTS',
    SET_SELECTED_CATEGORY = 'SET_SELECTED_CATEGORY'
}

export enum testActions {SET_TEST_DATA = 'SET_TEST_DATA'}

export type ReduxActionWithPayload<T, P> = {
    type: T;
    payload: P;
}

export type ReduxAction<T> = {
    type: T;
}