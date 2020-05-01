import React from 'react';
import classes from './Button.module.scss';

export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => (
    <button {...props}/>
);

export const SubmitButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => (
    <Button className={classes.submit} {...props}> Submit</Button>
);

export const CancelButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => (
    <Button className={classes.cancel} {...props}>Cancel</Button>
);
