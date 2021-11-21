import { useState } from "react";
import { Form, Row, InputGroup, Col, FormControl, Button, Modal, Alert } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import classes from './EditPCDForm.module.css';

const EditPCDForm = (props) => {
    const [selProf, setSelprof] = useState(null);
    const [proffname, setProffname] = useState(null);
    const [proflname, setProflname] = useState(null);
    const [profdept, setProfdept] = useState(null);
    const [selCourse, setSelcourse] = useState(null);
    const [courseName, setCoursename] = useState(null);
    const [courseProf, setCourseprof] = useState(null);
    const [courseDept, setCoursedept] = useState(null);
    const [selDept, setSeldept] = useState(null);
    const [deptName, setDeptname] = useState(null);
    const [verified, setVerified] = useState(false);
    const [route, setCurrentRoute] = useState(null);
    const [show, setShow] = useState(false);
    const [ashow, setShowAlertS] = useState(false);
    const [dshow, setShowAlertD] = useState(false);
    const [hover, setHover] = useState(false);
    const [hovera, setHoverA] = useState(false);
    const [hoverb, setHoverB] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseAlertS = () => setShowAlertS(false);
    const handleShowAlertS = () => setShowAlertS(true);

    const handleCloseAlertD = () => setShowAlertD(false);
    const handleShowAlertD = () => setShowAlertD(true);
    let alertcontent;
    let acontent;
    let pcontent;
    let ccontent;
    let dcontent;


    const submitProfEdit = (e) => {
        setCurrentRoute('prof');
        handleShow();
    }

    const submitProfDelete = (e) => {
        setCurrentRoute('prof-d');
        handleShow();
    }

    const submitCourseEdit = (e) => {
        setCurrentRoute('course');
        handleShow();
    }

    const submitCourseDelete = (e) => {
        setCurrentRoute('course-d');
        handleShow();
    }

    const submitDeptEdit = (e) => {
        setCurrentRoute('dept');
        handleShow();
    }

    const submitDeptDelete = (e) => {
        setCurrentRoute('dept-d');
        handleShow();
    }

    const handleConfirmation = (e) => {
        switch (route) {
            case 'prof':
                submitConfirmProf();
                break;
            case 'prof-d':
                submitConfirmProfD();
                break;
            case 'dept':
                submitConfirmDept();
                break;
            case 'dept-d':
                submitConfirmDeptD();
                break;
            case 'course':
                submitConfirmCourse();
                break;
            case 'course-d':
                submitConfirmCourseD();
                break;
        }
    }

    const submitConfirmProf = () => {
        handleClose();
        fetch('http://localhost:5000/edit/prof/'+selProf,
            {
                method: 'POST',
                body: JSON.stringify({
                    fname: proffname,
                    lname: proflname,
                    dept: profdept
                }),
                headers: {'Content-Type':'application/json'},
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

    const submitConfirmProfD = () => {
        handleClose();
        fetch('http://localhost:5000/delete/prof/'+selProf,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
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

    const submitConfirmCourse = (e) => {
        handleClose();
        fetch('http://localhost:5000/edit/course/'+selCourse,
        {
            method: 'POST',
            body: JSON.stringify({
                name: courseName,
                dept: courseDept,
                prof: courseProf
            }),
            headers: {'Content-Type':'application/json'},
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

    const submitConfirmCourseD = () => {
        handleClose();
        fetch('http://localhost:5000/delete/course/'+selCourse,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
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

    const submitConfirmDept = (e) => {
        handleClose();
        fetch('http://localhost:5000/edit/dept/'+selDept,
        {
            method: 'POST',
            body: JSON.stringify({
                name: deptName
            }),
            headers: {'Content-Type':'application/json'},
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

    const submitConfirmDeptD = () => {
        handleClose();
        fetch('http://localhost:5000/delete/dept/'+selDept,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
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


    if(selProf) {
        pcontent = <div>
            
        <Row>
            <Form.Group as={Col} md="6" controlId="prof-name">
                <Form.Label>Edit Professor's Name</Form.Label>
                <InputGroup hasValidation className="mb-3">
                    <InputGroup.Text>First and Last name</InputGroup.Text>
                    <FormControl aria-label="First name" placeholder='New first name' onChange={(e) => {setProffname(e.target.value)}}/>
                    <FormControl aria-label="Last name" placeholder='New last name' onChange={(e) => {setProflname(e.target.value)}}/>
                </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="prof-dept">
                <Form.Label>Professor's New Department</Form.Label>
                    <Form.Control
                        as="select"
                        required
                        onChange={(event) => {setProfdept(event.target.value)}}
                    >
                        <option>Select to open...</option>
                        {props.departments.map((dept) => 
                        <option value={dept.dept_id}>{dept.dept_name}</option>
                        )}
                    </Form.Control>
            </Form.Group>
            <Row className={classes.buttons}>
                {hover ? 
                    <FaTrash 
                    onMouseEnter={()=>{
                    setHover(true);
                    }}
                    onMouseLeave={()=>{
                    setHover(false);
                    }}
                    className={classes.trashcan}
                    style={{ width: '60px', height: '60px', color: 'red' }} 
                    onClick={(e) => {submitProfDelete(e)}} 
                />
                :
                <FaTrash 
                    onMouseEnter={()=>{
                    setHover(true);
                    }}
                    onMouseLeave={()=>{
                    setHover(false);
                    }}
                    className={classes.trashcan}
                    style={{ width: '50px', height: '50px' }} 
                    onClick={(e) => {submitProfDelete(e)}} 
                />
                }
                <Button 
                    style={{ width: '20vw'}} 
                    onClick={(e) => {submitProfEdit(e)
                    }}>Submit Edited Professor
                </Button>
            </Row>
        </Row>
        </div>;
    }

    if(selCourse){
        ccontent = <div>
        <Row>
            <Form.Group as={Col} md="4" controlId="course-name">
                <Form.Label>Edit Course Name</Form.Label>
                <InputGroup hasValidation className="mb-3">
                    <InputGroup.Text>Course's New Name</InputGroup.Text>
                    <FormControl aria-label="Course name" placeholder='New Course name' onChange={(e) => {setCoursename(e.target.value)}}/>
                </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="course-dept">
                <Form.Label>Course's New Department</Form.Label>
                    <Form.Control
                        as="select"
                        required
                        onChange={(event) => {setCoursedept(event.target.value)}}
                    >
                        <option>Select to open...</option>
                        {props.departments.map((dept) => 
                        <option value={dept.dept_id}>{dept.dept_name}</option>
                        )}
                    </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="course-prof">
                <Form.Label>Course's New Professor</Form.Label>
                    <Form.Control
                        as="select"
                        required
                        onChange={(event) => {setCourseprof(event.target.value)}}
                    >
                        <option>Select to open...</option>
                        {props.professors.map((teacher) => 
                        <option value={teacher.prof_id}>{teacher.fname+" "+teacher.lname}</option>
                        )}
                    </Form.Control>
            </Form.Group>
            <Row style={{ display: 'flex', justifyContent: 'center'}}>
            {hovera ? 
                    <FaTrash 
                    onMouseEnter={()=>{
                    setHoverA(true);
                    }}
                    onMouseLeave={()=>{
                    setHoverA(false);
                    }}
                    className={classes.trashcan}
                    style={{ width: '60px', height: '60px', color: 'red' }} 
                    onClick={(e) => {submitCourseDelete(e)}} 
                />
                :
                <FaTrash 
                    onMouseEnter={()=>{
                    setHoverA(true);
                    }}
                    onMouseLeave={()=>{
                    setHoverA(false);
                    }}
                    className={classes.trashcan}
                    style={{ width: '50px', height: '50px' }} 
                    onClick={(e) => {submitCourseDelete(e)}} 
                />
                }
                <Button style={{ width: '20vw'}} onClick={(e) => {submitCourseEdit(e)}}>Submit Edited Course</Button>
            </Row>
        </Row>
        </div>;
    }

    if(selDept){
        dcontent = <div>
        <Row>
            <Form.Group as={Col} md="4" controlId="course-name">
                <Form.Label>Edit Department</Form.Label>
                <InputGroup hasValidation className="mb-3">
                    <InputGroup.Text>Department's New Name</InputGroup.Text>
                    <FormControl aria-label="Department name" placeholder='New department name' onChange={(e) => {setDeptname(e.target.value)}}/>
                </InputGroup>
            </Form.Group>
            <Row style={{ display: 'flex', justifyContent: 'center'}}>
            {hoverb ? 
                    <FaTrash 
                    onMouseEnter={()=>{
                    setHoverB(true);
                    }}
                    onMouseLeave={()=>{
                    setHoverB(false);
                    }}
                    className={classes.trashcan}
                    style={{ width: '60px', height: '60px', color: 'red' }} 
                    onClick={(e) => {submitDeptDelete(e)}} 
                />
                :
                <FaTrash 
                    onMouseEnter={()=>{
                    setHoverB(true);
                    }}
                    onMouseLeave={()=>{
                    setHoverB(false);
                    }}
                    className={classes.trashcan}
                    style={{ width: '50px', height: '50px' }} 
                    onClick={(e) => {submitDeptDelete(e)}} 
                />
                }
                <Button style={{ width: '20vw'}} onClick={(e) => {submitDeptEdit(e)}}>Submit Edited Department</Button>
            </Row>
        </Row>
        </div>;
    }

    if(props.professors){
        acontent = 
        <section>  
        <Form>
            <Row>
                <Form.Group as={Col} md="4" controlId="media-edit">
                    <Form.Label>Professors in the System</Form.Label>
                        <Form.Control
                            as="select"
                            required
                            onChange={(event) => {setSelprof(event.target.value)}}
                        >
                            <option>Select to open...</option>
                            {props.professors.map((teacher) => 
                            <option value={teacher.prof_id}>{teacher.fname+" "+teacher.lname}</option>
                            )}
                        </Form.Control>
                </Form.Group>
                {pcontent}
            </Row>
        </Form>
        <Form>
            <Row>
                <Form.Group as={Col} md="4" controlId="media-edit">
                    <Form.Label>Courses in the System</Form.Label>
                        <Form.Control
                            as="select"
                            required
                            onChange={(event) => {setSelcourse(event.target.value)}}
                        >
                            <option>Select to open...</option>
                            {props.courses.map((course) => 
                            <option value={course.course_id}>{course.course_name}</option>
                            )}
                        </Form.Control>
                </Form.Group>
                {ccontent}
            </Row>
        </Form>
        <Form>
            <Row>
                <Form.Group as={Col} md="4" controlId="media-edit">
                    <Form.Label>Departments in the System</Form.Label>
                        <Form.Control
                            as="select"
                            required
                            onChange={(event) => {setSeldept(event.target.value)}}
                        >
                            <option>Select to open...</option>
                            {props.departments.map((dept) => 
                            <option value={dept.dept_id}>{dept.dept_name}</option>
                            )}
                        </Form.Control>
                </Form.Group>
                {dcontent}
            </Row>
        </Form>
        </section>;
    }

    return(
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
            {acontent}
        </div>
    );
}

export default EditPCDForm;