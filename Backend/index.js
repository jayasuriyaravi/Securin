require('dotenv').config() //TO ACCESS FROM THE .ENV FILE

require('./Connection/connection');

const cors = require('cors');

const axios = require('axios');

const express = require('express');

const app = express();

app.use(cors());

app.use(express.json());//let server to accept json file as a body

const CVE = require('./Model/schema');


app.get('/details/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cveDetails = await CVE.findOne({ 'vulnerabilities.cve.id': id }, { 'vulnerabilities.$': 1 });
        if (cveDetails) {
            res.send(cveDetails.vulnerabilities[0]); // Return the details of the CVE
        } else {
            res.status(404).json({ error: 'CVE not found' });
        }
    } catch (err) {
        console.error('Error fetching CVE details:', err);
        res.status(500).json({ error: 'Error fetching CVE details' });
    }
});

app.get('/get', async (req, res) => {
    try {
        const data = await CVE.aggregate([
            { $unwind: '$vulnerabilities' }, // Flatten the vulnerabilities array
            { $sort: { 'vulnerabilities.cve.id': 1 } }, // Sort by cve_id in ascending order
            { $group: { _id: '$_id', vulnerabilities: { $push: '$vulnerabilities' } } } // Group the data back into an array
        ]);
        res.send(data);
    }
    catch (err) {
        console.error('Error fetching CVE data:', err);
        res.status(500).json({ error: 'Error fetching CVE data' });
    }
})

app.get('/data', async (req, res) => {
    try {
        const { page = 1, perPage = 10 } = req.query;
        const skipCount = (parseInt(page) - 1) * parseInt(perPage);

        const data = await CVE.aggregate([
            { $unwind: '$vulnerabilities' }, // Flatten the vulnerabilities array
            { $sort: { 'vulnerabilities.cve.id': 1 } }, // Sort by cve_id in ascending order
            { $group: { _id: '$_id', vulnerabilities: { $push: '$vulnerabilities' } } }, // Group the data back into an array
            { $skip: skipCount }, // Skip records based on pagination
            { $limit: parseInt(perPage) } // Limit records based on pagination
        ]);

        res.send(data);
    } catch (err) {
        console.error('Error fetching CVE data:', err);
        res.status(500).json({ error: 'Error fetching CVE data' });
    }
})


app.get('/fetch', async (req, res) => {
    try {
        const { page = 200, perPage = 10 } = req.query;

        const data = await CVE.aggregate([
            {
                $unwind: '$vulnerabilities'
            },
            {
                $sort: { 'vulnerabilities.cve.id': 1 } // Sort by CVE ID in ascending order
            },
            {
                $group: {
                    _id: '$_id',
                    vulnerabilities: { $push: '$vulnerabilities' }
                }
            },
            {
                $project: {
                    vulnerabilities: {
                        $slice: ['$vulnerabilities', (page - 1) * perPage, parseInt(perPage)]
                    }
                }
            }
        ]);
        res.send(data);
        // res.send(totalRecords);
    } catch (err) {
        console.error('Error fetching CVE data:', err);
        res.status(500).json({ error: 'Error fetching CVE data' });
    }
});



app.set('/data', async (req, res) => {
    try {
        const { data } = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0');
        const vulnerabilities = data.vulnerabilities.map(vulnerability => ({
            cve: vulnerability.cve
        }));

        // Insert the retrieved CVE data into MongoDB
        await CVE.insertMany({ vulnerabilities });
        console.log('CVE data saved successfully');
        res.json({ success: true });
    } catch (error) {
        console.error('Error fetching and saving CVE data:', error);
        res.status(500).json({ error: 'Error fetching and saving CVE data' });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => { console.log(`port is ${port} listening`) })


