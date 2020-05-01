import React from 'react';
import {AppBar, Tab, Tabs, Toolbar, Typography} from '@material-ui/core';
import {RouteComponentProps, withRouter} from 'react-router-dom';

const Navbar = (props: RouteComponentProps): JSX.Element => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Japanese learning helper
                </Typography>
                <Tabs value={props.location.pathname} onChange={(e,v)=>props.history.push(v)}>
                    <Tab label="Home" value={'/'}/>
                    <Tab label="vocabulary" value={'/vocabulary'}/>
                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

export default withRouter(Navbar);
