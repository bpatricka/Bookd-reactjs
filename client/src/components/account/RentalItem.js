import classes from './RentalItem.module.css';
import { Card, Button, Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import CountDownTimer from './CountDownTimer';
import MediaRender from './MediaRender';
import { Link } from 'react-router-dom';

export const RentalItem = (props) => {
    let n = Date.parse(new Date()); //attach time when rented
    //logic here for image retrieval and time left calculation
    return (
        <Card>
            <ul className={classes.rcontainer}>
                <li>
                    <img className={classes.rcontainerimg} src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Cat_yawning_in_park.jpg/640px-Cat_yawning_in_park.jpg'></img>
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
                    <p>Time Left</p>
                    <div>
                        <CountDownTimer 
                            media_key={props.media_key}
                            media_id={props.media_id}
                            rented={props.rentdate} 
                            due={props.returndate}
                        />
                    </div>
                </li>
                <li>
                    
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