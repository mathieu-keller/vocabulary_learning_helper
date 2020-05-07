import {initStore, Store} from './store';

export type UserStore = {
    isLogin: boolean;
}

const configureUserStore = (): void => {
    const actions = {
        LOGIN: (currentStore: Store, isLogin: boolean): Store => {
            return {...currentStore, user: {isLogin}};
        }
    };
    initStore(actions, {user: {isLogin: false}});
};

export default configureUserStore;
