import React, {useState} from 'react';
import {RouteComponentProps} from "react-router-dom";
import {useDispatch} from "react-redux";
import {userActionFunctions} from "../../actions/user";
import {Button, Grid, Paper, TextField} from "@material-ui/core";
import classes from "./Login.module.scss";
import {ErrorMessage, Formik} from "formik";
import {post} from "../../utility/restCaller";
import {Lock, Person} from "@material-ui/icons";

const LoginView = (props: RouteComponentProps): JSX.Element => {
    document.title = 'Trainer - Login';
    const [restError, setRestError] = useState<string>('');
    const dispatch = useDispatch();
    const errorMessage = (msg: string): JSX.Element => <p style={{color: 'red', margin: 0}}>{msg}</p>;
    return (
        <Paper className={classes.paper}>
            <Formik
                initialValues={{username: '', password: ''}}
                validate={values => {
                    const errors: { username?: string; password?: string } = {};
                    if (!values.username) {
                        errors.username = 'Required';
                    }
                    if (!values.password) {
                        errors.password = 'Required';
                    }
                    return errors;
                }}
                onSubmit={(values, {setSubmitting}) => {
                    setSubmitting(true);
                    post<{ username: string; password: string }, { login: boolean }>('/login', values, 200)
                        .then(response => {
                            if ((response as { login: boolean }).login) {
                                props.history.push("/");
                                dispatch(userActionFunctions.login());
                            } else if (typeof response === 'string') {
                                setRestError(response);
                            }
                        }).catch(setRestError)
                        .finally(() => setSubmitting(false));
                }}
            >
                {({
                      values,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting
                  }) => (
                    <form onSubmit={handleSubmit}>
                        {restError ? <p style={{justifyContent: 'center', display: 'flex', color: 'red'}}>{restError}</p> : null}
                        <Grid className={classes.login} container spacing={8} alignItems="stretch">
                            <Grid item style={{alignItems: 'center', display: 'flex'}}>
                                <Person/>
                            </Grid>
                            <Grid item md={true} sm={true} xs={true}>
                                <TextField label="Username"
                                           type="text"
                                           onChange={handleChange}
                                           name='username'
                                           onBlur={handleBlur}
                                           value={values.username} fullWidth autoFocus required autoComplete='username'/>
                                <ErrorMessage render={errorMessage} name="username"/>
                            </Grid>
                        </Grid>
                        <Grid className={classes.login} container spacing={8} alignItems="stretch">
                            <Grid item style={{alignItems: 'center', display: 'flex'}}>
                                <Lock/>
                            </Grid>
                            <Grid item md={true} sm={true} xs={true}>
                                <TextField label="Password"
                                           type="password"
                                           name='password'
                                           onBlur={handleBlur}
                                           onChange={handleChange}
                                           value={values.password} fullWidth required autoComplete='current-password'/>
                                <ErrorMessage render={errorMessage} name="password"/>
                            </Grid>
                        </Grid>
                        <Grid container justify="center" className={classes.buttonContainer}>
                            <Button type='submit' disabled={isSubmitting} className={classes.button} variant="contained"
                                    color="primary">Login</Button>
                        </Grid>
                    </form>
                )}
            </Formik>

        </Paper>
    );
};

export default LoginView;
