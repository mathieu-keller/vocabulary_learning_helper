import React from 'react';
import classes from "./Input.module.scss";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>): JSX.Element => {
    return (
        <div className={classes.box}>
            <label className={classes.label}>{props.title}:</label>
            <br/>
            <input className={classes.input} {...props}/>
        </div>
    );
};

export default Input;
