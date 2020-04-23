import React from 'react';
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";

const Home = (): JSX.Element => (
    <Card>
        <Card.Header as="h5">Featured</Card.Header>
        <Card.Body>
            <Card.Title>Special title treatment</Card.Title>
            <Card.Text>
                With supporting text below as a natural lead-in to additional content.
            </Card.Text>
            <Link className='btn btn-primary' to="/vocabulary">Go somewhere</Link>
        </Card.Body>
    </Card>
);

export default Home;