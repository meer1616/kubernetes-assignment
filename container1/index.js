const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

const FILE_PATH = './MEER_PV_dir/';
// const FILE_PATH = '../here/';

// Ensure the directory exists
if (!fs.existsSync(FILE_PATH)) {
    fs.mkdirSync(FILE_PATH, { recursive: true });
}

app.post('/store-file', (req, res) => {
    const { file, data } = req.body;
    if (!file || !data) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    const filePath = `${FILE_PATH}${file}`;

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error('Error while storing the file:', err); // Improved error logging
            return res.status(500).json({ file, error: 'Error while storing the file to the storage.' });
        }
        res.json({ file, message: 'Success.' });
    });
});

const CALCULATOR_URL = 'http://c2-service:8081/sum';
// const CALCULATOR_URL = 'http://localhost:8081/sum';

app.post('/calculate', async (req, res) => {
    const { file, product } = req.body;

    if (!file) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    // const filePath = path.join(FILE_PATH, file);
    const filePath = `${FILE_PATH}${file}`;


    if (!fs.existsSync(filePath)) {
        console.log("File not found:", filePath);
        return res.status(404).json({ file, error: 'File not found.' });
    }

    try {
        console.log("reachhere", CALCULATOR_URL, file, product)
        const response = await axios.post(CALCULATOR_URL, { file, product });
        return res.json(response.data);
    } catch (error) {
        console.error('Error during calculate request:', error);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        } else {
            return res.status(500).json({ file, error: 'Internal Server Error' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
