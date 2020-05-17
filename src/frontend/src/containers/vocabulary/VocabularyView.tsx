import React, {useEffect, useMemo, useState} from 'react';
import Grid from "../../components/ui/grid/Grid";
import {deleteCall, get, post} from "../../utility/restCaller";
import VocabularyEditModal from "../../components/ui/modal/VocabularyEditModal";
import {RouteComponentProps} from "react-router-dom";
import {Paper} from "@material-ui/core";
import {Category} from "./CategoryView";

type VocabularyValue = {
    key: string;
    value: string;
}

export type Vocab = {
    id?: string;
    listId: string;
    values: VocabularyValue[];
}

const VocabularyView = (props: RouteComponentProps<{ categoryID: string; listID: string }>): JSX.Element => {
    document.title = 'Trainer - Vocabulary';
    const listId = props.match.params.listID;
    const categoryId = props.match.params.categoryID;
    const [columns, setColumns] = useState<string[]>([]);
    const emptyEditData = {values: columns.map(column => ({key: column, value: ""})), listId: listId};
    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    const [editData, setEditData] = useState<Vocab>(emptyEditData);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);


    useEffect(() => {
        get<Vocab[]>(`/vocabulary/${listId}`, setVocabs);
        get<Category>(`/category/${categoryId}`, (r) => setColumns(r.columns));
    }, [listId, categoryId]);

    const grid = useMemo(() => {
        const deleteHandler = (data: Vocab): void => {
            deleteCall<Vocab, Vocab>('/vocabulary', data, ((d) => setVocabs(vocabs.filter(vocab => vocab.id !== d.id))));
        };
        const setEditHandler = (data: Vocab): void => {
            setEditData({...data});
            setShowEditModal(true);
        };
        const col = columns.map(column => ({title: column, field: column}));
        return (<Grid<Vocab>
            addRowHandler={() => setEditHandler(emptyEditData)}
            setEditHandler={setEditHandler}
            deleteHandler={deleteHandler}
            columns={[
                {title: '#', field: 'edit'},
                ...col
            ]}
            data={vocabs}
        />);
    }, [vocabs, columns]);
    const editModal = useMemo(() => {
        const cancelHandler = (): void => {
            setEditData(emptyEditData);
            setShowEditModal(false);
        };
        const onChangeHandler = (field: string, value: string): void => {
            const valuesCopy = [...editData.values.map(val => ({...val}))];
            const valueCopy = valuesCopy.find(val => val.key === field);
            if (valueCopy) {
                valueCopy.value = value;
                setEditData({...editData, values: valuesCopy});
            }
        };
        const saveHandler = (): void => {
            post<Vocab, Vocab>('/vocabulary', editData, (data) => {
                const foundedVocabs = vocabs.filter(vocab => vocab.id).filter(vocab => vocab.id !== data.id);
                setVocabs([...foundedVocabs, data]);
                setEditData(emptyEditData);
            });
        };
        return (<VocabularyEditModal
            cancelHandler={cancelHandler}
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
