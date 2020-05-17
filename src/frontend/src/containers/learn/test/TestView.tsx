import React, {useEffect, useState} from 'react';
import {post} from "../../../utility/restCaller";
import {Vocab} from "../../vocabulary/VocabularyView";
import {useStore} from "../../../store/store";
import TestCard from "../../../components/test/TestCard";
import TestResultView from "../../../components/test/TestResultView";
import {RouteComponentProps} from "react-router-dom";

export type TestResultVocab = {
    id: string;
    userJapanese: string;
    userGerman: string;
    dbJapanese: string;
    dbGerman: string;
}

type TestResult = {
    vocabs: TestResultVocab[];
    correct: number;
}

const TestView = (props: RouteComponentProps): JSX.Element => {
    document.title = 'Trainer - Test';
    const store = useStore()[0];
    const [vocabulary, setVocabulary] = useState<Vocab[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [result, setResult] = useState<TestResult>();
    useEffect(() => {
        const test = store.test;
        if (test) {
            setVocabulary(test.testVocabulary);
            if (test.testVocabulary.length < 1) {
                props.history.push('/learn');
            }
        }
    }, [store.test?.testVocabulary]);
    const submit = (): void => {
        post<Vocab[], TestResult>('/check-test', vocabulary, (r) => {
            setResult(r);
        }, 200);
    };
    const onChange = (vocab: Vocab, field: 'german' | 'japanese', value: string): void => {
        vocab[field] = value;
        setVocabulary([...vocabulary]);
    };
    const next = (): void => {
        const nextIndex = index + 1;
        if (vocabulary.length > nextIndex) {
            setIndex(nextIndex);
        } else {
            submit();
        }
    };

    let selectedVocabulary: Vocab = {id: '', german: '', japanese: '', listId: ''};
    if (vocabulary.length > 0) {
        selectedVocabulary = vocabulary[index];
    }
    if (result) {
        return (<TestResultView vocabs={result.vocabs} correct={result.correct}/>);
    }
    return (
        <>
            <h2>{index + 1}/{vocabulary.length}</h2>
            <TestCard
                selectedVocabulary={selectedVocabulary}
                onChange={onChange}
                next={next}
            />
        </>
    );
};
export default TestView;