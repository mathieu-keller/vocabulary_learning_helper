import {testActions} from '../actions/actions.types';
import {TestVocabularyStore} from "../store/store.types";
import {TestActions} from "../actions/test";

const initialState: TestVocabularyStore = {
    vocabularies: [],
    front: '',
    back: ''
};

export const testVocabularies = (state = initialState, action: TestActions): TestVocabularyStore => {
    if (action.type === testActions.SET_TEST_DATA) {
        const {vocabularies, front, back} = action.payload;
        return {...state, vocabularies, front, back};
    }
    return state;
};
