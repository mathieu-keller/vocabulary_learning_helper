import React, {useEffect, useMemo, useState} from 'react';
import {deleteCall, get, post} from "../../utility/restCaller";
import {RouteComponentProps} from "react-router-dom";
import VocabularyListEditModal from "../../components/ui/modal/VocabularyListEditModal";
import {Paper} from "@material-ui/core";
import CardGrid from "../../components/ui/grid/CardGrid";

export type VocabularyList = {
    id?: string;
    name: string;
    categoryId?: string;
}

const VocabularyListView = (props: RouteComponentProps<{ categoryID: string }>): JSX.Element => {
    document.title = 'Trainer - Vocabulary Lists';
    const categoryID = props.match.params.categoryID;
    const [vocabularyLists, setVocabularyLists] = useState<VocabularyList[]>([]);
    const [editData, setEditData] = useState<VocabularyList>({name: '', categoryId: categoryID});
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    useEffect(() => {
        get<VocabularyList[] | null>(`/vocabulary-list/${categoryID}`, (r) => {
                if (r) {
                    setVocabularyLists(r);
                }
            }
        );
    }, [categoryID]);
    const grid = useMemo(() => {
        const deleteHandler = (id?: string): void => {
            if (id) {
                deleteCall<{}, string>(`/vocabulary-list/${id}`, {},
                    ((resId) => setVocabularyLists(vocabularyLists
                        .filter(vocabularyList => vocabularyList.id !== resId))));
            }
        };
        const setEditHandler = (data: VocabularyList): void => {
            setShowEditModal(true);
            setEditData(data);
        };
        const onDoubleClick = (id?: string): void => {
            if (id) {
                props.history.push(`/vocabulary/${categoryID}/${id}`);
            }
        };
        return (<CardGrid
            deleteHandler={deleteHandler}
            setEditHandler={setEditHandler}
            onClick={onDoubleClick}
            cards={vocabularyLists}
            addAction={() => setEditHandler({name: '', categoryId: categoryID})}
            title='Choose Vocabulary List:'/>);
    }, [vocabularyLists]);

    const editModal = useMemo(() => {
        const cancelHandler = (): void => {
            setEditData({name: '', categoryId: categoryID});
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
                    setEditData({name: '', categoryId: categoryID});
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
