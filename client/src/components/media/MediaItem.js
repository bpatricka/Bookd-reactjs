// import classes from './MediaItem.module.css';
import { useMsal } from '@azure/msal-react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useState, useContext } from 'react';
import RentalsContext from "../../store/rentals-context";
import { addMinutes, formatDate } from '../utils/DateHelp';
import UserContext from '../../store/user-context';

export const MediaItem = (props) => {
    const [loading, setLoading] = useState(false);

    const rentalsCtx = useContext(RentalsContext);
    const userCtx = useContext(UserContext);

    const itemIsRented = rentalsCtx.itemIsRented(props.media_id);

    const { accounts } = useMsal();

    async function toggleRentStatusHandler(){
        setLoading(true);
        let d = new Date();
        let n = new Date();
        d = addMinutes(d, 5);
        d = formatDate(d);
        n = formatDate(n);

        if (!itemIsRented) {
            await rentalsCtx.addRental({
                ...props,
                email: userCtx.mail,
                date_returned: d,
                date_rented: n
            });
        }
        setLoading(false);
    }

    let buttonText = itemIsRented ? "Rented" : "Book";
    
    if (loading) {
        buttonText = "Loading...";
    }

    if (props.copies !== 0 ) {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={props.image} alt={props.title} style={{ height: '200px' }} />
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
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
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={props.image} alt={props.title} style={{ height: '200px' }} />
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    {props.description}
                </Card.Text>
                <Button disabled={itemIsRented ? "disabled" : ""} variant="warning">Reserve<Badge pill bg="light" text='dark'>{props.copies}</Badge></Button>
            </Card.Body>
        </Card>
    );
}

export default MediaItem;