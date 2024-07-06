const app = require('./app');
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/html/index.html`);
});



/*
const express = require('express');
const { app } = require('./app.js');

const port = 3000;
app.use(express.static('source/public'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
*/
