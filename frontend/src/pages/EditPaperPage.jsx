import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditPaperPage() {
    const [paperData, setPaperData] = useState({
        branch: '',
        semester: '',
        subjectName: '',
        subjectCode: '',
        examType: '',
        year: '',
    });
    const { id } = useParams(); // URL se paper ki ID nikalne ke liye
    const navigate = useNavigate(); // Update ke baad redirect karne ke liye

    // Pehle paper ka purana data fetch karo
    useEffect(() => {
        const fetchPaper = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/papers/${id}`);
                setPaperData(response.data);
            } catch (error) {
                console.error("Failed to fetch paper data:", error);
            }
        };
        fetchPaper();
    }, [id]);

    // Form mein kuch badlav hone par state update karo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaperData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Form submit hone par
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/papers/${id}`, paperData);
            alert('Paper updated successfully!');
            navigate('/'); // Homepage par wapas bhej do
        } catch (error) {
            console.error("Failed to update paper:", error);
            alert('Failed to update paper.');
        }
    };

    return (
        <div className="edit-form-container">
            <h1>Edit Question Paper</h1>
            <form onSubmit={handleSubmit}>
                <label>Subject Name:</label>
                <input type="text" name="subjectName" value={paperData.subjectName} onChange={handleChange} required />

                <label>Subject Code:</label>
                <input type="text" name="subjectCode" value={paperData.subjectCode} onChange={handleChange} />

                <label>Branch:</label>
                <input type="text" name="branch" value={paperData.branch} onChange={handleChange} required />

                <label>Semester:</label>
                <input type="number" name="semester" value={paperData.semester} onChange={handleChange} required />

                <label>Year:</label>
                <input type="number" name="year" value={paperData.year} onChange={handleChange} required />

                <label>Exam Type:</label>
                <input type="text" name="examType" value={paperData.examType} onChange={handleChange} required />

                <button type="submit">Update Paper</button>
            </form>
        </div>
    );
}

export default EditPaperPage;