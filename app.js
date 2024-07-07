import express from 'express';
import bodyParser from 'body-parser';
// import { router } from './routes/item-routes.js';

const app = express();

app.use(bodyParser.json());
app.use('/api', itemRoutes);

let groups = [
    { id: 1, order: 0, groupName: 'Group 1', checked: false, items: [] },
    { id: 2, order: 1, groupName: 'Group 2', checked: false, items: [] }
];

app.get('/groups', (req, res) => {
    res.status(200).json(groups);
});

export { app };
