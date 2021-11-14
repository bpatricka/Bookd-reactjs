/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavDropdown, Nav, Container, Navbar, Form, FormControl, Button, Badge, NavLink } from "react-bootstrap";
import classes from "./PageLayout.module.css";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "../SignInButton";
import { SignOutButton } from "../SignOutButton";
import RentalsContext from "../../store/rentals-context";
import UserContext from '../../store/user-context';

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props 
 */
export const PageLayout = (props) => {
    const rentalsCtx = useContext(RentalsContext);
    const userCtx = useContext(UserContext);
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    //
    async function checkUserExists(){
        if (isAuthenticated) {
            fetch('http://localhost:5000/newuser/'+userCtx.mail)
                .then(response => response.json())
                .then((data) => {
                    //success or fail event
                    console.log(data);
                });
        }
    }

    useEffect(()=>{
        checkUserExists();
    }, []);


    function handleANav(event){
        console.log(event.target.id);
        navigate(`/media/${event.target.id}`);
    }

    function handlePNav(event){
        navigate(`/media/${event.target.id}`);
    }

    function handleVNav(event){
        navigate(`/media/${event.target.id}`);
    }

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                {isAuthenticated ? 
                <Container>
                <Navbar.Brand><Link to='/' className={classes.brand}>Book'd</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink id='audio' onClick={(event) => handleANav(event)} className={classes.navitems}>Audio</NavLink>
                            <NavLink id='print' onClick={(event) => handlePNav(event)} className={classes.navitems}>Print</NavLink>
                            <NavLink id='video' onClick={(event) => handleVNav(event)} className={classes.navitems}>Video</NavLink>
                        </Nav>
                    <Nav>
                        <Badge variant='pill' style={{display: 'flex', zIndex:'33'}}>{rentalsCtx.rentals.length}</Badge>
                        <NavDropdown title="My Account" id="collasible-nav-dropdown">
                            <NavDropdown.Item><Link to='/account' className={classes.ddnavitems}>Account<Badge style={{zIndex:'33'}}><span style={{color: '#333' }}>{rentalsCtx.rentals.length}</span></Badge></Link></NavDropdown.Item>
                            <NavDropdown.Item><Link to='/admin' className={classes.ddnavitems}>Admin</Link></NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item><SignOutButton /></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                </Container>
                :
                <Container>
                    <Navbar.Brand><Link to='/' className={classes.brand}>Book'd</Link></Navbar.Brand>
                </Container>
            }
            </Navbar>
            {props.children}
        </>
    );
};
