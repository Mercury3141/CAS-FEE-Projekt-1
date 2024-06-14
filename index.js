import express from 'express';
import { app } from './source/express/app.js';

const port = 3000;
app.use(express.static('source/public'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});