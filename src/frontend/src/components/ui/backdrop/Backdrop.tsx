import React from 'react';
import classes from './Backdrop.module.scss';

type BackdropProps = {
    show: boolean;
    onClick?: () => void;
}

const Backdrop = ({show, onClick}: BackdropProps): JSX.Element | null => (
    show ? <div className={classes.Backdrop} onClick={onClick}/> : null
);

export default Backdrop;
