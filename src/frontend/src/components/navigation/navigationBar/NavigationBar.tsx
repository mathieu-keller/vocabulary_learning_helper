import React from 'react';
import {AppBar, Tab, Tabs, Toolbar} from '@material-ui/core';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {AccountCircle, Home, School, Translate} from "@material-ui/icons";
import classes from './NavigationBar.module.scss';
import {useSelector} from "react-redux";
import {AppStore} from "../../../store/store.types";

const NavigationBar = (props: RouteComponentProps): JSX.Element => {
    const isLogin = useSelector((store: AppStore) => store.user.isLogin);
    let tabs;
    if (isLogin) {
        tabs = (
            <Tabs className={classes.tabs} value={'/' + props.location.pathname.split('/', 2)[1]}
                  onChange={(e, v) => props.history.push(v)}>
                <Tab label="Home" icon={<Home/>} value={'/'}/>
                <Tab label="Vocabulary" icon={<Translate/>} value={'/vocabulary'}/>
                <Tab label="Learn" icon={<School/>} value={'/learn'}/>
                <Tab label="Profile" icon={<AccountCircle/>} value={'/profile'}/>
            </Tabs>
        );
    } else {
        tabs = (
            <Tabs className={classes.tabs} value={'/' + props.location.pathname.split('/', 2)[1]}
                  onChange={(e, v) => props.history.push(v)}>
                <Tab label="Home" icon={<Home/>} value={'/'}/>
                <Tab label="Learn" icon={<School/>} value={'/learn'}/>
                <Tab label="Login" icon={<AccountCircle/>} value={'/login'}/>
            </Tabs>
        );
    }
    return (
        <AppBar position="static">
            <Toolbar>
                {tabs}
            </Toolbar>
        </AppBar>
    );
};

export default withRouter(NavigationBar);
