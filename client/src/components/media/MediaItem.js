// import classes from './MediaItem.module.css';
import { useMsal } from '@azure/msal-react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';
import { useState, useContext, useEffect } from 'react';
import RentalsContext from "../../store/rentals-context";
import { addMinutes, formatDate, addHours, addDays } from '../utils/DateHelp';
import UserContext from '../../store/user-context';
import classes from './MediaItem.module.css';

export const MediaItem = (props) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [phimg, setPHImage] = useState(null);

    const rentalsCtx = useContext(RentalsContext);
    const userCtx = useContext(UserContext);

    const itemIsRented = rentalsCtx.itemIsRented(props.media_id);
    
    const { accounts } = useMsal();

    async function toggleRentStatusHandler(){
        setLoading(true);

        if (!itemIsRented) {
            await rentalsCtx.addRental({
                ...props,
                email: userCtx.mail
            });
        }
        setLoading(false);
    }

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

    useEffect(()=>{
        checkImage();
    },[]);

    let buttonText = itemIsRented ? "Rented" : "Book";
    
    if (loading) {
        buttonText = "Loading...";
    }

    if (props.copies !== 0 ) {
        return (
            <Card style={{ width: '18rem' }} className={classes.mediaitem}>
                <Card.Img variant="top" src={phimg} alt={props.title} style={{ padding: '70px'}} />
                <Card.Body>
                    <Card.Title 
                        className={classes.title}>
                            <img src={image} style={{width: '30px', height: '30px', paddingRight: '3px'}}></img>
                            {props.title}
                    </Card.Title>
                    <Card.Text>
                        {props.description}
                    </Card.Text>
                    {itemIsRented ?
                    <Button disabled variant="primary">{buttonText} <Badge pill bg="light" text='dark'>{props.copies}</Badge></Button>
                    :
                    <Button onClick={toggleRentStatusHandler} variant="primary">{buttonText} <Badge pill bg="light" text='dark'>{props.copies}</Badge></Button>
                    }
                </Card.Body>
            </Card>);
    } 
    else 
    return (
        <Card className={classes.mediaitem} style={{ width: '18rem' }}>
            <Card.Img className={classes.mediaimg} variant="top" src={phimg} alt={props.title} style={{ padding: '70px' }} />
            <Card.Body className={classes.cardbody}>
                <Card.Title className={classes.title}><img src={image} style={{width: '30px', height: '30px', paddingRight: '3px'}}></img>{props.title}</Card.Title>
                <Card.Text className={classes.txtbody}>
                    {props.description}
                </Card.Text>
                <Button 
                    className={classes.rentbtn} 
                    disabled={itemIsRented ? "disabled" : ""} 
                    variant="warning"
                >Reserve<Badge 
                            pill 
                            bg="light" 
                            text='dark'
                        >{props.copies}</Badge>
                </Button>
            </Card.Body>
        </Card>
    );
}

export default MediaItem;