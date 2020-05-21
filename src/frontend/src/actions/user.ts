import {ReduxAction, ReduxActionWithPayload, userActions} from "./actions.types";
import {Category} from "../containers/category/CategoryView";

export type UserActions = LoginAction | LogoutAction | SaveCategoriesAction;

type LoginAction = ReduxAction<userActions.LOGIN>
export const login = (): LoginAction => ({
    type: userActions.LOGIN
});

type LogoutAction = ReduxAction<userActions.LOGOUT>
export const logout = (): LogoutAction => ({
    type: userActions.LOGOUT
});

type SaveCategoriesAction = ReduxActionWithPayload<userActions.SAVE_CATEGORIES, Category[]>
export const saveCategories = (categories: Category[]): SaveCategoriesAction => ({
    type: userActions.SAVE_CATEGORIES,
    payload: categories
});
