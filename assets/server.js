const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve your static files (HTML, CSS, JS)

// Save reminders to a JSON file
app.post('/save', (req, res) => {
    const data = JSON.stringify(req.body, null, 2);
    fs.writeFile('reminders.json', data, (err) => {
        if (err) {
            res.status(500).send('Error saving reminders');
            return;
        }
        res.send('Reminders saved');
    });
});

// Load reminders from a JSON file
app.get('/load', (req, res) => {
    fs.readFile('reminders.json', (err, data) => {
        if (err) {
            res.status(500).send('Error loading reminders');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
