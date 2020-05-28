import {initialState, testVocabularies} from "../../reducers/testVocabularies";
import {testVocabularyActions} from "../../actions/actions.types";

describe("testing test reducer", () => {
    it("set test data", async () => {
        const testVocabularyData = {
            vocabularies: [
                {id: '1', listId: '2', values: [{key: 'German', values: ['Hallo']}, {key: 'English', values: ['hello']}]},
                {id: '3', listId: '4', values: [{key: 'German', values: ['Danke']}, {key: 'English', values: ['thanks']}]}
            ], front: 'German', back: 'English'
        };
        const state = testVocabularies({...initialState},
            {type: testVocabularyActions.SET_TEST_DATA, payload: testVocabularyData});
        const expectedState = {
            ...initialState, vocabularies: testVocabularyData.vocabularies,
            front: testVocabularyData.front, back: testVocabularyData.back
        };
        expect(state).toStrictEqual(expectedState);
    });
});