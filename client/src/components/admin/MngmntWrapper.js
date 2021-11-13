import { useEffect, useState } from 'react';
import {Card, Button, Nav, Form} from 'react-bootstrap';

export const MngmntWrapper = () => {
    const [selected, setSelected] = useState("media");
    let activem;
    let activeu;
    let activer;

    useEffect(() =>{
    },[selected]);

    function contentHandler(e) {
      setSelected(e.target.id);
    }
    let content = <p>taco</p>;
    if (selected === 'media'){
      activem = 'active';
      //add media
      //FORM COMPONENT
      content = 
      <Form>

      </Form>;
    } else if (selected === 'users'){
      //do stuff like restricting users
      activeu = 'active';
      content = <p>Users are smelly and I don't respect them</p>;
    } else {
      activer = 'active';
      //do stuff for reporting here
      content = <p>That's right I said it...</p>;
    }
    return(
        <Card>
  <Card.Header>
    <Nav className='justify-content-center' variant="tabs" defaultActiveKey="#media">
      <Nav.Item>
        <Nav.Link id={'media'} active={activem} onClick={(event) => contentHandler(event)}>Media</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link id={'users'} active={activeu} onClick={(event) => contentHandler(event)}>Users</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link id={'reports'} active={activer} onClick={(event) => contentHandler(event)}>Reports</Nav.Link>
      </Nav.Item>
    </Nav>
  </Card.Header>
  <Card.Body>
    {content}
  </Card.Body>
</Card>
    )
}