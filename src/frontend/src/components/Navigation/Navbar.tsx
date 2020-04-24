import React from 'react';
import {Link} from "react-router-dom";

export default (): JSX.Element => {
    return (
        <ul id="menu-bar">
            <li><Link className="link" to='/'>Home</Link></li>
            <li><Link className="link" to='/vocabulary'>Vocabulary</Link>
            </li>
        </ul>
    );
};
