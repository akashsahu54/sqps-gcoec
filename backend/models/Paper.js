const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
    branch: { type: String, required: true },
    semester: { type: Number, required: true },
    subjectName: { type: String, required: true },
    subjectCode: { type: String },
    year: { type: Number, required: true },
    studyMaterialType: { type: String, required: true },
    description: { type: String },
    paperURL: { type: String, required: true },
    isApproved: { type: Boolean, default: false },

    // New optional fields for Question Papers
    session: { type: String }, // e.g., 'Summer', 'Winter'
    examName: { type: String }, // e.g., 'Sessional 1', 'Final Exam'
    
}, {
    timestamps: true
});

const Paper = mongoose.model('Paper', paperSchema);

module.exports = Paper;
