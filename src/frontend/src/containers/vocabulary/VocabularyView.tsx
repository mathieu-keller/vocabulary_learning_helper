import React, {useEffect, useMemo, useState} from 'react';
import Grid from "../../components/ui/grid/Grid";
import {deleteCall, get, post} from "../../utility/restCaller";
import VocabularyEditModal from "../../components/ui/modal/VocabularyEditModal";
import {RouteComponentProps} from "react-router-dom";
import {Paper} from "@material-ui/core";

export type Vocab = {
    id?: string;
    german: string;
    japanese: string;
    listId: string;
}

const VocabularyView = (props: RouteComponentProps<{ id: string }>): JSX.Element => {
    document.title = 'Trainer - Vocabulary';
    const listId = props.match.params.id;
    const emptyEditData = {german: '', japanese: '', kanji: '', listId: listId};
    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    const [editData, setEditData] = useState<Vocab>(emptyEditData);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);


    useEffect(() => {
        get<Vocab[]>('/vocabulary/' + listId, setVocabs);
    }, []);

    const grid = useMemo(() => {
        const deleteHandler = (data: Vocab): void => {
            deleteCall<Vocab, Vocab>('/vocabulary', data, ((d) => setVocabs(vocabs.filter(vocab => vocab.id !== d.id))));
        };
        const setEditHandler = (data: Vocab): void => {
            setEditData(data);
            setShowEditModal(true);
        };
        return (<Grid<Vocab>
            addRowHandler={() => setEditHandler(emptyEditData)}
            setEditHandler={setEditHandler}
            deleteHandler={deleteHandler}
            columns={[
                {title: '#', field: 'edit'},
                {title: 'German', field: 'german', width: '50%'},
                {title: 'Japanese', field: 'japanese', width: '50%'},
            ]}
            data={vocabs}
        />);
    }, [vocabs]);
    const editModal = useMemo(() => {
        const cancelHandler = (): void => {
            setEditData(emptyEditData);
            setShowEditModal(false);
        };
        const onChangeHandler = (field: string, value: string): void => {
            if (editData && (field === 'german' || field === 'japanese')) {
                const newEditData: Vocab = {...editData};
                newEditData[field] = value;
                setEditData(newEditData);
            }
        };
        const saveHandler = (): void => {
            if (editData) {
                post<Vocab, Vocab>('/vocabulary', editData, (data) => {
                    const foundedVocabs = vocabs.filter(vocab => vocab.id).filter(vocab => vocab.id !== data.id);
                    setVocabs([...foundedVocabs, data]);
                    setEditData(emptyEditData);
                });
            }
        };
        return (<VocabularyEditModal cancelHandler={cancelHandler}
                                     onChangeHandler={onChangeHandler}
                                     saveHandler={saveHandler}
                                     show={showEditModal}
                                     modalClosed={cancelHandler}
                                     editData={editData}
        />);
    }, [editData, showEditModal]);

    return (<Paper>
        {editModal}
        {grid}
    </Paper>);
};

export default VocabularyView;
