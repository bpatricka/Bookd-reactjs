import { useEffect, useState } from 'react';
import { Form, Row, Col, InputGroup, Button, Modal } from 'react-bootstrap';
import classes from './AddMediaForm.module.css';
const { v1: uuidv1} = require('uuid');

function AddMediaForm(props) {
    const [validated, setValidated] = useState(false);
    const [dataArr, setDataArr] = useState(null);
    const [tdata, setData] = useState(null);
    const [title, setTitle] = useState(null);
    const [author, setAuthor] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [publishDate, setPubDate] = useState(null);
    const [copies, setCopies] = useState(null);
    const [mediatype, setMtype] = useState(null);
    const [category, setCategory] = useState(null);
    const [course, setCourse] = useState(null);
    const [professor, setProfessor] = useState(null);
    const [department, setDepartment] = useState(null);
    const [description, setDescription] = useState(null);
    const [myfile, setFile] = useState(null);
    const [show, setShow] = useState(false);
    const [ashow, setShowAlertS] = useState(false);
    const [dshow, setShowAlertD] = useState(false);
    let fcontent;
    let mcontent;
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseAlertS = () => setShowAlertS(false);
    const handleShowAlertS = () => setShowAlertS(true);

    const handleCloseAlertD = () => setShowAlertD(false);
    const handleShowAlertD = () => setShowAlertD(true);


    const handleSubmit = (event) => {
      const form = event.currentTarget;

      if (form.checkValidity() === false) {
        console.log(form);
        event.preventDefault();
        event.stopPropagation();
      }
      setValidated(true);
      setShow(true);
    }
    
    const handleConfirmSubmit = async () =>{
      if(validated){
        handleClose();

        const tmpdata = {
          media_key: uuidv1(),
          title: title,
          author: author,
          category: category,
          prof_id: professor,
          course_id: course,
          dept_id: department,
          copies: copies,
          description: description,
          publisher: publisher,
          publishedDate: publishDate,
          m_type: mediatype,
          file: myfile
        };

        // console.log(tdata);
        const formData = new FormData();

        for (const item in tmpdata){
          // console.log(item, tdata[item]);
          formData.append(item, tmpdata[item]);
        }

        fetch(
          'http://localhost:5000/newmedia',
            {
              method: "POST",
              body: formData
            }
          )
          .then((response) => {
              return response.json();
          })
          .then((data) => {
            if(data === 'Confirmed'){
              setShowAlertS(true);
            } else {
              setShowAlertD(true);
            }
          });
      }
    };

    useEffect(() => {
      let isMounted = true;
      // getFormValues();
      if (isMounted){
      }
      return () => {
        isMounted = false;
      }
    }, []);

    if (myfile) {
      fcontent =
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <h5>File Details:</h5>
        <ul style={{ listStyle: 'none'}}>
          <li>
            File Name: {myfile.name}
          </li>
          <li>
            Last Modified: {String(new Date(myfile.lastModified))}
          </li>
          <li>
            Size: {Math.floor(myfile.size/1024/1024)}MB
          </li>
          <li>
            Type: {myfile.type}
          </li>
        </ul>
      </div>
    }


    if(props.departments !== null){
      mcontent = <div><Row>
      <Form.Group as={Col} md="4" controlId="teacher">
        <Form.Label>Professors</Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            as="select"
            required
            onChange={(event) => {setProfessor(event.target.value)}}
          >
            <option>Select to open...</option>
            {props.professors.map((teacher) => 
              <option value={teacher.prof_id}>{teacher.fname+" "+teacher.lname}</option>
            )}
          </Form.Control>
        </InputGroup>
      </Form.Group>
    </Row>
    <Row>
      <Form.Group  as={Col} md="4" controlId="course">
        <Form.Label>Courses</Form.Label>
        <InputGroup hasValidation>            
          <Form.Control
            required
            as="select"
            onChange={(event) => {setCourse(event.target.value)}}
          >
            <option>Select to open...</option>
            {props.courses.map((course) => 
              <option value={course.course_id}>{course.course_name}</option>
            )}
          </Form.Control>
        </InputGroup>
      </Form.Group>
    </Row>
    <Row>
      <Form.Group as={Col} md="4" controlId="dept">
        <Form.Label>Departments</Form.Label>
        <InputGroup hasValidation>            
          <Form.Control
            required
            as="select"
            onChange={(event) => {setDepartment(event.target.value)}}
          >
            <option>Select to open...</option>
            {props.departments.map((dept) => 
              <option value={dept.dept_id}>{dept.dept_name}</option>
            )}
          </Form.Control>
        </InputGroup>
      </Form.Group>
    </Row>
    </div>;
    }
  
    return (
      <section>
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
                        handleConfirmSubmit();
                    }}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    </span>
      <Form 
        noValidate 
        validated={validated} 
        onSubmit={handleSubmit} 
        className={classes.afwrapper}
        enctype="multipart/form-data"
      >
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="title">
            <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Title"
                onChange={(event) => {setTitle(event.target.value)}}
                defaultValue=""
              />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Title.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="author">
            <Form.Label>Author/Producer/Composer</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Author/Producer/Composer"
                defaultValue=""
                onChange={(event) => {setAuthor(event.target.value)}}
              />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Author/Producer/Composer.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="Copies">
            <Form.Label>Copies Offered</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">Copies</InputGroup.Text>
                <Form.Control
                    required
                    type="number"
                    placeholder="Copies"
                    defaultValue=""
                    onChange={(event) => {setCopies(event.target.value)}}
                />
              <Form.Control.Feedback type="invalid">
                Please choose number of copies.
              </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group 
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} 
            as={Col} 
            md="2" 
            controlId='mediatype'>
            <Form>
                <InputGroup hasValidation>
                    <Form.Label>Media Type</Form.Label>
                    {['radio'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                        <Form.Check
                            inline
                            required
                            label="Audio"
                            value="AUDIO"
                            name="group1"
                            type={type}
                            id={`inline-${type}-1`}
                            onChange={(event) => {setMtype(event.target.value)}}
                        />
                        <Form.Check
                            inline
                            required
                            label="Print"
                            value="PRINT"
                            name="group1"
                            type={type}
                            id={`inline-${type}-2`}
                            onChange={(event) => {setMtype(event.target.value)}}
                        />
                        <Form.Check
                            inline
                            required
                            label="Video"
                            value="VIDEO"
                            name="group1"
                            type={type}
                            id={`inline-${type}-3`}
                            onChange={(event) => {setMtype(event.target.value)}}
                        />
                        </div>
                    ))}
                </InputGroup>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form>
          </Form.Group>
          
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom03">
            <Form.Label>Publisher</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Publisher" 
                onChange={(event) => {setPublisher(event.target.value)}}
              />
            <Form.Control.Feedback type="invalid">
              Please provide a valid publisher.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom04">
            <Form.Label>Publish Date</Form.Label>
            <Form.Control 
              type="date"  
              placeholder="Date" 
              onChange={(event) => {setPubDate(event.target.value)}}
            />
          </Form.Group>
            <Form.Group style={{}} as={Col} md="3" controlId='mediatype'>
            <Form>
              <Form.Label>Category</Form.Label>
                <InputGroup hasValidation>
                {['radio'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                        <Form.Check
                            inline
                            value='ACD'
                            label="Academic"
                            name="group2"
                            type={type}
                            id={`cat-${type}-1`}
                            onChange={(event) => {setCategory(event.target.value)}}
                        />
                        <Form.Check
                            inline
                            value='REF'
                            label="Reference"
                            name="group2"
                            type={type}
                            id={`cat-${type}-2`}
                            onChange={(event) => {setCategory(event.target.value)}}
                        />
                        <Form.Check
                            inline
                            value='ENT'
                            label="Entertainment"
                            name="group2"
                            type={type}
                            id={`cat-${type}-3`}
                            onChange={(event) => {setCategory(event.target.value)}}
                        />
                        </div>
                    ))}
                </InputGroup>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form>
          </Form.Group>
        </Row>
                  {mcontent}
        <Form.Group className="mb-3" controlId="mediadescription">
            <Form.Label>Media Description</Form.Label>
            <InputGroup hasValidation>
                <Form.Control 
                  as="textarea"  
                  placeholder='Enter a short description about the media...' 
                  required 
                  rows={3} 
                  onChange={(event) => {setDescription(event.target.value)}}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid description.
                </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </InputGroup>
        </Form.Group>
        <Form.Group controlId="formFileLg" className="mb-3">
            <InputGroup 
              style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}} 
              hasValidation>
                <Form.Label>Media Upload</Form.Label>
                <Form.Control 
                  name='file'
                  feedback='You must upload a file.' 
                  feedbackType='invalid' 
                  required type="file" 
                  accept={['.pdf','.mp4','.mp3','.wav','.ogg','.mpeg','webm']} 
                  size="lg" 
                  onChange={(e)=>{setFile(e.target.files[0])}} 
                />
            </InputGroup>
        </Form.Group>
        {fcontent}
        <Form.Group className="mb-3">
            <InputGroup hasValidation>
                <Form.Check
                    required
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                    feedbackType="invalid"
                />
          </InputGroup>
        </Form.Group>
        <Button onClick={handleSubmit}>Submit form</Button>
      </Form>
      </section>
    );
  }
  
  export default AddMediaForm;