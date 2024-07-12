const express = require('express');
const bodyParser = require('body-parser');
const groupRoutes = require('./routes/group-routes.js');
const itemRoutes = require('./routes/item-routes.js');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the defined routes
app.use('/api', groupRoutes);
app.use('/api', itemRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
