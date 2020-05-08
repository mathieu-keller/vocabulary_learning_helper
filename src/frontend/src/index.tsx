import React, {lazy, Suspense} from 'react';
import {render} from 'react-dom';
import {HashRouter} from "react-router-dom";
import configureUserStore from './store/configureUserStore';
import {Skeleton} from "@material-ui/lab";

const App = lazy(() => import('./App'));

configureUserStore();
render(
    <React.StrictMode>
        <HashRouter>
            <Suspense fallback={
                <Skeleton variant="rect" height={window.innerHeight} animation="wave"/>
            }><App/></Suspense>
        </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
