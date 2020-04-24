import React from 'react';
import VocabularyView from "./containers/vocabulary/VocabularyView";
import Home from "./components/Home";
import Navbar from "./components/Navigation/Navbar";
import { Route, Switch } from 'react-router-dom';

const App = (): JSX.Element => {
    return (
        <>
            <Navbar />
            <Switch>
                <Route path='/vocabulary' component={VocabularyView}/>
                <Route path='/' component={Home} exact/>
            </Switch>
        </>);
};
export default App;