import React, {useEffect, useState} from 'react';
import './App.css';

type Vocab = {
    German: string;
    Japanese: string;
    Kanji: string;
}

const App = (): JSX.Element => {
    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    useEffect(() => {
        fetch('/vocab/').then(r => r.json().then(j => setVocabs(j)))
    }, [])
    const renderVocabs = (): JSX.Element[] => vocabs.map((vocab, i) => <li
        key={i}>{vocab.German},{vocab.Japanese},{vocab.Kanji}</li>)
    return (
        <>{renderVocabs()}</>
    );
};
export default App;