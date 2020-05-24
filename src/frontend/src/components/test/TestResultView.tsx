import React from 'react';
import {TestResultVocab} from "../../containers/learn/test/TestView";
import {Grid, TextField} from "@material-ui/core";

// visible for test
export type TestResultViewProps = {
    vocabs: TestResultVocab[];
    correct: number;
}

const TestResultView = ({vocabs, correct}: TestResultViewProps): JSX.Element => {
    const getTextField = (vocab: TestResultVocab): JSX.Element | null => {
        let failed = false;
        if (vocab.dbSecond.value.toLowerCase().trim() !== vocab.userSecond.value.toLowerCase().trim()) {
            failed = true;
        }
        if (failed) {
            return (<React.Fragment key={vocab.id}>
                    <Grid item xs={6}>
                        <TextField
                            data-testid="result-correction-first"
                            style={{width: '100%'}}
                            label={vocab.userFirst.key}
                            defaultValue={vocab.userFirst.value}
                            helperText={' '}
                            variant="filled"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            data-testid="result-correction-second"
                            style={{width: '100%'}}
                            error={failed}
                            label={vocab.userSecond.key}
                            defaultValue={vocab.userSecond.value}
                            helperText={failed ? vocab.dbSecond.value : ' '}
                            variant="filled"
                            disabled
                        />
                    </Grid>
                </React.Fragment>
            );
        }
        return null;
    };
    const calculateGrade = (): string => {
        const percent = (correct / vocabs.length) * 100;
        const steps = 19 - Math.floor(percent / 5);
        const grades = ["1", "1.3", "1.7", "2.0", "2.3", "2.7", "3.0", "3.3", "3.7", "4.0", "5.0"];
        return grades[steps];
    };
    return (<>
            <h1>Result:</h1>
            <h2 data-testid="result-title">{correct}/{vocabs.length}. Correct. You got a {calculateGrade()} grade</h2>
            <Grid data-testid="result-wrong-vocabularies" container justify='center' alignItems='center'>
                {vocabs.map(getTextField)}
            </Grid>
        </>
    );
};

export default TestResultView;
