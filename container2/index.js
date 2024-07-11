const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 8081;
// const FILE_PATH = '../here/'; // Update this path as needed
const FILE_PATH = './MEER_PV_dir/';

app.use(express.json());

app.post('/sum', (req, res) => {
    const { file, product } = req.body;

    const filePath = `${FILE_PATH}${file}`;
    console.log("filePath", filePath);
    const recordsOfCsv = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Clean up keys and values
            const cleanedRow = {};
            for (let key in row) {
                cleanedRow[key.trim()] = row[key].trim();
            }
            recordsOfCsv.push(cleanedRow);
        })
        .on('end', () => {
            console.log("recordsOfCsv length", recordsOfCsv.length);
            if (!recordsOfCsv.length || !recordsOfCsv[0].product || !recordsOfCsv[0].amount) {
                return res.status(500).json({ file, error: 'Input file not in CSV format.' });
            }

            const sum = recordsOfCsv.reduce((accum, record) => {
                if (record.product === product) {
                    accum += parseInt(record.amount, 10);
                }
                return accum;
            }, 0);

            return res.json({ file, sum });
        })
        .on('error', (err) => {
            console.error('Error parsing CSV file:', err);
            return res.status(500).json({ file, error: 'Error parsing CSV file.' });
        });
});

app.listen(port, () => {
    console.log(`Container 2 listening at http://localhost:${port}`);
});
