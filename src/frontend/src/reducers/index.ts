import {combineReducers} from 'redux';
import {user} from "./user";
import {testVocabularies} from "./testVocabularies";

const reducers = combineReducers({
  user: user,
  testVocabularies: testVocabularies,
});

export default reducers;
