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
    const setEditHandler = (data: Vocab): void => {
        setEditData({new: data, old: data});
    };
    const cancelEdit = (data: Vocab): void => {
        setEditData(undefined);
        if(!data.Id){
            const filteredVocabs = vocabs.filter(vocab=> vocab.Id);
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
    const addVocab = (): void => {
        const emptyVocab = {German: '', Japanese: '', Kanji: ''};
        setVocabs([...vocabs, emptyVocab]);
        setEditData({
            new: emptyVocab,
            old: emptyVocab
        });
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
                const foundedVocab = vocabs.find(vocab => vocab.Id === undefined || vocab.Id === j.Id);
                if (foundedVocab) {
                    foundedVocab.German = j.German;
                    foundedVocab.Japanese = j.Japanese;
                    foundedVocab.Kanji = j.Kanji;
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
        add={addVocab}
        editData={editData}
        cancelEditRow={cancelEdit}
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
