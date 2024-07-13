const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const groupRoutes = require('./routes/group-routes');
const itemRoutes = require('./routes/item-routes');

app.use(bodyParser.json());
app.use('/api', groupRoutes);
app.use('/api', itemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
