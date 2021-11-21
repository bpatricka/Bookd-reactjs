import { Form, Row, Col, InputGroup, FormControl, Button, Modal } from "react-bootstrap";
import { useState } from 'react';

const NewPCDForm = (props) => {
    const [profFname, setProffname] = useState(null);
    const [profLname, setProflname] = useState(null);
    const [profDept, setProfdept] = useState(null);
    const [coursename, setCoursename] = useState(null);
    const [courseDept, setCoursedept] = useState(null);
    const [courseProf, setCourseprof] = useState(null);
    const [deptname, setDeptname] = useState(null);
    const [validated, setValidated] = useState(null);
    const [show, setShow] = useState(false);
    const [ashow, setShowAlertS] = useState(false);
    const [dshow, setShowAlertD] = useState(false);
    const [route, setCurrentRoute] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseAlertS = () => setShowAlertS(false);
    const handleShowAlertS = () => setShowAlertS(true);

    const handleCloseAlertD = () => setShowAlertD(false);
    const handleShowAlertD = () => setShowAlertD(true);

    const handleConfirmation = (e) => {
        switch (route) {
            case 'prof':
                submitConfirmProf();
                break;
            case 'dept':
                submitConfirmDept();
                break;
            case 'course':
                submitConfirmCourse();
                break;
        }
    }

    const submitNewProf = (e) => {
        const form = e.currentTarget;
        setCurrentRoute('prof');

        if (form.checkValidity() === false) {
          console.log(form);
          e.preventDefault();
          e.stopPropagation();
        }
  
        setValidated(true);
        if(validated){
            setShow(true);
        }
    }

    const submitNewCourse = (e) => {
        const form = e.currentTarget;
        setCurrentRoute('course');

        if (form.checkValidity() === false) {
          console.log(form);
          e.preventDefault();
          e.stopPropagation();
        }
  
        setValidated(true);
        if(validated){
            setShow(true);
        }
    }

    const submitNewDept = (e) => {
        const form = e.currentTarget;
        setCurrentRoute('dept');

        if (form.checkValidity() === false) {
          console.log(form);
          e.preventDefault();
          e.stopPropagation();
        }
  
        setValidated(true);
        if(validated){
            setShow(true);
        }
    }

    const submitConfirmProf = () => {
        handleClose();
        fetch('http://localhost:5000/newprof',
        {
            method: 'POST',
            body: JSON.stringify({
                fname: profFname,
                lname: profLname,
                dept: profDept
            }),
            headers: {
                "Content-Type": "application/json"
            },
        }
        )
        .then(response => response.json())
        .then(data => {
            if(data === 'Confirmed'){
                setShowAlertS(true);
            } else {
                setShowAlertD(true);
            }
        });
    }

    const submitConfirmCourse = () => {
        handleClose();
        fetch('http://localhost:5000/newcourse',
        {
            method: 'POST',
            body: JSON.stringify({
                coursename: coursename,
                courseDept: courseDept,
                courseProf: courseProf
            }),
            headers: {"Content-Type": 'application/json'},
        }
        )
        .then(response => response.json())
        .then(data => {
            if(data === 'Confirmed'){
                setShowAlertS(true);
            } else {
                setShowAlertD(true);
            }
        });
    }
    
    const submitConfirmDept = () => {
        handleClose();
        fetch('http://localhost:5000/newdept',
        {
            method: 'POST',
            body: JSON.stringify({deptname: deptname}),
            headers: {"Content-Type": 'application/json'},
        }
        )
        .then(response => response.json())
        .then(data => {
            if(data === 'Confirmed'){
                setShowAlertS(true);
            } else {
                setShowAlertD(true);
            }
        });
    }

    return (
        <div style={{color: '#DDD'}}>
            <span>
                <Modal show={ashow} onHide={handleCloseAlertS}>
                    <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Changes Successful</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant='success' onClick={() => {handleCloseAlertS}}>Success</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal>
            </span>
            <span>
                <Modal show={dshow} onHide={handleCloseAlertD}>
                    <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Changes Failed, please try again.</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant='warning' onClick={() => {handleCloseAlertD}}>OK</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal>
            </span>
            <span>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Submit Changes?</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>By clicking Save Changes you are acknowledging and confirming changes.</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={() => {
                                handleConfirmation();
                            }}>Save changes</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal>
            </span>
            <Form        
                noValidate 
                validated={validated} 
            >
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="nProf">
                    <Form.Label>New Professor</Form.Label>
                        <InputGroup hasValidation className="mb-3">
                            <InputGroup.Text>First and Last name</InputGroup.Text>
                            <FormControl 
                                required
                                aria-label="First name" 
                                placeholder="First name" 
                                onChange={(e) => {setProffname(e.target.value)}}
                            />
                            <FormControl 
                                required
                                aria-label="Last name" 
                                placeholder="Last name" 
                                onChange={(e) => {setProflname(e.target.value)}}
                            />
                        <Form.Control.Feedback type="invalid">
                        Please provide a valid Name.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="npDept">
                    <Form.Label>New Professor's Department</Form.Label>
                        <InputGroup hasValidation>            
                            <Form.Control
                                required
                                as="select"
                                onChange={(event) => {setProfdept(event.target.value)}}
                            >
                                <option value={null}>Select to open...</option>
                                {props.departments.map((dept) => 
                                <option value={dept.dept_id}>{dept.dept_name}</option>
                                )}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                            Please provide a valid Department.
                            </Form.Control.Feedback>
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="npDept">
                    </Form.Group>
                </Row>
                <Button onClick={(event) => submitNewProf(event)}>Submit New Professor</Button>
            </Form>
            <Form 
                noValidate 
                validated={validated} 
            >
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="nCourse">
                    <Form.Label>New Course</Form.Label>
                        <InputGroup hasValidation className="mb-3">
                            <InputGroup.Text>New Course</InputGroup.Text>
                            <FormControl 
                                required
                                aria-label="New Course Name" 
                                placeholder='New Course' 
                                onChange={(e) => {setCoursename(e.target.value)}}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="npDept">
                    <Form.Label>New Course's Department</Form.Label>
                        <InputGroup hasValidation>            
                            <Form.Control
                                required
                                as="select"
                                onChange={(event) => {setCoursedept(event.target.value)}}
                            >
                                <option value={null}>Select to open...</option>
                                {props.departments.map((dept) => 
                                <option value={dept.dept_id}>{dept.dept_name}</option>
                                )}
                            </Form.Control>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="npDept">
                    <Form.Label>New Course's Professor</Form.Label>
                        <InputGroup hasValidation>            
                            <Form.Control
                                required
                                as="select"
                                onChange={(event) => {setCourseprof(event.target.value)}}
                            >
                                <option value={null}>Select to open...</option>
                                {props.professors.map((prof) => 
                                <option value={prof.prof_id}>{prof.fname+" "+prof.lname}</option>
                                )}
                            </Form.Control>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Button onClick={(event) => submitNewCourse(event)}>Submit New Course</Button>
            </Form>
            <Form noValidate validated={validated}>
                <Row>
                <Form.Group as={Col} md="4" controlId="nCourse">
                    <Form.Label>New Department</Form.Label>
                        <InputGroup hasValidation className="mb-3">
                            <InputGroup.Text>New Department</InputGroup.Text>
                            <FormControl 
                                required
                                aria-label="New Department Name" 
                                placeholder='New Department' 
                                onChange={(e) => {setDeptname(e.target.value)}}
                            />
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Button onClick={(event) => submitNewDept(event)}>Submit New Department</Button>
            </Form>
        </div>
    );
}

export default NewPCDForm;