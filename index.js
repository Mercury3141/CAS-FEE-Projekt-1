const express = require('express');
const { app } = require('./app');

const port = 3000;
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/html/index.html`);
});
