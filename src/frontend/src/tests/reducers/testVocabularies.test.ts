import {initialState, testVocabularies} from "../../reducers/testVocabularies";
import {testVocabularyActions} from "../../actions/actions.types";

describe("test test reducer", () => {
    it("set test data", async () => {
        const testVocabularyData = {
            vocabularies: [
                {id: '1', listId: '2', values: [{key: 'German', value: 'Hallo'}, {key: 'English', value: 'hello'}]},
                {id: '3', listId: '4', values: [{key: 'German', value: 'Danke'}, {key: 'English', value: 'thanks'}]}
            ], front: 'German', back: 'English'
        }
        const state = testVocabularies({...initialState},
            {type: testVocabularyActions.SET_TEST_DATA, payload: testVocabularyData});
        const expectedState = {
            ...initialState, vocabularies: testVocabularyData.vocabularies,
            front: testVocabularyData.front, back: testVocabularyData.back
        }
        expect(state).toStrictEqual(expectedState);
    });
})