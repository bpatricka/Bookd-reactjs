import { HomepageContent } from "../components/home/HomepageContent";
import { useMsal } from "@azure/msal-react";
import UserContext from "../store/user-context";
import React, { useContext, useEffect } from "react";
import classes from './HomePage.module.css';

function HomePage() {
    const userCtx = useContext(UserContext);
    return (
    <div className={classes.homeimg}>
        <div className={classes.homecontent}>
            <div className={classes.hboverlay}>
                <HomepageContent />
            </div>
        </div>
    </div>
    )
}

export default HomePage;