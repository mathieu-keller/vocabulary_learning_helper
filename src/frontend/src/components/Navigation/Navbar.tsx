import React from 'react';
import {Link} from "react-router-dom";
import classes from './Navbar.module.scss';

export default (): JSX.Element => {
    return (
        <ul className={classes.menuBar}>
            <li><Link className={classes.link} to='/'>Home</Link></li>
            <li><Link className={classes.link} to='/vocabulary'>Vocabulary</Link></li>
        </ul>
    );
};
