import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function PaperDetailPage() {
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/papers/${id}`);
                setPaper(res.data);
            } catch (err) {
                console.error("Failed to fetch paper details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPaper();
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!paper) {
        return <Container className="text-center my-5"><h2>Paper not found.</h2></Container>;
    }

    // --- THE CORRECT FIX IS HERE ---
    const getDownloadableUrl = (url) => {
        // Check if the URL is a Cloudinary raw file URL
        if (url.includes('/raw/upload/')) {
            // Replace '/raw/upload/' with '/image/upload/fl_attachment/'
            return url.replace('/raw/upload/', '/image/upload/fl_attachment/');
        }
        return url; // Fallback to original url if it's not a raw upload
    };
    
    const downloadableUrl = getDownloadableUrl(paper.paperURL);
    // --- END OF FIX ---

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-lg">
                        <Card.Header as="h4">{paper.subjectName} ({paper.subjectCode})</Card.Header>
                        <Card.Body className="p-4">
                            <Card.Subtitle className="mb-3 text-muted">{paper.studyMaterialType}</Card.Subtitle>
                            <p><strong>Branch:</strong> {paper.branch}</p>
                            <p><strong>Semester:</strong> {paper.semester}</p>
                            <p><strong>Year:</strong> {paper.year}</p>
                            {paper.session && <p><strong>Session:</strong> {paper.session}</p>}
                            {paper.examName && <p><strong>Exam:</strong> {paper.examName}</p>}
                            {paper.description && <p><strong>Description:</strong> {paper.description}</p>}
                            <div className="d-grid gap-2 mt-4">
                                <Button variant="primary" size="lg" href={downloadableUrl} target="_blank" rel="noopener noreferrer">
                                    View / Download Document
                                </Button>
                                <Button as={Link} to="/" variant="secondary">
                                    &larr; Back to Search
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PaperDetailPage;
