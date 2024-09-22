const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());


app.use(bodyParser.json());

// Store uploaded files temporarily
const upload = multer();

// Sample user details
const userDetails = {
    fullName: 'john_doe_17091999',
    email: 'john@xyz.com',
    rollNumber: 'ABCD123'
};

// Helper function to process data
const processData = (data) => {
    const numbers = [];
    const alphabets = [];
    let highestLowercase = '';

    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (/[a-zA-Z]/.test(item)) {
            alphabets.push(item);
            if (item === item.toLowerCase() && item > highestLowercase) {
                highestLowercase = item;
            }
        }
    });

    return {
        numbers,
        alphabets,
        highestLowercase: highestLowercase ? [highestLowercase] : []
    };
};

// POST endpoint
app.post('/bfhl', upload.single('file'), (req, res) => {
    const { data, file_b64 } = req.body;

    // Process input data
    const { numbers, alphabets, highestLowercase } = processData(data);

    // Validate file
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = 0;

    if (file_b64) {
        const fileBuffer = Buffer.from(file_b64, 'base64');
        fileValid = true; // Validate your file as needed
        fileMimeType = 'image/png'; // Replace with logic to determine MIME type
        fileSizeKb = (fileBuffer.length / 1024).toFixed(2);
    }

    res.json({
        is_success: true,
        user_id: userDetails.fullName,
        email: userDetails.email,
        roll_number: userDetails.rollNumber,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase,
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKb
    });
});

// GET endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
