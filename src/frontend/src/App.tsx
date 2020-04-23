import React from 'react';
import VocabularyView from "./containers/vocabulary/VocabularyView";
import {Route, Switch} from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navigation/Navbar";

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