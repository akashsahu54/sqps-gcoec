import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Row, Col, FloatingLabel, Spinner, Alert } from 'react-bootstrap';

function AddPaperPage() {
    const [formData, setFormData] = useState({
        subjectName: '', subjectCode: '', branch: '', semester: '', year: '', 
        studyMaterialType: 'Question Paper', description: '', session: 'Summer', examName: 'Sessional 1'
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const branches = ["CSE", "ME", "CE", "IE", "EE", "ENTC"];
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const materialTypes = ["Question Paper", "Notes", "PYQ Solution", "Other"];
    const sessions = ["Summer", "Winter"];
    const examNames = ["Sessional 1", "Sessional 2", "Final Exam"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }
        setLoading(true);
        setError('');

        const uploadData = new FormData();
        uploadData.append('file', file);
        for (const key in formData) {
            uploadData.append(key, formData[key]);
        }

        try {
            const response = await axios.post('http://localhost:3001/api/papers/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(response.data.message);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "An unknown error occurred during upload.");
            console.error("Upload failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <div className="form-container">
                        <h1 className="form-title">Upload New Study Material</h1>
                        <p className="form-subtitle">Contribute to the community by sharing knowledge</p>
                        
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}><FloatingLabel controlId="subjectName" label="Subject Name" className="mb-3"><Form.Control type="text" name="subjectName" onChange={handleChange} required /></FloatingLabel></Col>
                                <Col md={6}><FloatingLabel controlId="subjectCode" label="Subject Code (e.g. CSE301)" className="mb-3"><Form.Control type="text" name="subjectCode" onChange={handleChange} /></FloatingLabel></Col>
                            </Row>
                            <Row>
                                <Col md={6}><Form.Select name="branch" onChange={handleChange} required className="mb-3"><option>Select Branch</option>{branches.map(b => <option key={b} value={b}>{b}</option>)}</Form.Select></Col>
                                <Col md={6}><Form.Select name="semester" onChange={handleChange} required className="mb-3"><option>Select Semester</option>{semesters.map(s => <option key={s} value={s}>{s}</option>)}</Form.Select></Col>
                            </Row>
                            <Row>
                                <Col md={6}><Form.Select name="year" onChange={handleChange} required className="mb-3"><option>Select Year</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</Form.Select></Col>
                                <Col md={6}><Form.Select name="studyMaterialType" onChange={handleChange} value={formData.studyMaterialType} required className="mb-3">{materialTypes.map(t => <option key={t} value={t}>{t}</option>)}</Form.Select></Col>
                            </Row>

                            {formData.studyMaterialType === 'Question Paper' && (
                                <Row>
                                    <Col md={6}><Form.Select name="session" onChange={handleChange} required className="mb-3">{sessions.map(s => <option key={s} value={s}>{s}</option>)}</Form.Select></Col>
                                    <Col md={6}><Form.Select name="examName" onChange={handleChange} required className="mb-3">{examNames.map(e => <option key={e} value={e}>{e}</option>)}</Form.Select></Col>
                                </Row>
                            )}
                            
                            <FloatingLabel controlId="description" label="Add a short description (optional)" className="mb-3">
                                <Form.Control as="textarea" name="description" style={{ height: '100px' }} onChange={handleChange} />
                            </FloatingLabel>

                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Select File (PDF, Word, PPT)</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} required />
                            </Form.Group>

                            <Button variant="primary" type="submit" disabled={loading} className="w-100 py-2">
                                {loading ? <><Spinner as="span" animation="border" size="sm" /> Uploading...</> : 'Upload Material'}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AddPaperPage;
