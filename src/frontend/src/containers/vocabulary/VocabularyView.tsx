import React, {useEffect, useState} from 'react';
import Grid from "../../components/UI/Grid";

type Vocab = {
    Id: string;
    German: string;
    Japanese: string;
    Kanji: string;
}

type GridData = {
    data: Vocab;
    edit?: boolean;
}

const VocabularyView = (): JSX.Element => {
    const [vocabs, setVocabs] = useState<GridData[]>([]);
    useEffect(() => {
        fetch('/vocab/').then((r: Response) => r.json().then((j: Vocab[]) => setVocabs(j.map(data => ({data: data})))))
    }, [])
    return (<Grid<GridData>
        id='Id'
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