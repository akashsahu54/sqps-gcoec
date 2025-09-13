// पूरा नया server.js कोड
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes'); // <-- IMPORT NEW ROUTES

// हमारे रूट्स को इम्पोर्ट करें
const paperRoutes = require('./routes/paperRoutes');

const authRoutes = require('./routes/authRoutes'); // <-- IMPORT NEW ROUTES

const app = express();
const PORT = 3001;

// <<<< --- नया कोड --- >>>>
// JSON डेटा को पढ़ने के लिए Express को बताएं (यह बहुत ज़रूरी है)
app.use(express.json());
app.use(cors());

// MongoDB से कनेक्ट करना
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// बेसिक रूट
app.get('/', (req, res) => {
    res.send('Hello from Sqps-GCOEC Backend!');
});

// <<<< --- नया कोड --- >>>>
// Paper Routes का इस्तेमाल करें
// जब भी कोई /api/papers पर आएगा, तो उसे paperRoutes पर भेज दो
app.use('/api/papers', paperRoutes);
app.use('/api/admin', adminRoutes); // <-- USE NEW ADMIN ROUTES
app.use('/api/auth', authRoutes); // <-- USE NEW AUTH ROUTES

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});