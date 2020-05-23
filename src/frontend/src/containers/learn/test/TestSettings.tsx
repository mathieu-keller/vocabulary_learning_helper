import React, {useEffect, useState} from 'react';
import TransferList from "../../../components/ui/transfer/TransferList";
import {get, post} from "../../../utility/restCaller";
import {VocabularyList} from "../../vocabulary/VocabularyListView";
import {Button, Grid, List, ListItem, ListItemText, Paper, TextField} from "@material-ui/core";
import {Vocab} from "../../vocabulary/VocabularyView";
import {RouteComponentProps} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as testActions from "../../../actions/test";
import {AppStore} from "../../../store/store.types";
import {storeVocabularyLists} from "../../../actions/user";

const TestSettings = (props: RouteComponentProps<{ user: string; category: string }>): JSX.Element => {
    document.title = 'Trainer - Test Settings';
    const dispatch = useDispatch();
    const [checked, setChecked] = React.useState<{ value: string; name: string }[]>([]);
    const [left, setLeft] = React.useState<{ value: string; name: string }[]>([]);
    const [right, setRight] = React.useState<{ value: string; name: string }[]>([]);
    const [maxVocabularyCount, setMaxVocabularyCount] = React.useState(25);
    const [columns, setColumns] = useState<string[]>([]);
    const [front, setFront] = useState<string>('');
    const [back, setBack] = useState<string>('');
    const storedVocabularyLists = useSelector((store: AppStore) => store.user.vocabularyLists);
    const selectedCategory = useSelector((store: AppStore) => store.user.selectedCategory);

    useEffect(() => {
        const vocabularyLists = storedVocabularyLists.filter(storedVocabularyList => storedVocabularyList.categoryId === selectedCategory.id);
        if (vocabularyLists.length < 1 && selectedCategory.id) {
            get<VocabularyList[]>(`/vocabulary-list/${selectedCategory.id}`, (r) => {
                setLeft(r.map(m => ({name: m.name, value: m.id ? m.id : ''})));
                dispatch(storeVocabularyLists([...storedVocabularyLists, ...r]));
            });
        } else {
            setLeft(vocabularyLists.map(m => ({name: m.name, value: m.id ? m.id : ''})));
        }
    }, [selectedCategory]);
    useEffect(() => {
        if (selectedCategory.id) {
            setColumns(selectedCategory.columns);
            setFront(selectedCategory.columns[0]);
            setBack(selectedCategory.columns[1]);
        }
    }, [selectedCategory]);
    const onSubmit = (): void => {
        post<{ listIds: string[]; limit: number; firstValueField: string; secondValueField: string }, Vocab[]>('/generate-test',
            {listIds: right.map(ri => ri.value), limit: maxVocabularyCount, firstValueField: front, secondValueField: back},
            (r) => {
                dispatch(testActions.setTestData(r, front, back));
                props.history.push('/learn/test');
            }, 200);
    };

    return (
        <Paper style={{padding: '20px'}}>
            <Grid container direction="row" justify="center" alignItems="stretch">
                <Grid item xs={7}>
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
                    <div style={{margin: '0 10px'}}>
                        Front:
                        <List>
                            {columns.map((column, index) => (
                                <ListItem
                                    key={index}
                                    button
                                    selected={column === front}
                                    onClick={() => setFront(column)}
                                >
                                    <ListItemText primary={column}/>
                                </ListItem>
                            ))}
                        </List>
                        Back:
                        <List>
                            {columns.map((column, index) => (
                                <ListItem
                                    key={index}
                                    button
                                    selected={column === back}
                                    onClick={() => setBack(column)}
                                >
                                    <ListItemText primary={column}/>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Grid>
                <Grid item xs={2}>
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
