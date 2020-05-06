import React from 'react';
import {AppBar, Tab, Tabs, Toolbar} from '@material-ui/core';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {AccountCircle, Home, Translate} from "@material-ui/icons";
import classes from './Navbar.module.scss';

const Navbar = (props: RouteComponentProps): JSX.Element => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Tabs className={classes.tabs} value={props.location.pathname}
                      onChange={(e, v) => props.history.push(v)}>
                    <Tab label="Home" icon={<Home/>} value={'/'}/>
                    <Tab label="vocabulary" icon={<Translate/>} value={'/vocabulary'}/>
                    <Tab label="login" icon={<AccountCircle/>} value={'/login'}/>
                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

export default withRouter(Navbar);
