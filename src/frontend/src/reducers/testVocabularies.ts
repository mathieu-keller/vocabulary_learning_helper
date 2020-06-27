import {testVocabularyActions} from '../actions/actions.types';
import {TestVocabularyStore} from "../store/store.types";
import {TestActions} from "../actions/testVocabularies";

export const initialState: TestVocabularyStore = {
  vocabularies: [],
  front: '',
  back: ''
};

export const testVocabularies = (state = initialState, action: TestActions): TestVocabularyStore => {
  if (action.type === testVocabularyActions.SET_TEST_DATA) {
    return {...state, ...action.payload};
  }
  return state;
};
