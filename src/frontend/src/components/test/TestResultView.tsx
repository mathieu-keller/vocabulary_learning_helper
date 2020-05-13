import React from 'react';
import {TestResultVocab} from "../../containers/learn/test/TestView";
import {Grid, TextField} from "@material-ui/core";

type TestResultViewProps = {
    vocabs: TestResultVocab[];
    correct: number;
}

const TestResultView = ({vocabs, correct}: TestResultViewProps): JSX.Element => {
    const getTextField = (vocab: TestResultVocab): JSX.Element | null => {
        let germanError, japaneseError = false;
        if (vocab.DBGerman !== vocab.UserGerman) {
            germanError = true;
        }
        if (vocab.DBJapanese !== vocab.UserJapanese) {
            japaneseError = true;
        }
        if (germanError || japaneseError) {
            return (<>
                    <Grid item xs={6}>
                        <TextField
                            style={{width: '100%'}}
                            error={germanError}
                            label="German"
                            defaultValue={vocab.UserGerman}
                            helperText={germanError ? vocab.DBGerman : ' '}
                            variant="filled"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            style={{width: '100%'}}
                            error={japaneseError}
                            label="Japanese"
                            defaultValue={vocab.UserJapanese}
                            helperText={japaneseError ? vocab.DBJapanese : ' '}
                            variant="filled"
                            disabled
                        />
                    </Grid>
                </>
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
