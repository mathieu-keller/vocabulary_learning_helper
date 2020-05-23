import {testVocabularyActions} from '../actions/actions.types';
import {TestVocabularyStore} from "../store/store.types";
import {TestActions} from "../actions/testVocabularies";

export const initialState: TestVocabularyStore = {
    vocabularies: [],
    front: '',
    back: ''
};

export const testVocabularies = (state = initialState, action: TestActions): TestVocabularyStore => {
    switch (action.type) {
        case testVocabularyActions.SET_TEST_DATA: {
            const {vocabularies, front, back} = action.payload;
            return {...state, vocabularies, front, back};
        }
    }
};
