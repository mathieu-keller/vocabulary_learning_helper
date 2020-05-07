import React from 'react';
import {render} from 'react-dom';
import App from './App';
import {HashRouter} from "react-router-dom";
import configureUserStore from './store/configureUserStore';

configureUserStore();
render(
    <React.StrictMode>
        <HashRouter>
            <App/>
        </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
