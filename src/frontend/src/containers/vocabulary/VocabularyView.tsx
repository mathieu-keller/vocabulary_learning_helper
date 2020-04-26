import React, {useEffect, useState} from 'react';
import Grid from "../../components/UI/Grid/Grid";

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
        fetch('/vocab/')
            .then((r: Response) => {
                r.json().then((j: Vocab[]) => setVocabs(j));
            });
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
            fetch('/vocab/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editData.new)
            }).then(r => r.json().then((j: Vocab) => {
                const foundedVocabs = vocabs.filter(vocab => vocab.Id).filter(vocab => vocab.Id !== j.Id);
                setVocabs([...foundedVocabs, j]);
                setEditData(undefined);
            }));
        }
    };

    const deleteHandler = (data: Vocab): void => {
        fetch('/vocab/', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((r) => {
            if (r.status === 200) {
                r.json().then(id => {
                    const filteredVocabs = vocabs.filter(vocab => vocab.Id !== id);
                    setVocabs(filteredVocabs);
                });
            }
        });
    };


    return (<Grid<Vocab>
        id='Id'
        editData={editData}
        addRowHandler={addRowHandler}
        cancelHandler={cancelHandler}
        onChangeHandler={onChangeHandler}
        setEditHander={setEditHandler}
        saveHandler={saveHandler}
        deleteHandler={deleteHandler}
        columns={[
            {title: '#', field: 'edit', width: '48px'},
            {title: 'German', field: 'German', width: 'calc(33% - 48px)'},
            {title: 'Japanese', field: 'Japanese', width: 'calc(33% - 48px)'},
            {title: 'Kanji', field: 'Kanji', width: 'calc(33% - 48px)'}
        ]}
        data={vocabs}
    />);
};

export default VocabularyView;
