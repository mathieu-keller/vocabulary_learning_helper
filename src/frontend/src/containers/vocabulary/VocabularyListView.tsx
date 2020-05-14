import React, {useEffect, useMemo, useState} from 'react';
import {deleteCall, get, post} from "../../utility/restCaller";
import {RouteComponentProps} from "react-router-dom";
import VocabularyListEditModal from "../../components/ui/modal/VocabularyListEditModal";
import Grid from "../../components/ui/grid/Grid";
import {Paper} from "@material-ui/core";

export type VocabularyList = {
    id?: string;
    name: string;
}

const VocabularyListView = (props: RouteComponentProps): JSX.Element => {
    document.title = 'Trainer - Vocabulary Lists';
    const [vocabularyLists, setVocabularyLists] = useState<VocabularyList[]>([]);
    const [editData, setEditData] = useState<VocabularyList>({name: ''});
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    useEffect(() => {
        get<VocabularyList[]>('/vocabulary-list', setVocabularyLists);
    }, []);
    const grid = useMemo(() => {
        const deleteHandler = (data: VocabularyList): void => {
            deleteCall<VocabularyList, VocabularyList>('/vocabulary-list', data,
                ((d) => setVocabularyLists(vocabularyLists
                    .filter(vocabularyList => vocabularyList.id !== d.id))));
        };
        const setEditHandler = (data: VocabularyList): void => {
            setShowEditModal(true);
            setEditData(data);
        };
        const onDoubleClick = (data: VocabularyList): void => {
            props.history.push('/vocabulary/' + data.id);
        };
        return (<Grid<VocabularyList>
            addRowHandler={() => setEditHandler({name: ''})}
            setEditHandler={setEditHandler}
            deleteHandler={deleteHandler}
            columns={[
                {title: '#', field: 'edit'},
                {title: 'Name', field: 'name', width: '100%'},
            ]}
            data={vocabularyLists}
            onDoubleClick={onDoubleClick}
        />);
    }, [vocabularyLists]);

    const editModal = useMemo(() => {
        const cancelHandler = (): void => {
            setEditData({name: ''});
            setShowEditModal(false);
        };
        const onChangeHandler = (field: string, value: string): void => {
            if (editData && field === 'name') {
                const newEditData: VocabularyList = {...editData};
                newEditData[field] = value;
                setEditData(newEditData);
            }
        };
        const saveHandler = (): void => {
            if (editData) {
                post<VocabularyList, VocabularyList>('/vocabulary-list', editData, (data) => {
                    const foundedVocabs = vocabularyLists
                        .filter(vocabularyList => vocabularyList.id)
                        .filter(vocabularyList => vocabularyList.id !== data.id);
                    setVocabularyLists([...foundedVocabs, data]);
                    setEditData({name: ''});
                    setShowEditModal(false);
                });
            }
        };
        return (<VocabularyListEditModal cancelHandler={cancelHandler}
                                         onChangeHandler={onChangeHandler}
                                         saveHandler={saveHandler}
                                         show={showEditModal}
                                         modalClosed={cancelHandler}
                                         editData={editData}
        />);
    }, [editData, showEditModal]);
    return (
        <Paper>
            {grid}
            {editModal}
        </Paper>
    );
};

export default VocabularyListView;
