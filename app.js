const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const groupRoutes = require('./routes/group-routes');
const itemRoutes = require('./routes/item-routes');

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', groupRoutes);
app.use('/api', itemRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
