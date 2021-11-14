import { useCallback, useContext, useEffect, useRef, useState } from "react";
import RentalsContext from "../../store/rentals-context";
import PdfComp from "../renderp/PdfComp";
import VidComp from "../renderp/VidComp";
import AudioComp from "../renderp/AudioComp";
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




    useEffect(()=>{
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

    if (props.m_type === 'PRINT'){
        content = <PdfComp media_key={props.media_key} />;
    } else if (props.m_type === 'AUDIO'){
        content = <AudioComp media_key={props.media_key} />;
    } else if (props.m_type) {
        content = <VidComp media_key={props.media_key} />;
    }


    return (
        
        <div className={classes.mediacard} id='media-card'>
            <button onClick={handleViewToggle} className={classes.accordion}>View Media</button>
            <div className={classes.panel} style={{display: aktiv}} ref={accordRef} id='media-body'>
                <span style={{display: aktiv}}>
                    {content}
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