import { useContext, useEffect, useState, useRef } from "react";
import { Card, InputGroup, FormControl, Button } from "react-bootstrap"
import UserContext from "../../store/user-context";
import SearchContext from "../../store/search-context";
import classes from "./HPGData.module.css";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { callMsGraph } from "../../graph";
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import AllMediaPage from "../../pages/AllMediaPage";

const HomepageData = (props) => {
    const { accounts } = useMsal();
    const [srch, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const userCtx = useContext(UserContext);
    const searchCtx = useContext(SearchContext);
    const inputRef = useRef();
    const navigate = useNavigate();

    function handleChange(e){
        setSearch(inputRef.current.value);
        searchCtx.getSearch(inputRef.current.value);
    }

    function handleSubmit(e){
        navigate(`/media/${srch}`);
    }

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        if (userCtx.mail === null && isMounted){
            userCtx.getEmail(accounts[0].username);
            userCtx.getUID(accounts[0].localAccountId);
            userCtx.getGname(accounts[0].name.split(',')[1]+" "+accounts[0].name.split(',')[0]);
            userCtx.getUserDeets(accounts[0].username);
        }
        setLoading(false);
        return () => {
            isMounted = false;
        }
    }, []);

    if (loading){
        content = <p>Just wait a moment...</p>
    }
    else {
        content = 
        <label>
            <InputGroup className="mb-3">
                <FormControl
                    ref={inputRef}
                    id='main-search'
                    onChange={handleChange}
                    placeholder="Let's book it."
                    aria-label="search-area"
                    aria-describedby="main-search"
                />

                <Button onClick={handleSubmit} variant="outline-secondary" id="main-search">
                    Find it.
                </Button>
            </InputGroup>
        </label>
    }

    return (
        <div className={classes.homewrapper}>
            <div className={classes.mainsearch}>
                {content}
            </div>
        </div>
    )
}

export default HomepageData;