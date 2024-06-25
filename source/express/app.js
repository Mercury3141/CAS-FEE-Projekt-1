const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const apiRoutes = require('./routes/apiRoutes');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
