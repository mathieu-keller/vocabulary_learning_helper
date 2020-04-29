import React, {useEffect, useState} from 'react';
import Grid from "../../components/UI/Grid/Grid";
import {deleteCall, get, post} from "../../utility/restCaller";
import VocabularyEditModal from "../../components/UI/Modal/VocabularyEditModal";

export type Vocab = {
    id?: string;
    german: string;
    japanese: string;
    kanji: string;
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
    const cancelHandler = (): void => {
        setEditData(undefined);
    };
    const onChangeHandler = (field: string, value: string): void => {
        if (editData) {
            const newEditData: any = {...editData.new};
            newEditData[field] = value;
            setEditData({new: newEditData as Vocab, old: editData.old});
        }
    };
    const addRowHandler = (): void => {
        const emptyVocab = {german: '', japanese: '', kanji: ''};
        setEditData({
            new: emptyVocab,
            old: emptyVocab
        });
    };
    const saveHandler = (): void => {
        if (editData) {
            post<Vocab>('/vocab', editData.new, (data: Vocab) => {
                const foundedVocabs = vocabs.filter(vocab => vocab.id).filter(vocab => vocab.id !== data.id);
                setVocabs([...foundedVocabs, data]);
                addRowHandler();
            });
        }
    };

    const deleteHandler = (data: Vocab): void => {
        deleteCall<Vocab, string>('/vocab', data, ((d) => setVocabs(vocabs.filter(vocab => vocab.id !== d))));
    };


    return (<>
        <VocabularyEditModal cancelHandler={cancelHandler}
                             onChangeHandler={onChangeHandler}
                             saveHandler={saveHandler}
                             show={editData !== undefined}
                             modalClosed={cancelHandler}
                             editData={editData}
        />
        <Grid<Vocab>
            addRowHandler={addRowHandler}
            setEditHandler={setEditHandler}
            deleteHandler={deleteHandler}
            columns={[
                {title: '#', field: 'edit'},
                {title: 'German', field: 'german', width: '33%'},
                {title: 'Japanese', field: 'japanese', width: '33%'},
                {title: 'Kanji', field: 'kanji', width: '33%'}
            ]}
            data={vocabs}
        /></>);
};

export default VocabularyView;
