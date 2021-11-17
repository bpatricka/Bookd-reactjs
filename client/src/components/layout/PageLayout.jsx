/*
 * Copyright (c) Book'd. All rights reserved.
 * Licensed under the GNU License.
 */

import React, { useContext, useEffect, useRef } from "react";
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
    const audRef = useRef();
    const vidRef = useRef();
    const prntRef = useRef();
    const navigate = useNavigate();

    function handleANav(e){
        console.log(e.target.id);
        navigate(`/media/${e.target.id}`);
    }

    function handlePNav(e){
        navigate(`/media/${e.target.id}`);
    }

    function handleVNav(e){
        navigate(`/media/${e.target.id}`);
    }

    if(userCtx.role === 'admin'){
        content = <NavDropdown.Item><Link to='/admin' className={classes.ddnavitems}>Admin</Link></NavDropdown.Item>;
    }
    else{
        content = <NavDropdown.Item></NavDropdown.Item>;
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
                            <NavLink ref={audRef} id='audio' onClick={(event) => handleANav(event)} className={classes.navitems}>Audio</NavLink>
                            <NavLink ref={prntRef} id='print' onClick={(event) => handlePNav(event)} className={classes.navitems}>Print</NavLink>
                            <NavLink ref={vidRef} id='video' onClick={(event) => handleVNav(event)} className={classes.navitems}>Video</NavLink>
                        </Nav>
                    <Nav>
                        <Badge variant='pill' style={{display: 'flex', zIndex:'33'}}>{rentalsCtx.rentals.length}</Badge>
                        <NavDropdown title="My Account" id="collasible-nav-dropdown">
                            <NavDropdown.Item><Link to='/account' className={classes.ddnavitems}>Account<Badge style={{zIndex:'33'}}><span style={{color: '#333' }}>{rentalsCtx.rentals.length}</span></Badge></Link></NavDropdown.Item>
                            {content}
                            <NavDropdown.Divider />
                            <NavDropdown.Item><SignOutButton /></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                </Container>
                :
                <Container>
                    <div style={{height: '40px'}}></div>
                </Container>
            }
            </Navbar>
            {props.children}
        </>
    );
};
