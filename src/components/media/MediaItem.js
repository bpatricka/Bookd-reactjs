// import classes from './MediaItem.module.css';
import { Card, Button, Badge } from 'react-bootstrap';

export const MediaItem = (props) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={props.image} alt={props.title} style={{ height: '200px' }} />
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    {props.description}
                </Card.Text>
                <Button variant="primary">Rent <Badge pill bg="light" text='dark'>{props.copies}</Badge></Button>
            </Card.Body>
        </Card>
    )
}

export default MediaItem;