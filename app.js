import express from 'express';
import bodyParser from 'body-parser';
import groupRoutes from './routes/group-routes.js';
import itemRoutes from './routes/item-routes.js';

const app = express();
app.use(bodyParser.json());

// Use routes
app.use('/api', groupRoutes);
app.use('/api', itemRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
