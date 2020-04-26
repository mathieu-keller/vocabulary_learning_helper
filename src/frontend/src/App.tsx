import React, {lazy, Suspense} from 'react';
import Navbar from "./components/Navigation/Navbar";
import {Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import '../public/App';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const VocabularyView = lazy(() => import('./containers/vocabulary/VocabularyView'));

const App = (): JSX.Element => {
    return (
        <>
            <ToastContainer/>
            <Navbar/>
            <Switch>
                <Route path='/vocabulary'
                       render={() => <Suspense fallback={<div>Loading..</div>}><VocabularyView/></Suspense>} exact/>
                <Route path='/' component={Home}/>
            </Switch>
        </>);
};
export default App;
