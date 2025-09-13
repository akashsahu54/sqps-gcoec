const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');

// Middleware to check for the admin password
const authAdmin = (req, res, next) => {
    const password = req.header('admin-password');
    if (password === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: Invalid admin password' });
    }
};

// @route   GET /api/admin/pending
// @desc    Get all pending (unapproved) submissions
// @access  Admin only
router.get('/pending', authAdmin, async (req, res) => {
    try {
        const pendingPapers = await Paper.find({ isApproved: false });
        res.json(pendingPapers);
    } catch (error) {
        console.error('Error fetching pending papers:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PATCH /api/admin/approve/:id
// @desc    Approve a submission
// @access  Admin only
router.patch('/approve/:id', authAdmin, async (req, res) => {
    try {
        const paper = await Paper.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        res.json({ message: 'Paper approved successfully', paper });
    } catch (error) {
        console.error('Error approving paper:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/admin/reject/:id
// @desc    Reject (delete) a submission
// @access  Admin only
router.delete('/reject/:id', authAdmin, async (req, res) => {
    try {
        const paper = await Paper.findByIdAndDelete(req.params.id);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        // Here you might also want to delete the file from Google Drive in a real-world scenario
        res.json({ message: 'Paper rejected and deleted successfully' });
    } catch (error) {
        console.error('Error rejecting paper:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router; // THIS LINE IS CRUCIAL
