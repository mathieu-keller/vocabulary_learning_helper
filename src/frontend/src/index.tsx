import React, {lazy, Suspense} from 'react';
import '../public/App.scss';
import {render} from 'react-dom';
import {HashRouter} from "react-router-dom";
import {Skeleton} from "@material-ui/lab";
import {Provider} from "react-redux";
import store from "./store";

const App = lazy(() => import('./App'));

render(
    <React.StrictMode>
        <HashRouter>
            <Provider store={store}>
                <Suspense fallback={
                    <Skeleton variant="rect" height={window.innerHeight} animation="wave"/>
                }><App/></Suspense>
            </Provider>
        </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
