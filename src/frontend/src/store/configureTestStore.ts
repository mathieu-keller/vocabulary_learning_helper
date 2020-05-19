import {initStore, Store} from './store';
import {Vocab} from "../containers/vocabulary/VocabularyView";

export type TestStore = {
    testVocabulary: { vocabularies: Vocab[]; front: string; back: string };
}

const configureTestStore = (): void => {
    const actions = {
        SET_TEST_DATA: (currentStore: Store, payload: { vocabularies: Vocab[]; front: string; back: string }): Store => {
            return {...currentStore, test: {testVocabulary: payload}};
        },
    };
    initStore(actions, {test: {testVocabulary: {vocabularies: [], front: '', back: ''}}});
};

export default configureTestStore;
