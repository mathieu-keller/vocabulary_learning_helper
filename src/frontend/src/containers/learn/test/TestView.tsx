import React, {useEffect, useState} from 'react';
import {post} from "../../../utility/restCaller";
import {Vocab} from "../../vocabulary/VocabularyView";
import {Button, Card, CardActions, CardContent, TextField, Typography} from "@material-ui/core";
import {useStore} from "../../../store/store";
import {toast} from "react-toastify";

type TestResultVocab = {
    UserJapanese: string;
    UserGerman: string;
    DBJapanese: string;
    DBGerman: string;
}

type TestResult = {
    vocabs: TestResultVocab[];
    correct: number;
}

const TestView = (): JSX.Element => {
    const store = useStore()[0];
    const [vocabulary, setVocabulary] = useState<Vocab[]>([]);
    const [index, setIndex] = useState<number>(0);
    useEffect(() => {
        const test = store.test;
        if (test) {
            setVocabulary(test.testVocabulary);
        }
    }, [store.test?.testVocabulary]);
    const submit = (): void => {
        post<Vocab[], TestResult>('/check-test', vocabulary, (r) => {
            toast.success(`${r.correct}/${vocabulary.length}`);
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
    return (
        <Card style={{width: '50%', margin: 'auto'}}>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    German
                </Typography>
                <Typography variant="h5" component="h2">
                    {selectedVocabulary.german}
                </Typography>
                <Typography variant="body2" component="p">
                    <TextField label='Japanese'
                               style={{width: '100%'}}
                               onChange={(e) => onChange(selectedVocabulary, 'japanese', e.target.value)}
                               onKeyDown={(e) => e.keyCode === 13 ? next() : null}
                               value={selectedVocabulary.japanese}
                    />
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={next} style={{width: '100%'}} variant="contained" color="primary">Next</Button>
            </CardActions>
        </Card>
    );
};

export default TestView;
