import { addGroup } from './item-controller.js';

// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    // Add event listener to the "add-group" button
    document.getElementById('add-group').addEventListener('click', () => {
        addGroup();
    });
});
