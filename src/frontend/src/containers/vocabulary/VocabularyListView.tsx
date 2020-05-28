import React, {useEffect, useMemo, useState} from 'react';
import {deleteCall, get, post} from "../../utility/restCaller";
import {RouteComponentProps} from "react-router-dom";
import VocabularyListEditModal from "../../components/ui/modal/VocabularyListEditModal";
import {Paper} from "@material-ui/core";
import CardGrid from "../../components/ui/grid/CardGrid";
import {useDispatch, useSelector} from "react-redux";
import {AppStore} from "../../store/store.types";
import {userActionFunctions} from "../../actions/user";

export type VocabularyList = {
   readonly id?: string;
   readonly name: string;
   readonly categoryId?: string;
}

const VocabularyListView = (props: RouteComponentProps<{ user: string; category: string }>): JSX.Element => {
    document.title = 'Trainer - Vocabulary Lists';
    const category = props.match.params.category;
    const user = props.match.params.user;
    const [vocabularyLists, setVocabularyLists] = useState<VocabularyList[]>([]);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const storedVocabularyLists = useSelector((store: AppStore) => store.user.vocabularyLists);
    const selectedCategory = useSelector((store: AppStore) => store.user.selectedCategory);
    const [editData, setEditData] = useState<VocabularyList>({name: '', categoryId: selectedCategory.id});
    const dispatch = useDispatch();
    useEffect(() => {
        const vocabularyListForCategory = storedVocabularyLists
            .filter(storedVocabularyList => storedVocabularyList.categoryId === selectedCategory.id);
        if (vocabularyListForCategory.length < 1 && selectedCategory.id) {
            get<VocabularyList[] | null>(`/vocabulary-list/${selectedCategory.id}`, (r) => {
                    if (r) {
                        dispatch(userActionFunctions.storeVocabularyLists([...storedVocabularyLists, ...r]));
                        setVocabularyLists(r);
                    }
                }
            );
        } else {
            setVocabularyLists(vocabularyListForCategory);
        }
    }, [selectedCategory]);
    const grid = useMemo(() => {
        const deleteHandler = (id?: string): void => {
            if (id) {
                deleteCall<null, string>(`/vocabulary-list/${id}`, null,
                    ((resId) => setVocabularyLists(vocabularyLists
                        .filter(vocabularyList => vocabularyList.id !== resId))));
            }
        };
        const setEditHandler = (data: VocabularyList): void => {
            setShowEditModal(true);
            setEditData(data);
        };
        const onClick = (data: VocabularyList): void => {
            if (data.id) {
                props.history.push(`/vocabulary/${user}/${category}/${data.id}`);
            }
        };
        return (<CardGrid<VocabularyList>
            deleteHandler={deleteHandler}
            setEditHandler={setEditHandler}
            onClick={onClick}
            cards={vocabularyLists}
            addAction={() => setEditHandler({name: '', categoryId: selectedCategory.id})}
            title='Choose Vocabulary List:'/>);
    }, [vocabularyLists]);

    const editModal = useMemo(() => {
        const cancelHandler = (): void => {
            setEditData({name: '', categoryId: selectedCategory.id});
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
                    dispatch(userActionFunctions.storeVocabularyLists([...foundedVocabs, data]));
                    setVocabularyLists([...foundedVocabs, data]);
                    setEditData({name: '', categoryId: selectedCategory.id});
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
