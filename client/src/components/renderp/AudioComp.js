import ReactAudioPlayer from 'react-audio-player';
import classes from './AudioComp.module.css';

export const AudioComp = (props) => {
    const url = 'http://localhost:5000/account/rental/'+props.media_key

    return (
        <div className={classes.amain}>
            <ReactAudioPlayer
                src={url}
                controls
            />
        </div>
    );
}

export default AudioComp;