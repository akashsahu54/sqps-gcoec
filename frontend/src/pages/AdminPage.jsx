import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Spinner, Form } from 'react-bootstrap'; // <-- THE FIX IS HERE
import { Link } from 'react-router-dom';

function AdminPage() {
    const [pendingPapers, setPendingPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchPending = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/admin/pending', {
                headers: { 'X-Admin-Password': password }
            });
            setPendingPapers(res.data);
        } catch (err) {
            alert('Authentication failed or error fetching papers.');
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password) {
            setIsAuthenticated(true);
            setLoading(true);
            fetchPending();
        } else {
            alert('Please enter the admin password.');
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.patch(`http://localhost:3001/api/admin/approve/${id}`, {}, {
                headers: { 'X-Admin-Password': password }
            });
            setPendingPapers(pendingPapers.filter(p => p._id !== id));
            alert('Paper approved!');
        } catch (err) {
            alert('Failed to approve paper.');
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to reject and delete this submission?')) {
            try {
                await axios.delete(`http://localhost:3001/api/admin/reject/${id}`, {
                    headers: { 'X-Admin-Password': password }
                });
                setPendingPapers(pendingPapers.filter(p => p._id !== id));
                alert('Paper rejected and deleted.');
            } catch (err) {
                alert('Failed to reject paper.');
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Card className="p-4 shadow" style={{ width: '400px' }}>
                    <h2 className="text-center mb-4">Admin Login</h2>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="password" 
                                placeholder="Enter Admin Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Login</Button>
                    </Form>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Link to="/" className="text-decoration-none mb-4 d-inline-block">&larr; Back to Homepage</Link>
            <h1 className="mb-4">Admin Dashboard</h1>
            <h3 className="text-muted mb-4">Pending Submissions ({pendingPapers.length})</h3>
            {loading ? <Spinner animation="border" /> : (
                pendingPapers.length > 0 ? (
                    pendingPapers.map(paper => (
                        <Card key={paper._id} className="mb-3 shadow-sm">
                            <Card.Body>
                                <Card.Title>{paper.subjectName} ({paper.subjectCode})</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{paper.studyMaterialType}</Card.Subtitle>
                                <p><strong>Branch:</strong> {paper.branch} | <strong>Sem:</strong> {paper.semester} | <strong>Year:</strong> {paper.year}</p>
                                {paper.description && <p><strong>Description:</strong> {paper.description}</p>}
                                <Button variant="link" href={paper.paperURL} target="_blank" rel="noopener noreferrer">View Document</Button>
                                <div className="mt-3">
                                    <Button variant="success" className="me-2" onClick={() => handleApprove(paper._id)}>Approve</Button>
                                    <Button variant="danger" onClick={() => handleReject(paper._id)}>Reject</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                ) : <p>No pending submissions.</p>
            )}
        </Container>
    );
}

export default AdminPage;
