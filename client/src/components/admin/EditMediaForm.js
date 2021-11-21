import { useEffect, useState } from "react";
import classes from './EditMediaForm.module.css';
import { FaTrash } from "react-icons/fa";
import { Row, Form, InputGroup, Col, Button, Modal } from "react-bootstrap";


const EditMediaForm = (props) => {
    const [media, setMedia] = useState([]);
    const [editing, setEditing] = useState(null);
    const [ncategory, setCategory] = useState(null);
    const [ntitle, setNTitle] = useState(null);
    const [mkey, setMkey] = useState(null);
    const [nauthor, setNAuthor] = useState(null);
    const [nprof, setNProf] = useState(null);
    const [ncourse, setNCourse] = useState(null);
    const [ndept, setNDept] = useState(null);
    const [selmedia, setSelmedia] = useState(null);
    const [copies, setCopies] = useState(null);
    const [ndescription, setNDescription] = useState(null);
    const [npublisher, setNPublisher] = useState(null);
    const [npublishdate, setNPubDate] = useState(null);
    const [mtype, setNMtype] = useState(null);
    const [validate, setValidate] = useState(null);
    const [route, setCurrentRoute] = useState(null);
    const [show, setShow] = useState(false);
    const [ashow, setShowAlertS] = useState(false);
    const [dshow, setShowAlertD] = useState(false);
    const [hover, setHover] = useState(false);
    let acontent;
    let bcontent;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseAlertS = () => setShowAlertS(false);
    const handleShowAlertS = () => setShowAlertS(true);

    const handleCloseAlertD = () => setShowAlertD(false);
    const handleShowAlertD = () => setShowAlertD(true);

    const handleConfirmation = (e) => {
        switch (route) {
            case 'edit':
                submitConfirmEdit();
                break;
            case 'delete':
                submitConfirmDelete();
                break;
        }
    }

    const postNewData = (e) => {
        const form = e.currentTarget;
        setCurrentRoute('edit')
        if (form.checkValidity() === false) {
            console.log(form);
            e.preventDefault();
            e.stopPropagation();
        }

        setValidate(true);
        if(validate){
            setShow(true);
        }
    }

    const submitMediaDelete = (e) => {
        const form = e.currentTarget;
        setCurrentRoute('delete');
        setShow(true);
    }

    const submitConfirmDelete = async () => {
        handleClose();
        fetch('http://localhost:5000/delete/media/'+editing,
            {
                method: 'POST',
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

    const submitConfirmEdit = async () => {
        handleClose();
        fetch('http://localhost:5000/editmedia/'+editing,
        {
            method: "POST",
            body: JSON.stringify({
                media_key: editing,
                title: ntitle,
                author: nauthor,
                category: ncategory,
                prof_id: nprof,
                course_id: ncourse,
                dept_id: ndept,
                copies: copies,
                description: ndescription,
                publisher: npublisher,
                publishDate: npublishdate,
                m_type: mtype
            }),
            headers: {"Content-Type":"application/json"},
        }
    ).then(response => response.json())
    .then(data => {
        if(data === 'Confirmed'){
            setShowAlertS(true);
        } else {
            setShowAlertD(true);
        }
    });
    }

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
        if(editing !== null){
            setSelmedia(media.find(item => item.media_key === editing));
        }
        return () => {
            isMounted=false;
        }
    },[editing]);

    if(selmedia){
        bcontent = <section> 
                <Form noValidate validation={validate}>
                    <Row>
                        <Form.Group as={Col} md="4" controlId="firstRow">
                            <Form.Label>Title</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control type='text' placeholder={selmedia.title} onChange={(e) => {setNTitle(e.target.value)}}></Form.Control>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="4">
                            <Form.Label>Author</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control type="text" placeholder={selmedia.author} onChange={(e) => {setNAuthor(e.target.value)}}></Form.Control>
                                </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="1">
                                <Form.Label>Category</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control as='select'>
                                        <option value={null}>Select to open...</option>
                                            {['ACD', 'REF', 'ENT'].map((item) => 
                                            <option onChange={(event) => {setCategory(event.target.value)}} value={item}>{item}</option>
                                            )}
                                    </Form.Control>
                                </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="1">
                                <Form.Label>Media Type</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control as='select' onChange={(event) => {setNMtype(event.target.value)}}>
                                        <option value={null}>Select to open...</option>
                                            {['PRINT', 'AUDIO', 'VIDEO'].map((item) => 
                                            <option value={item}>{item}</option>
                                            )}
                                    </Form.Control>
                                </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="2">
                                <Form.Label>Copies</Form.Label>
                                <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    type="number"
                                    min='1'
                                    placeholder="Copies"
                                    onChange={(event) => {setCopies(event.target.value)}}
                                />
                                </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Professor</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control as={Col} md="4" as='select' onChange={(event) => {setNProf(event.target.value)}}>
                                <option value={null}>Select to open...</option>
                                    {props.professors.map((teacher) => 
                                    <option  value={teacher.prof_id}>{teacher.fname+" "+teacher.lname}</option>
                                    )}
                            </Form.Control>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Course</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control as='select' onChange={(event) => {setNCourse(event.target.value)}}>
                                <option value={null}>Select to open...</option>
                                    {props.courses.map((course) => 
                                    <option  value={course.course_id}>{course.course_name}</option>
                                    )}
                            </Form.Control>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Department</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control as='select' onChange={(event) => {setNDept(event.target.value)}}>
                                <option value={null}>Select to open...</option>
                                    {props.departments.map((dept) => 
                                    <option  value={dept.dept_id}>{dept.dept_name}</option>
                                    )}
                            </Form.Control>
                        </InputGroup>
                    </Form.Group>
                    </Row>
                    <Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Publisher</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control 
                                    type="text" 
                                    placeholder={selmedia.publisher} 
                                    onChange={(e) => {setNPublisher(e.target.value)}}></Form.Control>
                            </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Publish Date</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control 
                                    type="date" 
                                    placeholder={selmedia.publishDate} 
                                    onChange={(e) => {setNPubDate(e.target.value)}}></Form.Control>
                            </InputGroup>
                    </Form.Group>
                    </Row>
                    <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Description</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control as='textarea' placeholder={selmedia.description} onChange={(e) => {setNDescription(e.target.value)}}>
                            </Form.Control>
                        </InputGroup>
                    </Form.Group>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
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
                        onClick={(e) => {submitMediaDelete(e)}} 
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
                        onClick={(e) => {submitMediaDelete(e)}} 
                    />
                    }
                    <Button style={{width: '20vw'}} onClick={(e) => {postNewData(e)}}>Submit Media Edit</Button>
                </Row>
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
                            onClick={(event) => {setEditing(event.target.value)}}
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
            {bcontent}
        </div>
    );
}


export default EditMediaForm;