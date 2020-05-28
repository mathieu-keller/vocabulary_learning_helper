import {ReduxAction, ReduxActionWithPayload, userActions} from "./actions.types";
import {Category} from "../containers/category/CategoryView";
import {VocabularyList} from "../containers/vocabulary/VocabularyListView";

export type UserActions = LoginAction |
    LogoutAction |
    StoreCategoriesAction |
    StoreVocabularyListsAction |
    SetSelectedCategoryAction |
    RemoveCategoryAction;

type LoginAction = ReduxAction<userActions.LOGIN>
type LogoutAction = ReduxAction<userActions.LOGOUT>
type StoreCategoriesAction = ReduxActionWithPayload<userActions.STORE_CATEGORIES, Category[]>
type StoreVocabularyListsAction = ReduxActionWithPayload<userActions.STORE_VOCABULARY_LISTS, VocabularyList[]>
type SetSelectedCategoryAction = ReduxActionWithPayload<userActions.SET_SELECTED_CATEGORY, Category>
type RemoveCategoryAction = ReduxActionWithPayload<userActions.REMOVE_CATEGORY, string>
export const userActionFunctions = {
    removeCategory: (id: string): RemoveCategoryAction => ({
        type: userActions.REMOVE_CATEGORY,
        payload: id
    }),
    setSelectedCategory: (category: Category): SetSelectedCategoryAction => ({
        type: userActions.SET_SELECTED_CATEGORY,
        payload: category
    }),
    storeVocabularyLists: (vocabularyLists: VocabularyList[]): StoreVocabularyListsAction => ({
        type: userActions.STORE_VOCABULARY_LISTS,
        payload: vocabularyLists
    }),
    storeCategories: (categories: Category[]): StoreCategoriesAction => ({
        type: userActions.STORE_CATEGORIES,
        payload: categories
    }),
    logout: (): LogoutAction => ({
        type: userActions.LOGOUT
    }),
    login: (): LoginAction => ({
        type: userActions.LOGIN
    })
};