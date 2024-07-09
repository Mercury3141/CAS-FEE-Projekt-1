import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import groupRoutes from './routes/group-routes.js';
import indexRoutes from './routes/index-routes.js';
import itemRoutes from './routes/item-routes.js';

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set the static files location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/api/groups', groupRoutes);
app.use('/api/items', itemRoutes);
app.use('/', indexRoutes);

// Fallback route for handling 404
app.use((req, res) => {
    res.status(404).send('404: Not Found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
