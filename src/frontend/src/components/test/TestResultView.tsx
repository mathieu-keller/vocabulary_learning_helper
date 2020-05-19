import React from 'react';
import {TestResultVocab} from "../../containers/learn/test/TestView";
import {Grid, TextField} from "@material-ui/core";

type TestResultViewProps = {
    vocabs: TestResultVocab[];
    correct: number;
}

const TestResultView = ({vocabs, correct}: TestResultViewProps): JSX.Element => {
    const getTextField = (vocab: TestResultVocab): JSX.Element | null => {
        let failed = false;
        if (vocab.dbSecond.value !== vocab.userSecond.value) {
            failed = true;
        }
        if (failed) {
            return (<React.Fragment key={vocab.id}>
                    <Grid item xs={6}>
                        <TextField
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
    const calculateGrade = (): number => {
        const percent = (correct / vocabs.length) * 100;
        const steps = 19 - Math.floor(percent / 5);
        let grade = 1;
        for (let i = 0; i < steps; i++) {
            if (i % 2 === 0 || i % 3 === 0) {
                grade += 0.3;
            } else {
                grade += 0.4;
            }
        }
        if (grade < 5) {
            return Math.round(grade);
        }
        return 5.0;
    };
    return (<>
            <h1>Result:</h1>
            <h2>{correct}/{vocabs.length} Correct. You got a {calculateGrade()} grade</h2>
            <Grid container justify='center' alignItems='center'>
                {vocabs.map(getTextField)}
            </Grid>
        </>
    );
};

export default TestResultView;
