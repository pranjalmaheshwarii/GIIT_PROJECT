const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const host = 'http://backend-app:8000';

// Render the home page
router.get('/', (req, res) => {
    res.render('index');
});

// Render the page to add data
router.get('/addData', (req, res) => {
    res.render('addData');
});

// Handle POST request to add data
router.post('/addData', async (req, res) => {
    const empData = {
        emp_name: req.body.emp_name,
        emp_contact: req.body.emp_contact,
        emp_add: req.body.emp_add
    };
    console.log(empData);

    try {
        const response = await fetch(`${host}/employees`, {
            method: 'POST',
            body: JSON.stringify(empData),
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.render('submitResponse', { data });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// List all employees
router.get('/list-employees', async (req, res) => {
    try {
        const response = await fetch(`${host}/employees`, {
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.render('listEmployee', { data });
    } catch (error) {
        console.error('Error listing employees:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete an employee
router.get('/delete/:emp_id', async (req, res) => {
    const emp_id = req.params.emp_id;
    try {
        const response = await fetch(`${host}/employees/${emp_id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Fetch the updated list of employees
        const listResponse = await fetch(`${host}/employees`, {
            headers: {'Content-Type': 'application/json'}
        });

        if (!listResponse.ok) {
            throw new Error(`HTTP error! status: ${listResponse.status}`);
        }

        const data = await listResponse.json();
        res.render('listEmployee', { data });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

