import { useCallback, useContext, useEffect, useRef, useState } from "react";
import RentalsContext from "../../store/rentals-context";
import classes from './MediaRender.module.css';

export const MediaRender = (props) =>{ 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rdata, setData] = useState(null);
    const [mediaType, setMType] = useState(null);
    const [aktiv, setActive] = useState('none');
    const accordRef = useRef();
    const rentalsCtx = useContext(RentalsContext);

    
    /// we want to..... display media 
    // how... request media data from backend
    // then, render the media

    console.log(props);




    useEffect(()=>{
        if (!props.media_key){
            rentalsCtx.getCurrent();
        }
        // try {
        //     const response = await fetch(
        //         'http://localhost:5000/account/rental/'+props.media_key
        //     );
        // //err
        // } catch(error){
        //     console.log(setError(error.message));
        // }

        // if (!response.ok){
        //     throw new Error('Something went terribly wrong.');
        // }

        // const data = await response.json();

        return () => {
        }
    },[]);

    function handleViewToggle(){
        if (aktiv === 'block'){
            setActive('none');
        } else if (aktiv === 'none') {
            setActive('block');
        }
    }

    return (
        
        <div id='media-card'>
            <button onClick={handleViewToggle} className={classes.accordion}>View Media</button>
            <div className={classes.panel} style={{display: aktiv}} ref={accordRef} id='media-body'>
                <span>

                </span>
                <ul className={classes.mediadetails} >
                    <li className={classes.mediadeetsitems}>
                        {props.title}
                    </li>
                    <li className={classes.mediadeetsitems}>
                        {props.description}
                    </li>
                    <li className={classes.mediadeetsitems}>
                        {props.c_name}
                    </li>
                    <li className={classes.mediadeetsitems}>
                        {props.p_name}
                    </li>
                    <li className={classes.mediadeetsitems}>
                        {props.returndate}
                    </li>
                    <li className={classes.mediadeetsitems}>
                        {props.rentdate}
                    </li>
                    <li className={classes.mediadeetsitems}>
                        {props.copies}
                    </li>
                </ul>
                <span id='footer'>
                    Footer
                </span>
            </div>
        </div>
    )
}

export default MediaRender;