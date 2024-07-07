const AppController = require('./controller/app-controller');

const appController = new AppController();

// Create a new group
const newGroup = { name: 'Test Group', members: ['Alice', 'Bob'] };
appController.createGroup(newGroup);

// Log all groups to verify
console.log('Current groups:', appController.getGroups());
