import ReminderApp from '../utils/classes.js';

$(document).ready(async () => {
    const app = new ReminderApp();
    await app.init();
});
