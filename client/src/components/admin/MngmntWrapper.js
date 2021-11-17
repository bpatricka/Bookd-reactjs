import { useEffect, useState } from 'react';
import {Card, Button, Nav, Form} from 'react-bootstrap';
import AddMediaForm from './AddMediaForm.js';
import EditMediaForm from './EditMediaForm.js';
import UsersForm from './UsersForm.js';
import MediaReport from './MediaReport.js';
import classes from './MngmntWrapper.module.css';

export const MngmntWrapper = () => {
    const [selected, setSelected] = useState('media');
    let activem;
    let activeu;
    let activer;

    useEffect(() =>{
    },[selected]);

    function contentHandler(e) {
      setSelected(e.target.id);
    }

    function handleView(){
      window.scrollTo(0, document.body.scrollHeight);
    }

    let content = <p>taco</p>;
    if (selected === null){
      content = <div>
        <h1>Hello Librarian, from here you can: </h1>
          <ul>
            <li>
              Add, edit, or remove media
            </li>
            <li>
              Block, or restrict users.
            </li>            
            <li>
              Add, edit, or remove media
            </li>
          </ul> 
        </div>
    }

    if (selected === 'media'){
      activem = 'active';
      // add media
      // FORM COMPONENT
      // need:
      // media_key (high entropy unique generated key)
      // title
      // author
      // category (ACD, ENT, REF)
      // prof_id (select from listed table of professors)
      // course_id (from table values)
      // dept_id (from table values)
      // copies (NUMBER OF AVAILABLE COPIES... ALWAYS UPDATED BY TRIGGER FROM RENTALS)
      // description
      // publisher
      // publishedDate
      // m_type
      content = <section>
                  <div>
                    <h3 style={{ color: "#DDD", display: 'flex', justifyContent: 'center'}}>To Edit Media (bottom)</h3>
                    <AddMediaForm />
                  </div>
                  <div style={{ paddingTop: '20px' }}>
                    <h1 style={{ color: "#DDD", borderTop: '1px #DDD solid' }}>Edit Media</h1>
                    <EditMediaForm/>
                  </div>
                </section>;


    } else if (selected === 'users'){
      //do stuff like restricting users
      activeu = 'active';
      content = <section style={{color: '#DDD'}}><UsersForm /></section>;
    } else {
      activer = 'active';
      //do stuff for reporting here
      content = <section><MediaReport /></section>;
    }
    return(
        <Card bg='dark'>
          <Card.Header>
            <Nav className='justify-content-center' variant="tabs" defaultActiveKey="media">
              <Nav.Item>
                <Nav.Link className={classes.mwrapitems} id={'media'} active={activem} onClick={(event) => contentHandler(event)}>Media</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className={classes.mwrapitems} id={'users'} active={activeu} onClick={(event) => contentHandler(event)}>Users</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className={classes.mwrapitems} id={'reports'} active={activer} onClick={(event) => contentHandler(event)}>Reports</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <div>{content}</div>
          </Card.Body>
        </Card>
    )
}