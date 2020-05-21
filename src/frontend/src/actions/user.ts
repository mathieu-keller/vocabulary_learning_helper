import {ReduxAction, ReduxActionWithPayload, userActions} from "./actions.types";
import {Category} from "../containers/category/CategoryView";
import {VocabularyList} from "../containers/vocabulary/VocabularyListView";

export type UserActions = LoginAction |
    LogoutAction |
    StoreCategoriesAction |
    StoreVocabularyListsAction;

type LoginAction = ReduxAction<userActions.LOGIN>
export const login = (): LoginAction => ({
    type: userActions.LOGIN
});

type LogoutAction = ReduxAction<userActions.LOGOUT>
export const logout = (): LogoutAction => ({
    type: userActions.LOGOUT
});

type StoreCategoriesAction = ReduxActionWithPayload<userActions.STORE_CATEGORIES, Category[]>
export const storeCategories = (categories: Category[]): StoreCategoriesAction => ({
    type: userActions.STORE_CATEGORIES,
    payload: categories
});

type StoreVocabularyListsAction = ReduxActionWithPayload<userActions.STORE_VOCABULARY_LISTS, VocabularyList[]>
export const storeVocabularyLists = (vocabularyLists: VocabularyList[]): StoreVocabularyListsAction => ({
    type: userActions.STORE_VOCABULARY_LISTS,
    payload: vocabularyLists
});
