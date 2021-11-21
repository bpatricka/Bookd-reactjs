import { useState, useEffect } from 'react';
import { Table, ButtonGroup, Button } from 'react-bootstrap';

const MediaReport = () => {
    const [rentalRep, setRentalRep] = useState(null);
    const [usersRep, setUsersRep] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState('media');
    let rcontent;

    const fetchMediaReport = () => {
        let isMounted = true;
        setLoading(true);
        fetch('http://localhost:5000/reports/media')
        .then(response => response.json())
        .then(data => {
            if (isMounted){
                setRentalRep(data);
            }
        });
        setLoading(false);
    }

    const fetchUsersReport = () => {
        let isMounted = true;
        setLoading(true);
        fetch('http://localhost:5000/reports/users')
        .then(response => response.json())
        .then(data => {
            if (isMounted){
                setUsersRep(data);
            }
        });
        setLoading(false);
    }

    if (rentalRep === null){}
    else if (selected === 'media') {
        let i = 0;
        rcontent = <div><h1>Media Report</h1>
        <section>By Popularity</section>
        <section style={{display: 'flex', justifyContent: 'center'}}>
        <Table bordered hover striped style={{ color: '#DDD'}}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Rental Title</th>
                    <th>Rental Count</th>
                </tr>
                {rentalRep.map((record) => <tr><td>{i++}</td><td>{record.title}</td><td>{record.rental_count}</td></tr>)}
            </thead>
        </Table>
        </section></div>
    }

    if (usersRep === null) {}
    else if (selected === 'users') {
        let i = 0;
        rcontent =<div><h1>User Report</h1>
        <section>By Most Rented</section><section style={{display: 'flex', justifyContent: 'center'}}>
        <Table bordered hover striped style={{ color: '#DDD'}}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>User Email</th>
                    <th>Rental Count</th>
                </tr>
                {usersRep.map((record) => <tr><td>{i++}</td><td>{record.email}</td><td>{record.rental_count}</td></tr>)}
            </thead>
        </Table>
        </section></div>
    }
    
    useEffect(()=>{
        let isMounted = true;
        if(rentalRep === null && selected === 'media'){
            fetchMediaReport();
        }
        if(usersRep === null && selected === 'users'){
            fetchUsersReport();
        }
        return () =>{
            isMounted = false;
        }
    }, [selected]);

    return (
        <div>
            <ButtonGroup style={{display:'flex', justifyContent: 'center', width: '20vw'}}>
                <Button value='media' onClick={(e) => {setSelected(e.target.value)}}>Media</Button>
                <Button value='users' onClick={(e) => {setSelected(e.target.value)}}>Users</Button>
            </ButtonGroup>
            <div style={{ color: '#DDD' }}>
                {rcontent}
            </div>
        </div>
    );
}

export default MediaReport;