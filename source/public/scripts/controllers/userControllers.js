import { createNewListGroup, createNewReminder, clearCheckedRemindersAndGroups, loadListGroups, saveState, updateGroupTitle, updateReminderText } from '../utils/functions.js';
import { ReminderApp } from '../utils/classes.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new ReminderApp();
    app.init();
});
