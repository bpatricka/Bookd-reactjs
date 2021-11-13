import MediaItem from './MediaItem';
import classes from './MediaList.module.css';

function MediaList(props) {
    return (
    <ul className={classes.medialist}>
        {props.mediaitems.map((media) => (
            <MediaItem 
                key={media.media_key} 
                media_id={media.media_id} 
                media_key={media.media_key}
                image={media.image}
                title={media.title}
                author={media.author}
                category={media.category}
                m_type={media.m_type}
                c_name={media.course_name}
                d_name={media.dept_name}
                p_name={media.fname+' '+media.lname}
                copies={media.copies}
                description={media.description}
                published={media.publishedDate}
                publisher={media.publisher}
            />
    ))}
    </ul>
)}

export default MediaList;