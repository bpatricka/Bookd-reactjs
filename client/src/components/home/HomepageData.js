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
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    const [srch, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const userCtx = useContext(UserContext);
    const searchCtx = useContext(SearchContext);
    const inputRef = useRef();
    const navigate = useNavigate();

    async function getProfData(){
        let isMounted = true;
        setLoading(true);
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken)
            .then((response) => {
                if(isMounted){
                    userCtx.getUsername(response.userPrincipalName.split('@')[0])
                    userCtx.getEmail(response.userPrincipalName)
                    userCtx.getUID(response.id)
                    userCtx.getGname(response.givenName+" "+response.surname) 
                }
            });
        });
        setLoading(false);
    }

    function handleChange(e){
        setSearch(inputRef.current.value);
        searchCtx.getSearch(inputRef.current.value);
    }

    function handleSubmit(e){
        navigate(`/media/${srch}`);
    }

    useEffect(() => {
        let isMounted = true;
        if (!graphData){
            getProfData();
        }
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
                <Link to={location => ({ ...location, pathname: "/courses" })} />

                <Button onClick={handleSubmit} variant="outline-secondary" id="button-addon2">
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