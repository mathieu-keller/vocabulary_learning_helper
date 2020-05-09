import React from 'react';
import {AppBar, Tab, Tabs, Toolbar} from '@material-ui/core';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {AccountCircle, Home, Translate} from "@material-ui/icons";
import classes from './NavigationBar.module.scss';
import {useStore} from "../../../store/store";

const NavigationBar = (props: RouteComponentProps): JSX.Element => {
    const store = useStore()[0];
    const accountTab = store.user?.isLogin ? <Tab label={"Profile"} icon={<AccountCircle/>} value={'/profile'}/> :
        <Tab label={"Login"} icon={<AccountCircle/>} value={'/login'}/>;
    const vocabularyTab = store.user?.isLogin ?
        <Tab label="vocabulary" icon={<Translate/>} value={'/vocabulary'}/> : null;

    return (
        <AppBar position="static">
            <Toolbar>
                <Tabs className={classes.tabs} value={'/' + props.location.pathname.split('/', 2)[1]}
                      onChange={(e, v) => props.history.push(v)}>
                    <Tab label="Home" icon={<Home/>} value={'/'}/>
                    {vocabularyTab}
                    {accountTab}
                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

export default withRouter(NavigationBar);
