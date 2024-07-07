import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// For __dirname and __filename in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up the public directory to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Additional route files
import indexRoutes from './routes/index-routes.js';
import itemRoutes from './routes/item-routes.js';

// Use the routes
app.use('/api', indexRoutes);
app.use('/api/items', itemRoutes);

export default app;
