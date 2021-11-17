import { HomepageContent } from "../components/home/HomepageContent";
import { useMsal } from "@azure/msal-react";
import UserContext from "../store/user-context";
import React, { useContext, useEffect } from "react";
import classes from './HomePage.module.css';

function HomePage() {
    const userCtx = useContext(UserContext);
    return (
    <div className={classes.homeimg}>
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', }}>
            <div className={classes.homecontent}>
                    <HomepageContent />
            </div>
        </div>
    </div>
    )
}

export default HomePage;