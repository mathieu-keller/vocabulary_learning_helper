import React from 'react';
import {Button, Grid, Paper, TextField} from "@material-ui/core";
import {Lock, Person} from "@material-ui/icons";
import classes from './Login.module.scss';

type LoginProps = {
    loginData: { userName: string; password: string };
    onChange: (field: 'userName' | 'password', value: string) => void;
    onSubmit: () => void;
};

const Login = ({loginData, onChange, onSubmit}: LoginProps): JSX.Element => {
    return (
        <Paper className={classes.paper}>
            <Grid className={classes.login} container spacing={8} alignItems="flex-end">
                <Grid item>
                    <Person/>
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                    <TextField label="Username" type="text" onChange={(e) => onChange('userName', e.target.value)}
                               value={loginData.userName} fullWidth autoFocus required/>
                </Grid>
            </Grid>
            <Grid className={classes.login} container spacing={8} alignItems="flex-end">
                <Grid item>
                    <Lock/>
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                    <TextField label="Password" type="password" onChange={(e) => onChange('password', e.target.value)}
                               value={loginData.password} fullWidth required/>
                </Grid>
            </Grid>
            <Grid container justify="center" className={classes.buttonContainer}>
                <Button onClick={onSubmit} className={classes.button} variant="contained" color="primary">Login</Button>
            </Grid>
        </Paper>
    );
};

export default Login;
