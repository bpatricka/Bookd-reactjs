import { useEffect, useState, useRef } from 'react';
import {Card, Button, Nav, Form} from 'react-bootstrap';
import AddMediaForm from './AddMediaForm.js';
import EditMediaForm from './EditMediaForm.js';
import NewPCDForm from './NewPCDForm.js';
import EditPCDForm from './EditPCDForm.js';
import UsersForm from './UsersForm.js';
import MediaReport from './MediaReport.js';
import classes from './MngmntWrapper.module.css';
import { FaPlus, FaCog } from 'react-icons/fa';

export const MngmntWrapper = () => {
    const [selected, setSelected] = useState('media');
    const [professors, setProfessors] = useState(null);
    const [courses, setCourses] = useState(null);
    const [departments, setDepartments] = useState(null);
    const emRef = useRef();
    let activem;
    let activeem;
    let activeu;
    let activer;
    let activenpcd;
    let activeepcd;

    const fetchFormData = async () => {
      const response = await fetch('http://localhost:5000/formdata/prof');
      const data1 = await response.json();
      setProfessors(data1);

      const response2 = await fetch('http://localhost:5000/formdata/course');
      const data2 = await response2.json();
      setCourses(data2);      

      const response3 = await fetch('http://localhost:5000/formdata/dept');
      const data3 = await response3.json();
      setDepartments(data3);
    }

    useEffect(() =>{
      if(courses === null) {
        fetchFormData();
      }
    },[selected]);

    function contentHandler(e) {
      setSelected(e.target.id);
    }

    function handleView(){
      window.scrollTo(0, emRef);
    }

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
                    <h3 style={{ color: "#DDD", display: 'flex', justifyContent: 'center'}}>Add Media</h3>
                    <AddMediaForm  courses={courses} professors={professors} departments={departments}/>
                  </div>
                </section>;


    } else if (selected === 'users'){
      //do stuff like restricting users
      activeu = 'active';
      content = <section style={{color: '#DDD'}}><UsersForm /></section>;
    } else if (selected === 'newPCD'){
      activenpcd = 'active';
      content = <section><NewPCDForm courses={courses} professors={professors} departments={departments} /></section>
    } else if (selected === 'editm'){
      activeem = 'active';
      content = <section>
        <div style={{ paddingTop: '20px' }}>
          <h1 ref={emRef} style={{ color: "#DDD", borderTop: '1px #DDD solid' }}>Edit Media</h1>
          <EditMediaForm  courses={courses} professors={professors} departments={departments}/>
        </div>
      </section>;
    } else if (selected === 'editPCD') {
      activeepcd = 'active';
      content = <section><EditPCDForm courses={courses} professors={professors} departments={departments} /></section>
    } else {
      activer = 'active';
      //do stuff for reporting here
      content = <section><MediaReport courses={courses} professors={professors} departments={departments} /></section>;
    }
    return(
        <Card bg='dark'>
          <Card.Header>
            <Nav className='justify-content-center' variant="tabs" defaultActiveKey="">
            <Nav.Item>
                <Nav.Link 
                  className={classes.mwrapitems} 
                  id={'newPCD'} 
                  active={activenpcd} 
                  onClick={(event) => contentHandler(event)}
                ><FaPlus />  Prof/Course/Dept</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  className={classes.mwrapitems} 
                  id={'editPCD'} 
                  active={activeepcd} 
                  onClick={(event) => contentHandler(event)}
                ><FaCog />  Prof/Course/Dept</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  className={classes.mwrapitems} 
                  id={'media'} 
                  active={activem} 
                  onClick={(event) => contentHandler(event)}
                ><FaPlus/>  Media</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  className={classes.mwrapitems} 
                  id={'editm'} 
                  active={activeem} 
                  onClick={(event) => contentHandler(event)}
                ><FaCog/>  Media</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  className={classes.mwrapitems} 
                  id={'users'} 
                  active={activeu} 
                  onClick={(event) => contentHandler(event)}
                >Users</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  className={classes.mwrapitems} 
                  id={'reports'} 
                  active={activer} 
                  onClick={(event) => contentHandler(event)}
                >Reports
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <div>{content}</div>
          </Card.Body>
        </Card>
    )
}