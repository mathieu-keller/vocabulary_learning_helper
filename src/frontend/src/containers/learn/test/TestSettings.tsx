import React, {useEffect} from 'react';
import TransferList from "../../../components/ui/transfer/TransferList";
import {get} from "../../../utility/restCaller";
import {VocabularyList} from "../../vocabulary/VocabularyListView";
import {Paper} from "@material-ui/core";

const TestSettings = (): JSX.Element => {
    const [checked, setChecked] = React.useState<{ value: string; name: string }[]>([]);
    const [left, setLeft] = React.useState<{ value: string; name: string }[]>([]);
    const [right, setRight] = React.useState<{ value: string; name: string }[]>([]);
    useEffect(() => {
        get<VocabularyList[]>('/vocabulary-list', (r) => {
            setLeft(r.map(m => ({name: m.name, value: m.id!})));
        });
    }, []);
    return (
        <Paper>
            <TransferList checked={checked}
                          setChecked={setChecked}
                          right={right}
                          setLeft={setLeft}
                          left={left}
                          setRight={setRight}/>
        </Paper>
    );
};

export default TestSettings;
