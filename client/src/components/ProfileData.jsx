import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { Card } from "react-bootstrap";
import UserContext from "../store/user-context";
import classes from "./ProfileData.module.css";

/**
 * Renders information about the user obtained from MS Graph
 * @param props 
 */
export const ProfileData = (props) => {
    const [loading, setLoading] = useState(false);
    const [prentalCount, setpRentalCount] = useState(null);
    const [prCount, setprCount] = useState('0');
    const userCtx = useContext(UserContext);

    useEffect(() =>{
        setLoading(true);
        let isMounted = true;

        fetch(
            "http://localhost:5000/prof/"+userCtx.mail
        )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(isMounted){
                setprCount(data.length);
            } 
        });
        
        setLoading(false);
        return () => {
            let isMounted = false;
        }
    },[]);

    if (loading){
        content = <p>Loading...</p>
    }
    else { 
        content =
        <div className={classes.profpanel}>
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
                        <p className={classes.myrentct}>{prCount}</p>
                    </li>
                </ul>
            </div>
    }
    
    return (
        <div id="p-div">
            {content}
        </div>
    );
};