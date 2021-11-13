import { useEffect, useState, useContext } from "react";
import UserContext from "../../store/user-context";
import HomepageData from "./HomepageData";
import classes from './HPC.module.css';

export const HomepageContent = () => {
const userCtx = useContext(UserContext);
    return (
        <>
            <div className={classes.hpwrapper}>
                <h5 className={classes.wbanner}>Welcome {userCtx.username}</h5>
                <HomepageData />
            </div>
        </>
    );
};

export default HomepageContent;