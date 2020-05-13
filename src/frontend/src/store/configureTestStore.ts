import {initStore, Store} from './store';
import {Vocab} from "../containers/vocabulary/VocabularyView";

export type TestStore = {
    testVocabulary: Vocab[];
}

const configureTestStore = (): void => {
    const actions = {
        SET_TEST_DATA: (currentStore: Store, payload: Vocab[]): Store => {
            return {...currentStore, test: {testVocabulary: payload}};
        },
    };
    initStore(actions, {test: {testVocabulary: []}});
};

export default configureTestStore;
