import {initialState, user} from "../../reducers/user";
import {userActions} from "../../actions/actions.types";

describe("testing user reducer", () => {
    it("set login", async () => {
        const state = user({...initialState, isLogin: false}, {type: userActions.LOGIN});
        const expectedState = {...initialState, isLogin: true};
        expect(state).toStrictEqual(expectedState);
    });
    it("set logout", async () => {
        const categories = [
            {id: 'id', name: 'japanese', columns: ["japanese", "kanji", "german"], owner: 'mike miller'},
            {id: 'id', name: 'english', columns: ["english", "german"], owner: 'mike miller'}
        ];
        const vocabularyLists = [
            {id: 'id', name: "A1", categoryId: 'catId'},
            {id: 'id', name: "A2", categoryId: 'catId'}
        ];
        const selectedCategory = {id: 'id', name: 'english', columns: ["english", "german"], owner: 'mike miller'};
        const state = user({
            ...initialState,
            isLogin: true,
            categories: categories,
            vocabularyLists: vocabularyLists,
            selectedCategory: selectedCategory
        }, {type: userActions.LOGOUT});
        const expectedState = {...initialState, isLogin: false};
        expect(state).toStrictEqual(expectedState);
    });
    it("store categories", async () => {
        const categories = [
            {id: 'id', name: 'japanese', columns: ["japanese", "kanji", "german"], owner: 'mike miller'},
            {id: 'id', name: 'english', columns: ["english", "german"], owner: 'mike miller'}
        ];
        const state = user(initialState, {type: userActions.STORE_CATEGORIES, payload: categories});
        const expectedState = {...initialState, categories: categories};
        expect(state).toStrictEqual(expectedState);
    });
    it("store vocabulary lists", async () => {
        const vocabularyLists = [
            {id: 'id', name: "A1", categoryId: 'catId'},
            {id: 'id', name: "A2", categoryId: 'catId'}
        ];
        const state = user(initialState, {type: userActions.STORE_VOCABULARY_LISTS, payload: vocabularyLists});
        const expectedState = {...initialState, vocabularyLists: vocabularyLists};
        expect(state).toStrictEqual(expectedState);
    });
    it("set selected category", async () => {
        const selectedCategory = {id: 'id', name: 'english', columns: ["english", "german"], owner: 'mike miller'};
        const state = user(initialState, {
            type: userActions.SET_SELECTED_CATEGORY,
            payload: selectedCategory
        });
        const expectedState = {...initialState, selectedCategory: selectedCategory};
        expect(state).toStrictEqual(expectedState);
    });
});