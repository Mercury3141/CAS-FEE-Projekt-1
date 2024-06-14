import ReminderApp from '../utils/classes.js';

document.addEventListener('DOMContentLoaded', async () => {
    const app = new ReminderApp();
    await app.init();
});
