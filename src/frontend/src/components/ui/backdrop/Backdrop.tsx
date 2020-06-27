import React from 'react';
import classes from './Backdrop.module.scss';

type BackdropProps = {
  onClick?: () => void;
}

const Backdrop = ({onClick}: BackdropProps): JSX.Element => (
  <div className={classes.Backdrop} onClick={onClick}/>
);

export default Backdrop;
