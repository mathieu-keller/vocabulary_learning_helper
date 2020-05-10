import React, {useEffect} from 'react';
import TransferList from "../../../components/ui/transfer/TransferList";
import {get} from "../../../utility/restCaller";
import {VocabularyList} from "../../vocabulary/VocabularyListView";
import {Button, Grid, Paper, TextField} from "@material-ui/core";

const TestSettings = (): JSX.Element => {
    const [checked, setChecked] = React.useState<{ value: string; name: string }[]>([]);
    const [left, setLeft] = React.useState<{ value: string; name: string }[]>([]);
    const [right, setRight] = React.useState<{ value: string; name: string }[]>([]);
    const [maxVocabularyCount, setMaxVocabularyCount] = React.useState(25);
    useEffect(() => {
        get<VocabularyList[]>('/vocabulary-list', (r) => {
            setLeft(r.map(m => ({name: m.name, value: m.id!})));
        });
    }, []);
    return (
        <Paper style={{padding:'20px'}}>
            <Grid container direction="row" justify="center" alignItems="stretch">
                <Grid item xs={6} style={{padding: '5xp'}}>
                    <TransferList checked={checked}
                                  setChecked={setChecked}
                                  setLeft={setLeft}
                                  left={left}
                                  leftTitle='All Lists'
                                  setRight={setRight}
                                  right={right}
                                  rightTitle='List to Test'/>
                </Grid>
                <Grid item xs={3} style={{display: 'flex'}} justify="center">
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
                </Grid>
                <Grid item xs={3} style={{display: 'flex'}} alignItems="flex-end" justify="flex-end">
                    <Button variant="contained" color="primary">
                        Start Test
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default TestSettings;
