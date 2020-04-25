import React from 'react';
import Navbar from "./components/Navigation/Navbar";
import {Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import '../public/App';
import VocabularyView from './containers/vocabulary/VocabularyView';

const App = (): JSX.Element => {
    return (
        <>
            <Navbar/>
            <Switch>
                <Route path='/vocabulary' component={VocabularyView}/>
                <Route path='/' component={Home} exact/>
            </Switch>
        </>);
};
export default App;
