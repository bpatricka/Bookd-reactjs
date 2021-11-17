import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Button } from "react-bootstrap";

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.log(e);
        });
    }
    return (
        <Button style={{width: '150px',height: '50px', display: 'flex', justifyContent:'space-evenly', alignItems: 'center'}} variant="primary" onClick={() => handleLogin()}>Sign In<img style={{ width: '30px', height: '30px', border: '3px', borderColor: 'black'}} src={'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Windows_logo_-_2012.svg/640px-Windows_logo_-_2012.svg.png'}></img></Button>
    )
}