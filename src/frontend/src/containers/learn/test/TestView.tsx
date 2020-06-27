import React, {useEffect, useState} from 'react';
import {post} from "../../../utility/restCaller";
import {Vocab, VocabularyValue} from "../../vocabulary/VocabularyView";
import TestCard from "../../../components/test/TestCard";
import TestResultView from "../../../components/test/TestResultView";
import {RouteComponentProps} from "react-router-dom";
import {useSelector} from "react-redux";
import {AppStore} from "../../../store/store.types";

export type TestResultVocab = {
  id: string;
  userFirst: VocabularyValue;
  userSecond: VocabularyValue;
  dbFirst: VocabularyValue;
  dbSecond: VocabularyValue;
}

type TestResult = {
  vocabs: TestResultVocab[];
  correct: number;
}

const TestView = (props: RouteComponentProps): JSX.Element | null => {
  document.title = 'Trainer - Test';
  const testVocabularies = useSelector((store: AppStore) => store.testVocabularies);
  const [vocabularies, setVocabularies] = useState<Vocab[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [result, setResult] = useState<TestResult>();
  useEffect(() => {
    if (testVocabularies.vocabularies.length < 1) {
      props.history.push('/learn');
    } else {
      setVocabularies(testVocabularies.vocabularies);
    }
  }, [testVocabularies]);
  const submit = (): void => {
    post<{ vocabularies: Vocab[]; firstValueField: string; secondValueField: string }, TestResult>('/check-test',
      {vocabularies, firstValueField: testVocabularies.front, secondValueField: testVocabularies.back}, 200)
      .then((r) => {
        if (typeof r !== 'string') {
          setResult(r);
        }
      });
  };
  const onChange = (vocab: Vocab, field: string, value: string[]): void => {
    const vocabulary = vocab.values.find(val => val.key === field);
    if (vocabulary) {
      vocabulary.values = value;
      setVocabularies([...vocabularies]);
    }
  };
  const next = (): void => {
    const nextIndex = index + 1;
    if (vocabularies.length > nextIndex) {
      setIndex(nextIndex);
    } else {
      submit();
    }
  };

  let selectedVocabulary: Vocab = {id: '', values: [], listId: ''};
  if (vocabularies.length > 0) {
    selectedVocabulary = vocabularies[index];
  }
  if (result) {
    return (<TestResultView vocabs={result.vocabs} correct={result.correct}/>);
  }
  return (
    <>
      <h2>{index + 1}/{vocabularies.length}</h2>
      <TestCard
        selectedVocabulary={selectedVocabulary}
        onChange={onChange}
        next={next}
        front={testVocabularies.front}
        back={testVocabularies.back}
      />
    </>
  );
};
export default TestView;
