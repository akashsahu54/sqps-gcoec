import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Spinner, InputGroup, FloatingLabel } from 'react-bootstrap';

function HomePage() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); // New state to track if a search has been made

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        branch: '', semester: '', year: '', studyMaterialType: ''
    });

    const branches = ["CSE", "ME", "CE", "IE", "EE", "ENTC"];
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const materialTypes = ["Question Paper", "Notes", "PYQ Solution", "Other"];

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        setLoading(true);
        setHasSearched(true); // Mark that a search has been performed
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('searchTerm', searchTerm);
            for (const key in filters) {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            }
            const response = await axios.get(`http://localhost:3001/api/papers?${params.toString()}`);
            setPapers(response.data);
        } catch (error) {
            console.error("Error fetching papers:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="homepage-container">
            <Container>
                <div className="search-box">
                    <h1 className="main-title">Intelligent Material Search</h1>
                    <p className="subtitle">Use the filters below to find the exact material you need.</p>
                    
                    <Row className="g-2 mb-3">
                        <Col md>
                            <FloatingLabel controlId="floatingSearch" label="Search by Subject Name, Code, or Description">
                                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </FloatingLabel>
                        </Col>
                    </Row>

                    <Row className="g-2 mb-3">
                        <Col md><Form.Select name="branch" value={filters.branch} onChange={handleFilterChange}><option value="">Select Branch</option>{branches.map(b => <option key={b} value={b}>{b}</option>)}</Form.Select></Col>
                        <Col md><Form.Select name="semester" value={filters.semester} onChange={handleFilterChange}><option value="">Select Semester</option>{semesters.map(s => <option key={s} value={s}>{s}</option>)}</Form.Select></Col>
                        <Col md><Form.Select name="year" value={filters.year} onChange={handleFilterChange}><option value="">Select Year</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</Form.Select></Col>
                        <Col md><Form.Select name="studyMaterialType" value={filters.studyMaterialType} onChange={handleFilterChange}><option value="">Select Type</option>{materialTypes.map(t => <option key={t} value={t}>{t}</option>)}</Form.Select></Col>
                    </Row>
                    
                    <div className="d-flex justify-content-center gap-2">
                        <Button variant="primary" onClick={handleSearch} disabled={loading} size="lg">
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Search'}
                        </Button>
                        <Link to="/add-paper" className="btn btn-outline-light btn-lg">Upload Material</Link>
                    </div>
                </div>

                {hasSearched && (
                    <div className="results-container mt-5">
                        {loading ? (
                            <div className="text-center"><Spinner animation="border" /></div>
                        ) : papers.length > 0 ? (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {papers.map((paper) => (
                                    <Col key={paper._id}>
                                        <Card className="h-100 paper-card">
                                            <Card.Body>
                                                <Card.Title>{paper.subjectName} ({paper.subjectCode})</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">{paper.branch} - Sem {paper.semester}</Card.Subtitle>
                                                <Card.Text>
                                                    <strong>Year:</strong> {paper.year} <br />
                                                    <strong>Type:</strong> {paper.studyMaterialType}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Link to={`/paper/${paper._id}`} className="btn btn-primary btn-sm">View Details</Link>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className="text-center empty-state">
                                <h3>No materials found with these filters.</h3>
                                <p>Try a different combination or a broader search term.</p>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
}

export default HomePage;
