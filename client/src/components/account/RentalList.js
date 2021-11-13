import RentalItem from './RentalItem';
import classes from './RentalList.module.css';

function RentalList(props) {
    return (
    <ul className={classes.rentallist}>
        {props.rentalitems.map((rental) => (
            <RentalItem 
                key={rental.media_key} 
                media_id={rental.media_id} 
                media_key={rental.media_key}
                image={rental.image}
                title={rental.title}
                author={rental.author}
                category={rental.category}
                m_type={rental.m_type}
                c_name={rental.course_name}
                d_name={rental.dept_name}
                p_name={rental.fname+' '+rental.lname}
                copies={rental.copies}
                description={rental.description}
                published={rental.publishedDate}
                publisher={rental.publisher}
                returndate={rental.date_returned}
                rentdate={rental.date_rented}
            />
    ))}
    </ul>
)}

export default RentalList;