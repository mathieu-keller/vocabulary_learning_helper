import {ReduxActionWithPayload, testActions} from "./actions.types";
import {Vocab} from "../containers/vocabulary/VocabularyView";

export type TestActions = SetTestDataAction;

type SetTestDataAction = ReduxActionWithPayload<testActions.SET_TEST_DATA, { vocabularies: Vocab[]; front: string; back: string }>
export const setTestData = (vocabularies: Vocab[], front: string, back: string): SetTestDataAction => ({
    type: testActions.SET_TEST_DATA,
    payload: {vocabularies, front, back}
});