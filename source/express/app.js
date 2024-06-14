import express from 'express';

const app = express();

// Middleware, routes, and other configurations go here
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

export { app };