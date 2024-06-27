const express = require('express');
const { app } = require('./app.js');

const port = 3000;
app.use(express.static('source/public'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
