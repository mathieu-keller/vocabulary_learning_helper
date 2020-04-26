import React, {useEffect, useState} from 'react';
import Grid from "../../components/UI/Grid/Grid";
import {deleteCall, get, post} from "../../utility/restCaller";

type Vocab = {
    Id?: string;
    German: string;
    Japanese: string;
    Kanji: string;
}

const VocabularyView = (): JSX.Element => {
    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    const [editData, setEditData] = useState<{ new: Vocab; old: Vocab }>();

    useEffect(() => {
        get<Vocab[]>('/vocab', setVocabs);
    }, []);

    const setEditHandler = (data: Vocab): void => {
        setEditData({new: data, old: data});
    };
    const cancelHandler = (data: Vocab): void => {
        setEditData(undefined);
        if (!data.Id) {
            const filteredVocabs = vocabs.filter(vocab => vocab.Id);
            setVocabs(filteredVocabs);
        }
    };
    const onChangeHandler = (field: string, value: string): void => {
        if (editData) {
            const newEditData: any = {...editData.new};
            newEditData[field] = value;
            setEditData({new: newEditData as Vocab, old: editData.old});
        }
    };
    const addRowHandler = (): void => {
        if (!editData) {
            const emptyVocab = {German: '', Japanese: '', Kanji: ''};
            setVocabs([...vocabs, emptyVocab]);
            setEditData({
                new: emptyVocab,
                old: emptyVocab
            });
        }
    };
    const saveHandler = (): void => {
        if (editData) {
            post<Vocab>('/vocab', editData.new, (data: Vocab) => {
                const foundedVocabs = vocabs.filter(vocab => vocab.Id).filter(vocab => vocab.Id !== data.Id);
                setVocabs([...foundedVocabs, data]);
                setEditData(undefined);
            });
        }
    };

    const deleteHandler = (data: Vocab): void => {
        deleteCall<Vocab, string>('/vocab', data, ((d) => setVocabs(vocabs.filter(vocab => vocab.Id !== d))));
    };


    return (<Grid<Vocab>
        id='Id'
        editData={editData}
        addRowHandler={addRowHandler}
        cancelHandler={cancelHandler}
        onChangeHandler={onChangeHandler}
        setEditHandler={setEditHandler}
        saveHandler={saveHandler}
        deleteHandler={deleteHandler}
        columns={[
            {title: '#', field: 'edit'},
            {title: 'German', field: 'German',width:'33%'},
            {title: 'Japanese', field: 'Japanese',width:'33%'},
            {title: 'Kanji', field: 'Kanji',width:'33%'}
        ]}
        data={vocabs}
    />);
};

export default VocabularyView;
