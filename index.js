import express from 'express';
import { app } from './app.js';

const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/html/index.html`);
});
