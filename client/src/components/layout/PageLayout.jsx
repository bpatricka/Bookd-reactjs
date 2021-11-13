/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { Link } from "react-router-dom";
import { NavDropdown, Nav, Container, Navbar, Form, FormControl, Button } from "react-bootstrap";
import classes from "./PageLayout.module.css";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "../SignInButton";
import { SignOutButton } from "../SignOutButton";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props 
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                {isAuthenticated ? 
                <Container>
                <Navbar.Brand><Link to='/' className={classes.brand}>Book'd</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Link to='/media' className={classes.navitems}>Audio</Link>
                            <Link to='/media' className={classes.navitems}>Print</Link>
                            <Link to='/media' className={classes.navitems}>Video</Link>
                        </Nav>
                    <Nav>
                        <NavDropdown title="My Account" id="collasible-nav-dropdown">
                            <NavDropdown.Item><Link to='/account' className={classes.ddnavitems}>Account</Link></NavDropdown.Item>
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
