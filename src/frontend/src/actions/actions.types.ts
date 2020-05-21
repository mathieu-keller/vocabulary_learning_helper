export enum userActions {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    SAVE_CATEGORIES = 'SAVE_CATEGORIES',
}

export enum testActions {SET_TEST_DATA = 'SET_TEST_DATA'};

export type ReduxActionWithPayload<T, P> = {
    type: T;
    payload: P;
}

export type ReduxAction<T> = {
    type: T;
}