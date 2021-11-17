import { useState, useEffect } from 'react';

const MediaReport = () => {
    const [rentalRep, setRentalRep] = useState(null);
    let rcontent;

    const fetchMediaReport = () => {
        let isMounted = true;
        fetch('http://localhost:5000/reports/media')
        .then(response => response.json())
        .then(data => {
            if (isMounted){
                console.log(data);
                setRentalRep(data);
            }
        })
    }

    if (rentalRep === null){}
    else {
        rcontent = 
        <ul>
            <li>Rental Count........ Title</li>
            {rentalRep.map((record) => {<li>{record.rental_count}{record.title}</li>})}
        </ul>
    }
    
    useEffect(()=>{
        let isMounted = true;
        if(rentalRep === null){
            fetchMediaReport();
        }
       
        return () =>{
            isMounted = false;
        }
    },[]);

    return (
        <div style={{ color: '#DDD' }}>
            <h1>Media Report</h1>
            <section>By Popularity</section>
            {rcontent}
        </div>
    );
}

export default MediaReport;