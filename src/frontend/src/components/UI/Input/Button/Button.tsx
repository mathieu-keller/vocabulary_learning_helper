import React from 'react';
import classes from './Button.module.scss';
import {faCheck, faWindowClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => (
    <button {...props}/>
);

export const SubmitButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => (
    <Button className={classes.submit} {...props}><FontAwesomeIcon icon={faCheck}/> Submit</Button>
);

export const CancelButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => (
    <Button className={classes.cancel} {...props}><FontAwesomeIcon icon={faWindowClose}/> Cancel</Button>
);
