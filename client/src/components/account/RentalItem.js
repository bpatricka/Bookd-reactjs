import classes from './RentalItem.module.css';
import { Card, Button, Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import CountDownTimer from './CountDownTimer';
import MediaRender from './MediaRender';
import { Link } from 'react-router-dom';

export const RentalItem = (props) => {
    const[phimg, setPHImage] = useState(null);
    const[image, setImage] = useState(null);
    
    function checkImage(){
        if(props.m_type === 'PRINT'){
            setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Documents_icon_-_noun_project_5020.svg/640px-Documents_icon_-_noun_project_5020.svg.png');
            setPHImage('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Documents_icon_-_noun_project_5020_-_navy.svg/640px-Documents_icon_-_noun_project_5020_-_navy.svg.png')
        } else if(props.m_type === 'VIDEO'){
            setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Video_Camera_-_The_Noun_Project.svg/640px-Video_Camera_-_The_Noun_Project.svg.png');
            setPHImage('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Icons8_flat_video_call.svg/640px-Icons8_flat_video_call.svg.png');
        } else if(props.m_type === 'AUDIO'){
            setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Audio_Max_%2889635%29_-_The_Noun_Project.svg/640px-Audio_Max_%2889635%29_-_The_Noun_Project.svg.png');
            setPHImage('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Icons8_flat_speaker.svg/640px-Icons8_flat_speaker.svg.png');
        }
    }

    useEffect(() => {
        checkImage();
    },[]);

    return (
        <Card bg='secondary'>
            <ul className={classes.rcontainer} style={{ color: '#333', fontSize: '20px'}}>
                <li>
                    <img className={classes.rcontainerimg} src={phimg}></img>
                </li>
                <li>
                    <p>{props.title}</p>
                    <p>{props.author}</p>
                    <p>{props.publisher}</p>
                    <p>{props.course}</p>
                </li>
                <li>
                    <p>{props.description}</p>
                </li>
                <li>
                    <p style={{fontWeight: 'bold'}}>Time Left</p>
                    <div>
                        <CountDownTimer 
                            media_key={props.media_key}
                            media_id={props.media_id}
                            rented={props.rentdate} 
                            due={props.returndate}
                        />
                    </div>
                </li>
            </ul>
            <MediaRender 
                key={props.media_key} 
                media_id={props.media_id} 
                media_key={props.media_key}
                image={props.image}
                title={props.title}
                author={props.author}
                category={props.category}
                m_type={props.m_type}
                c_name={props.course_name}
                d_name={props.dept_name}
                p_name={props.fname+' '+props.lname}
                copies={props.copies}
                description={props.description}
                published={props.publishedDate}
                publisher={props.publisher}
                returndate={props.date_returned}
                rentdate={props.date_rented}
                />
        </Card>
    )
}

export default RentalItem;