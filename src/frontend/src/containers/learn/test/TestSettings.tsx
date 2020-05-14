import React, {useEffect} from 'react';
import TransferList from "../../../components/ui/transfer/TransferList";
import {get, post} from "../../../utility/restCaller";
import {VocabularyList} from "../../vocabulary/VocabularyListView";
import {Button, Grid, Paper, TextField} from "@material-ui/core";
import {Vocab} from "../../vocabulary/VocabularyView";
import {useStore} from "../../../store/store";
import {RouteComponentProps} from "react-router-dom";

const TestSettings = (props: RouteComponentProps): JSX.Element => {
    document.title = 'Trainer - Test Settings';
    const dispatch = useStore(false)[1];
    const [checked, setChecked] = React.useState<{ value: string; name: string }[]>([]);
    const [left, setLeft] = React.useState<{ value: string; name: string }[]>([]);
    const [right, setRight] = React.useState<{ value: string; name: string }[]>([]);
    const [maxVocabularyCount, setMaxVocabularyCount] = React.useState(25);
    useEffect(() => {
        get<VocabularyList[]>('/vocabulary-list', (r) => {
            setLeft(r.map(m => ({name: m.name, value: m.id!})));
        });
    }, []);
    const onSubmit = (): void => {
        post<{ listIds: string[]; limit: number }, Vocab[]>('/generate-test',
            {listIds: right.map(ri => ri.value), limit: maxVocabularyCount},
            (r) => {
                dispatch('SET_TEST_DATA', r);
                props.history.push('/learn/test');
            }, 200);
    };

    return (
        <Paper style={{padding: '20px'}}>
            <Grid container direction="row" justify="center" alignItems="stretch">
                <Grid item xs={9} style={{padding: '5xp'}}>
                    <TransferList checked={checked}
                                  setChecked={setChecked}
                                  setLeft={setLeft}
                                  left={left}
                                  leftTitle='All Lists'
                                  setRight={setRight}
                                  right={right}
                                  rightTitle='List to Test'/>
                </Grid>
                <Grid item xs={3}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <TextField id="standard-basic" type='number' label="Vocabulary amount"
                                   onChange={(e) => {
                                       const number: number = +e.target.value;
                                       if (number > 0) {
                                           setMaxVocabularyCount(+e.target.value);
                                       } else {
                                           setMaxVocabularyCount(1);
                                       }
                                   }}
                                   value={maxVocabularyCount}/>
                    </div>
                </Grid>

            </Grid>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', width: '100%'}}>
                <Button onClick={onSubmit} disabled={right.length < 1} variant="contained" color="primary">
                    Start Test
                </Button>
            </div>
        </Paper>
    );
};

export default TestSettings;
