import MediaItem from './MediaItem';
import classes from './MediaList.module.css';

function MediaList(props) {
    return (
    <ul className={classes.medialist}>
        {props.mediaitems.map((media) => (
            <MediaItem 
                key={media.id} 
                id={media.id} 
                image={media.image}
                title={media.title}
                copies={media.copies}
                description={media.description}
            />
    ))}
    </ul>
)}

export default MediaList;