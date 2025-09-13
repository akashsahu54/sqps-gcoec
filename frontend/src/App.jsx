import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import PaperDetailPage from './pages/PaperDetailPage';
import EditPaperPage from './pages/EditPaperPage';
import AddPaperPage from './pages/AddPaperPage';
import AdminPage from './pages/AdminPage';
import HelpPage from './pages/HelpPage';
import './App.css';

function App() {
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.body.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <Router>
            <div className="App">
                <Navbar expand="lg" variant={theme} className="app-navbar">
                    <Container>
                        <Navbar.Brand as={Link} to="/" className="fw-bold">Sqps-Gcoec</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/">Home</Nav.Link>
                                <Nav.Link as={Link} to="/add-paper">Upload</Nav.Link>
                                <Nav.Link as={Link} to="/help">Help</Nav.Link>
                            </Nav>
                            <Button variant="outline-secondary" onClick={toggleTheme} size="sm">
                                {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
                            </Button>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/add-paper" element={<AddPaperPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/paper/:id" element={<PaperDetailPage />} />
                        <Route path="/paper/edit/:id" element={<EditPaperPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
