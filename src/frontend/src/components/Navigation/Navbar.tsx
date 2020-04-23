import React from 'react';
import {Button, Form, FormControl, Nav, Navbar as BtNavbar} from "react-bootstrap";
import {Link} from "react-router-dom";

const Navbar = (): JSX.Element => (
    <BtNavbar bg="primary" variant="dark">
        <Link className='navbar-brand' to="/">Navbar</Link>
        <Nav className="mr-auto">
            <Link className='nav-link' to="/">Home</Link>
            <Link className='nav-link' to="/vocabulary">Vocabulary</Link>
        </Nav>
        <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
            <Button variant="outline-light">Search</Button>
        </Form>
    </BtNavbar>
);

export default Navbar;