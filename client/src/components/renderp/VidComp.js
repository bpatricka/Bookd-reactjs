import { Player } from 'video-react';
import classes from './VidComp.module.css';

export const VidComp = (props) => {
    const url = 'http://localhost:5000/account/rental/'+props.media_key

    return (
        <div className={classes.vmain}>
            <Player 
                playsInline
                src={url}
            />
        </div>
    );
}

export default VidComp;