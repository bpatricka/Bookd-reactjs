import { useCallback, useEffect, useState, useContext } from "react";

import MediaList from "../components/media/MediaList";

import RentalsContext from "../store/rentals-context";
import UserContext from "../store/user-context";
import SearchContext from "../store/search-context";

import classes from "./AllMediaPage.module.css";

import { Navigate } from 'react-router-dom';
import { InputGroup, FormControl } from 'react-bootstrap';



function AllMediaPage() {
    const [srch, setSearch] = useState("");
    const [media, setMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const userCtx = useContext(UserContext);
    const rentalsCtx = useContext(RentalsContext);
    const searchCtx = useContext(SearchContext);
    let isMounted;

    //using a callback here for reactive search later
    const fetchMediaHandler = useCallback(async () => {
        isMounted = true;
        setIsLoading(true);
        setError(null);
        if (!searchCtx.search){}
        else {setSearch(searchCtx.search);}
        
        
        try {
            let url;
            if (srch === ' ' || srch === "" || srch === null || srch === 'undefined'){
                url = 'http://localhost:5000/media';
            } else {
                url = 'http://localhost:5000/media/'+srch
            }
            const response = await fetch(
                url
            );
            if (!response.ok) {
                throw new Error('Something went wrong.');
            }
            const data = await response.json();
            if (isMounted){
                let temp = [];
                for (const item in data) {
                    temp.push(data[item]);
                };
                setMedia(temp);
            }
            
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    },[rentalsCtx.rentals.length, srch]);

    content = <p style={{textAlign: 'center'}}>Just Wait a Moment...</p>

    if (media.length > 0) {
        content = <ul><MediaList mediaitems={media} /></ul>;
    } else if (error) {
        content = <p style={{textAlign: 'center'}}>{error}</p>;
    } else if (isLoading) {
        content = <p style={{textAlign: 'center'}}>Loading...</p>;
    } else if (media.length === 0){
        content = <p style={{textAlign: 'center'}}>No results found. Sorry :(</p>;
    }

    function handleChange(e){
        setSearch(e.target.value);
    }

    useEffect(() => {
        isMounted = true;
        let timer = setTimeout(() =>{
            fetchMediaHandler();
        }, 600);

    return () => {
        searchCtx.clearSearch();
        clearTimeout(timer);
        isMounted = false;
    }
    }, [srch, fetchMediaHandler]);
    
    return (
    <section>
        <h1 className={classes.ampheader}>Media</h1>
        <div style={{ padding: '10px'}} id='search-tbanner' className={classes.stbanner}>
            <InputGroup className={classes.msbar}>
                <FormControl
                    placeholder="Find something good..."
                    aria-label="search-bar"
                    aria-describedby="search-bar"
                    onChange={handleChange}
                />
            </InputGroup>
        </div>
        <section>{content}</section>
    </section>
)}   

export default AllMediaPage;