import React, {useEffect, useState} from 'react';
import './App.css';
import Grid from "./components/UI/Grid";

type Vocab = {
    Id: string;
    German: string;
    Japanese: string;
    Kanji: string;
}

const App = (): JSX.Element => {
    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    useEffect(() => {
        fetch('/vocab/').then(r => r.json().then((j) => setVocabs(j)))
    }, [])
    return (
        <>
            <Grid<Vocab>
                columns={[
                    {name: 'German', field: 'German'},
                    {name: 'Japanese', field: 'Japanese'},
                    {name: 'Kanji', field: 'Kanji'}
                ]}
                data={vocabs}
            />
        </>
    );
};
export default App;