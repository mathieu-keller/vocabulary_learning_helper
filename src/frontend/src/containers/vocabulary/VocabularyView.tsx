import React, {useEffect, useState} from 'react';
import Grid from "../../components/UI/Grid/Grid";

type Vocab = {
    Id: string;
    German: string;
    Japanese: string;
    Kanji: string;
}

const VocabularyView = (): JSX.Element => {
    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    const [editData, setEditData] = useState<{ new: Vocab; old: Vocab }>();
    const setEditHandler = (data: Vocab | null): void => {
        if (data) {
            setEditData({new: data, old: data});
        } else {
            setEditData(undefined);
        }
    };
    const onChangeHandler = (field: string, value: string): void => {
        if (editData) {
            const newEditData: { [k: string]: string } = {...editData.new};
            newEditData[field] = value;
            setEditData({new: newEditData as Vocab, old: editData.old});
        }
    };
    const saveChanges = (): void => {
        if (editData) {
            fetch('/vocab/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editData.new)
            }).then(r => r.json().then((j: Vocab) => {
                const foundedVocab = vocabs.find(vocab => vocab.Id === j.Id);
                if (foundedVocab) {
                    foundedVocab.German = j.German;
                    foundedVocab.Japanese = j.Japanese;
                    foundedVocab.Kanji = j.Kanji;
                } else {
                    vocabs.push(j);
                }
                setVocabs(vocabs);
                setEditData(undefined);
            }));
        }
    };
    useEffect(() => {
        fetch('/vocab/')
            .then((r: Response) => {
                r.json().then((j: Vocab[]) => setVocabs(j));
            });
    }, []);
    return (<Grid<Vocab>
        id='Id'
        editData={editData}
        onChange={onChangeHandler}
        editRow={setEditHandler}
        saveChanges={saveChanges}
        columns={[
            {title: '#', field: 'edit', width: '150px'},
            {title: 'German', field: 'German'},
            {title: 'Japanese', field: 'Japanese'},
            {title: 'Kanji', field: 'Kanji'}
        ]}
        data={vocabs}
    />);
};

export default VocabularyView;
