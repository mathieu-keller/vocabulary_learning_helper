import React, {useEffect, useState} from 'react';
import Grid from "../../components/UI/Grid";

type Vocab = {
    Id: string;
    German: string;
    Japanese: string;
    Kanji: string;
}

const VocabularyView = (): JSX.Element => {
    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    useEffect(() => {
        fetch('/vocab/').then(r => r.json().then((j) => setVocabs(j)))
    }, [])
    return (<Grid<Vocab>
        columns={[
            {title: 'German', field: 'German'},
            {title: 'Japanese', field: 'Japanese'},
            {title: 'Kanji', field: 'Kanji'}
        ]}
        data={vocabs}
    />);
};

export default VocabularyView;