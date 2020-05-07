import {initStore, Store} from './store';

export type UserStore = {
    isLogin: boolean;
}

const configureUserStore = (): void => {
    const actions = {
        LOGIN: (currentStore: Store): Store => {
            return {...currentStore, user: {isLogin: true}};
        },
        LOGOUT: (currentStore: Store): Store => {
            return {...currentStore, user: {isLogin: false}};
        }
    };
    initStore(actions, {user: {isLogin: false}});
};

export default configureUserStore;
