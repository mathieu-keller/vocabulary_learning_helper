import {initialState, user} from "../../reducers/user";
import {userActionFunctions} from "../../actions/user";

describe("testing user reducer", () => {
    it("set login", async () => {
        const state = user({...initialState, isLogin: false}, userActionFunctions.login());
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
        }, userActionFunctions.logout());
        const expectedState = {...initialState, isLogin: false};
        expect(state).toStrictEqual(expectedState);
    });
    it("store categories", async () => {
        const categories = [
            {id: 'id', name: 'japanese', columns: ["japanese", "kanji", "german"], owner: 'mike miller'},
            {id: 'id', name: 'english', columns: ["english", "german"], owner: 'mike miller'}
        ];
        const state = user(initialState, userActionFunctions.storeCategories(categories));
        const expectedState = {...initialState, categories: categories};
        expect(state).toStrictEqual(expectedState);
    });
    it("store vocabulary lists", async () => {
        const vocabularyLists = [
            {id: 'id', name: "A1", categoryId: 'catId'},
            {id: 'id', name: "A2", categoryId: 'catId'}
        ];
        const state = user(initialState, userActionFunctions.storeVocabularyLists(vocabularyLists));
        const expectedState = {...initialState, vocabularyLists: vocabularyLists};
        expect(state).toStrictEqual(expectedState);
    });
    it("set selected category", async () => {
        const selectedCategory = {id: 'id', name: 'english', columns: ["english", "german"], owner: 'mike miller'};
        const state = user(initialState, userActionFunctions.setSelectedCategory(selectedCategory));
        const expectedState = {...initialState, selectedCategory: selectedCategory};
        expect(state).toStrictEqual(expectedState);
    });
    it("remove selected category", async () => {
        const selectedCategory = {id: '123', name: 'english', columns: ["english", "german"], owner: 'mike miller'};
        const state = user({
            ...initialState, selectedCategory, categories: [selectedCategory], vocabularyLists: [
                {id: '1', name: "A1", categoryId: '123'},
                {id: '2', name: "A2", categoryId: '123'},
                {id: '3', name: "A3", categoryId: '456'}]
        }, userActionFunctions.removeCategory('123'));
        const expectedState = {...initialState, vocabularyLists: [{id: '3', name: "A3", categoryId: '456'}]};
        expect(state).toStrictEqual(expectedState);
    });
    it("remove not selected category", async () => {
        const selectedCategory = {id: '456', name: 'english', columns: ["english", "german"], owner: 'mike miller'};
        const state = user({
            ...initialState,
            selectedCategory,
            categories: [selectedCategory, {id: '123', name: 'german', columns: ["german", "english"], owner: 'karl schmidt'}],
            vocabularyLists: [
                {id: '1', name: "A1", categoryId: '123'},
                {id: '2', name: "A2", categoryId: '123'},
                {id: '3', name: "A3", categoryId: '456'}]
        }, userActionFunctions.removeCategory('123'));
        const expectedState = {
            ...initialState,
            categories: [selectedCategory],
            selectedCategory,
            vocabularyLists: [{id: '3', name: "A3", categoryId: '456'}]
        };
        expect(state).toStrictEqual(expectedState);
    });
});