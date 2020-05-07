import React from 'react';
import {Button, Grid, Paper} from "@material-ui/core";
import classes from "./Profile.module.scss";

type ProfileType = {
    logoutHandler: () => void;
}

const Profile = ({logoutHandler}: ProfileType) => {
    return (
        <Paper className={classes.paper}>
            <Grid container justify="center" className={classes.buttonContainer}>
                <Button onClick={logoutHandler} className={classes.button} variant="contained"
                        color="primary">Logout</Button>
            </Grid>
        </Paper>
    );
};

export default Profile;
