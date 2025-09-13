import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HelpPage() {
    return (
        <div>
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold">User Guide</h1>
                <p className="lead text-muted">How to use the Sqps-Gcoec platform effectively.</p>
            </div>

            <Row className="g-4">
                <Col lg={4}>
                    <Card className="h-100">
                        <Card.Body className="p-4">
                            <div className="fs-2 mb-3">🔍</div>
                            <Card.Title as="h3">Searching for Materials</Card.Title>
                            <Card.Text>
                                The homepage is your main search portal. Use the search bar to find materials by subject name or code. You can also use the dropdowns to filter by branch, semester, year, and material type to narrow down your results.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="h-100">
                        <Card.Body className="p-4">
                            <div className="fs-2 mb-3">📤</div>
                            <Card.Title as="h3">Uploading Your Materials</Card.Title>
                            <Card.Text>
                                Click the "Upload" button in the navigation bar. Fill out all the details about the material and select your file (PDF, PPT, or Word). Your submission will be sent to an admin for review before it becomes public.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="h-100">
                        <Card.Body className="p-4">
                            <div className="fs-2 mb-3">🛡️</div>
                            <Card.Title as="h3">Admin Review Process</Card.Title>
                            <Card.Text>
                                To maintain quality, every submission is reviewed by an admin. This ensures that all materials are relevant and appropriate for the community. You can log in as an admin via the <Link to="/admin">Admin Login</Link> page to manage submissions.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default HelpPage;
