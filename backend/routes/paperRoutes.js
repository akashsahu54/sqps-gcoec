const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const multer = require('multer');
const { uploadToGoogleDrive } = require('../utils/googleDriveUpload');

// Multer setup for temporary file storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   POST /api/papers/upload
// @desc    Handle the entire upload process
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const body = req.body;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // 1. Upload the file to Google Drive
        const fileUrl = await uploadToGoogleDrive(file);
        if (!fileUrl) {
            return res.status(500).json({ message: 'Failed to upload file to Google Drive.' });
        }

        // 2. Create a new paper document with the file URL and other details
        const newPaper = new Paper({
            branch: body.branch,
            semester: body.semester,
            subjectName: body.subjectName,
            subjectCode: body.subjectCode,
            examType: body.examType, // This field might not be in the final form, but we handle it
            year: body.year,
            studyMaterialType: body.studyMaterialType,
            description: body.description,
            session: body.session,
            examName: body.examName,
            paperURL: fileUrl, // Use the URL from Google Drive
            isApproved: false // Always set to false initially for admin review
        });

        // 3. Save the document to MongoDB
        const savedPaper = await newPaper.save();

        res.status(201).json({ 
            message: 'Submission successful! Your material has been sent for admin review.',
            paper: savedPaper 
        });

    } catch (error) {
        console.error('Error in upload route:', error);
        res.status(500).json({ message: 'Server error during upload process.' });
    }
});


// @route   GET /api/papers
// @desc    Get all APPROVED papers with advanced search and filtering
router.get('/', async (req, res) => {
    try {
        const { searchTerm, branch, semester, year, studyMaterialType } = req.query;

        // Start with the base filter to only get approved papers
        const filter = { isApproved: true };

        if (branch) filter.branch = branch;
        if (semester) filter.semester = semester;
        if (year) filter.year = year;
        if (studyMaterialType) filter.studyMaterialType = studyMaterialType;

        if (searchTerm) {
            filter.$or = [
                { subjectName: { $regex: searchTerm, $options: 'i' } },
                { subjectCode: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const papers = await Paper.find(filter);
        res.status(200).json(papers);

    } catch (error) {
        console.error('Error fetching papers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/papers/:id
// @desc    Get a single question paper by its ID
router.get('/:id', async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        res.status(200).json(paper);
    } catch (error) {
        console.error('Error fetching single paper:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router; // THIS LINE IS CRUCIAL
