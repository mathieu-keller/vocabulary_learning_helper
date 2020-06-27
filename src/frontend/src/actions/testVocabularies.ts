import {ReduxActionWithPayload, testVocabularyActions} from "./actions.types";
import {Vocab} from "../containers/vocabulary/VocabularyView";

export type TestActions = SetTestDataAction;

type SetTestDataAction = ReduxActionWithPayload<testVocabularyActions.SET_TEST_DATA, { vocabularies: Vocab[]; front: string; back: string }>
export const testVocabularyActionFunctions = {
  setTestData: (vocabularies: Vocab[], front: string, back: string): SetTestDataAction => ({
    type: testVocabularyActions.SET_TEST_DATA,
    payload: {vocabularies, front, back}
  })
};
