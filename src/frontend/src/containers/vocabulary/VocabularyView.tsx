import React, {useEffect, useMemo, useState} from 'react';
import Grid from "../../components/ui/grid/Grid";
import {deleteCall, get, post} from "../../utility/restCaller";
import VocabularyEditModal from "../../components/ui/modal/VocabularyEditModal";
import {RouteComponentProps} from "react-router-dom";
import {Paper} from "@material-ui/core";
import {useSelector} from "react-redux";
import {AppStore} from "../../store/store.types";

export type VocabularyValue = {
  key: string;
  values: (string[]) | null;
}

export type Vocab = {
  id?: string;
  listId: string;
  values: VocabularyValue[];
}

const VocabularyView = (props: RouteComponentProps<{ user: string; category: string; listId: string }>): JSX.Element => {
  document.title = 'Trainer - Vocabulary';
  const listId = props.match.params.listId;
  const [columns, setColumns] = useState<string[]>([]);
  const emptyEditData = {values: columns.map(column => ({key: column, values: []})), listId: listId};
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [editData, setEditData] = useState<Vocab>(emptyEditData);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const selectedCategory = useSelector((store: AppStore) => store.user.selectedCategory);
  useEffect(() => {
    get<Vocab[]>(`/vocabulary/${listId}`)
      .then(r => {
        if (typeof r !== 'string') {
          setVocabs(r);
        }
      });
  }, [listId]);

  useEffect(() => {
    if (selectedCategory.id) {
      setColumns(selectedCategory.columns);
    }
  }, [selectedCategory]);

  const grid = useMemo(() => {
    const deleteHandler = (data: Vocab): void => {
      deleteCall<Vocab, Vocab>('/vocabulary', data)
        .then(r => {
          if (typeof r !== 'string') {
            setVocabs(vocabs.filter(vocab => vocab.id !== r.id));
          }
        });
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
    if (!showEditModal) {
      return null;
    }
    const cancelHandler = (): void => {
      setEditData(emptyEditData);
      setShowEditModal(false);
    };
    const saveHandler = async (data: Vocab): Promise<void> => {
      post<Vocab, Vocab>('/vocabulary', data)
        .then(r => {
          if (typeof r !== 'string') {
            const foundedVocabs = vocabs.filter(vocab => vocab.id).filter(vocab => vocab.id !== r.id);
            setVocabs([...foundedVocabs, r]);
            setEditData(emptyEditData);
          }
        });
    };
    return (<VocabularyEditModal
      cancelHandler={cancelHandler}
      saveHandler={saveHandler}
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
