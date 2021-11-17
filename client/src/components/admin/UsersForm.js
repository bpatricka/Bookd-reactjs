import { Form, Row, Col, Button } from "react-bootstrap";
import {useState, useEffect} from 'react';

const UsersForm = () => {
const [users, setUsers] = useState(null);
const [editing, setEditing] = useState(null);
let acontent;
let bcontent;

    const fetchUsersHandler = async () => {
        let isMounted = true;
        fetch('http://localhost:5000/users')
        .then(response => response.json())
        .then(data => {
            if(isMounted){
                setUsers(data);
            }
        });
    }

    const submitEdit = async () =>{
        let isMounted = true;
        fetch('http://localhost:5000/users',
            {
                method: 'POST'
            }
        ).then((response) => {return response.json();})
        .then(data => console.log('user edited', data));
    }



    useEffect(()=>{
        let isMounted = true;
        console.log(editing);
        if(users === null ){
            fetchUsersHandler();
        }
        return () => {
            isMounted = false;
        }
    },[editing]);

    if (users === null) {} 
    else {
        acontent = <Row>
        <Form.Group as={Col} md="4" controlId="user-edit">
            <Form.Label>All Users in the System</Form.Label>
                <Form.Control
                    as="select"
                    required
                    onChange={(event) => {setEditing(event.target.value)}}
                >
                    <option>Select to open...</option>
                    {users.map((user) => 
                    <option value={user.email}>{user.email}, blocked: {String(user.blocked)}</option>
                    )}
                </Form.Control>
        </Form.Group>
    </Row>;
    }

    if(editing === null || !editing) {}
    else {
        bcontent = <Row>
        <Form.Group as={Col} md='2' controlId='user-deets'>
            <Form.Label>User Information (Set to 1 to block)</Form.Label>
            <Form.Control type='number' min='0' max='1' placeholder={editing.blocked}></Form.Control>
        </Form.Group>
    </Row>;
    }

    return(
        <div>
        <Form>
            {acontent}
            {bcontent}
        </Form>
        <Button style={{margin: '10px'}} variant='danger' onClick={submitEdit()}>BLOCK</Button>
        </div>
    );
}

export default UsersForm;