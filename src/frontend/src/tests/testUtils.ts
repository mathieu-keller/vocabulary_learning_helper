import {AppStore} from "../store/store.types";
import {initialState as userStore} from "../reducers/user";
import {initialState as testVocabulariesStore} from "../reducers/testVocabularies";

export const getAppStore = (): AppStore => ({
    user: userStore,
    testVocabularies: testVocabulariesStore
});