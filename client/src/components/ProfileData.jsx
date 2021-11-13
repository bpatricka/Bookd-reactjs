import React from "react";
import { useContext } from "react";
import { Card } from "react-bootstrap";
import UserContext from "../store/user-context";
import classes from "./ProfileData.module.css";

/**
 * Renders information about the user obtained from MS Graph
 * @param props 
 */
export const ProfileData = (props) => {
    const userCtx = useContext(UserContext);
    return (
        <div id="p-div">
            <Card className={classes.profpanel}>
                <ul className={classes.profilewrapper}>
                    <li className={classes.profilepic}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sleeping_cat_on_her_back.jpg/640px-Sleeping_cat_on_her_back.jpg" alt="" />
                    </li>
                    <li className={classes.profiletext}>
                        <p><strong>Username: </strong> {userCtx.mail.split('@')[0]}</p>
                        <p><strong>Name: </strong> {userCtx.gName}</p>
                        <p><strong>Email: </strong> {userCtx.mail}</p>
                        <p><strong>Id: </strong> {userCtx.id}</p>
                    </li>
                    <li className={classes.myrentwrap}>
                        <p><strong>Rentals Made</strong></p>
                        <p className={classes.myrentct}>4</p>
                    </li>
                </ul>
            </Card>
        </div>
    );
};