import { Nav, Card, Button } from 'react-bootstrap';
import classes from './RentalWrapper.module.css';
import RentalList from './RentalList';
import {Route, Link, Routes } from 'react-router-dom';
import RentalsContext from '../../store/rentals-context';
import UserContext from '../../store/user-context';
import { useContext, useRef, useCallback, useState, useEffect } from 'react';
import SearchContext from '../../store/search-context';
import PdfComp from '../renderp/PdfComp';

export const RentalWrapper = () => {
    const rentalsCtx = useContext(RentalsContext);
    const userCtx = useContext(UserContext);
    const searchCtx = useContext(SearchContext);
    const [selected, setSelected] = useState('rentals');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const reserveRef = useRef();
    const rentRef = useRef();

    let actives;
    let activer;
    let content;
    let isMounted;

    const fetchRentalsHandler = useCallback( async () =>{
        let isMounted = true;
        setLoading(true);
        setError(null);
        try {
            // THIS IS FOR CURRENT RENTALS
            fetch(
                "http://localhost:5000/account/"+userCtx.mail
            )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if(isMounted){
                    rentalsCtx.setRentals(data.map(rental => rental));
                }
            });
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    },[]);

    useEffect(() =>{
        fetchRentalsHandler();

        return () => {
            isMounted = false;
            searchCtx.clearSearch();
        }
    },[fetchRentalsHandler]);

    function contentHandler(e) {
      setSelected(e.target.id);
      if(e.target.id === 'rentals'){
          rentRef.current.style.color='#888';
          reserveRef.current.style.color='#DDD';
      }
      else {
        rentRef.current.style.color='#DDD';
        reserveRef.current.style.color='#888';
      }
    }

    if (loading){
        content = <p style={{ textAlign: 'center'}}>Wait a moment...</p>;
    }
    if (selected === 'rentals' && rentalsCtx.rentals.length === 0){
        activer = 'active';
        content = <div>No rentals, check out our selection?</div>;
    } else if (selected === 'rentals') {
      activer = 'active';
      content = <section><RentalList rentalitems={rentalsCtx.rentals} /></section>;
    } else if (selected === 'reservations'){
      //do stuff like restricting users
      actives = 'active';
      content = <div>Reservations.... probably as cards again</div>;
    }

    return (
        <Card bg='secondary' className={classes.rentalwrapper}>
            <Card.Header>
                <Nav variant="tabs" defaultActiveKey="rentals">
                <Nav.Item>
                    <Nav.Link ref={rentRef} style={{ color: '#888'}} id={'rentals'} active={activer} onClick={(event) => {contentHandler(event)}}>Rentals</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link ref={reserveRef} style={{ color: '#DDD'}} id={'reservations'} active={actives} onClick={(event) => {contentHandler(event)}}>Reservations</Nav.Link>
                </Nav.Item>
                </Nav>
            </Card.Header>
            <Card.Body>
                {content}
            </Card.Body>
        </Card>
    )
};

export default RentalWrapper;