import { useEffect, useState } from "react";
import classes from './EditMediaForm.module.css';
import { Row, Form, InputGroup, Col } from "react-bootstrap";


const EditMediaForm = () => {
    const [media, setMedia] = useState([]);
    const [editing, setEditing] = useState(null);
    const [selmedia, setSelmedia] = useState(null);
    let acontent;
    let bcontent;
    // list all the available media
    // edit as necessary

    

    const fetchEMFHandler = async () => {
        fetch('http://localhost:5000/media')
        .then(response => response.json())
        .then(data => {
            setMedia(data);
        });
    }

    useEffect(()=>{
        let isMounted = true;
        if(media.length === 0){
            fetchEMFHandler();
        }
        setSelmedia(media.find(item => item.media_key === editing));
        return () => {
            isMounted=false;
        }
    },[editing]);

    if(selmedia){
        bcontent = <section>
                <Form>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type='text' placeholder={selmedia.title}></Form.Control>
                    <Form.Label>Author</Form.Label>
                    <Form.Control type="text" placeholder={selmedia.author}></Form.Control>
                    <Form.Label>Category</Form.Label>
                    <Form.Control as='select'>
                        <option>Select to open...</option>
                            {['Academic', 'Reference', 'Entertainment'].map((item) => 
                            <option onChange={(event) => {setCategory(event.target.value)}} value={item}>{item}</option>
                            )}
                    </Form.Control>
                    <Form.Label>Professor</Form.Label>
                    <Form.Control as='select'>
                        {/* HERE WILL BE PROFESSOR DATA.... template incoming */}
                        <option>Select to open...</option>
                            {['Academic', 'Reference', 'Entertainment'].map((item) => 
                            <option onChange={(event) => {setCategory(event.target.value)}} value={item}>{item}</option>
                            )}
                    </Form.Control>
                    <Form.Label>Course</Form.Label>
                    <Form.Control as='select'>
                        {/* HERE WILL BE PROFESSOR DATA.... template incoming */}
                        <option>Select to open...</option>
                            {['Academic', 'Reference', 'Entertainment'].map((item) => 
                            <option onChange={(event) => {setCategory(event.target.value)}} value={item}>{item}</option>
                            )}
                    </Form.Control>
                    <Form.Label>Department</Form.Label>
                    <Form.Control as='select'>
                        {/* HERE WILL BE PROFESSOR DATA.... template incoming */}
                        <option>Select to open...</option>
                            {['Academic', 'Reference', 'Entertainment'].map((item) => 
                            <option onChange={(event) => {setCategory(event.target.value)}} value={item}>{item}</option>
                            )}
                    </Form.Control>
                </Form>
        </section>;
    }

    if(media) {
        acontent = 
        <section>  
        <Form>
            <Row>
                <Form.Group as={Col} md="4" controlId="media-edit">
                    <Form.Label>All Media in the System</Form.Label>
                        <Form.Control
                            as="select"
                            required
                            onClick={(event) => {setEditing(event.target.value), console.log(event.target.value)}}
                        >
                            <option>Select to open...</option>
                            {media.map((item) => 
                            <option value={item.media_key}>{item.title}</option>
                            )}
                        </Form.Control>
                </Form.Group>
            </Row>
        </Form>
        </section>;
    }
    

    return(
        <div className={classes.emfwrapper}>
            {acontent}
            {bcontent}
        </div>
    );
}


export default EditMediaForm;