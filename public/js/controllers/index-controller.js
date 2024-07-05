import { itemService } from '../services/item-service.js'


const btnAddGroup = document.getElementById("add-group");
const btnSortImportnant = document.getElementById("sort-important");
const btnSortDate = document.getElementById("sort-date");
const btnClear = document.getElementById("clear");
const GroupContainer = document.getElementById("group-container");

const groupRenderer = Handlebars.compile(document.getElementById("group-template").innerHTML);

btnAddGroup.addEventListener("click", async event => {
    event.preventDefault();

    await itemService.createItem(inputPizza.value)
    renderOrders();
    inputPizza.value = "";
});


// cbxgroup-checkbox.addEventListener("click", async event => {
//     event.preventDefault();
//
//     await orderService.createPizza(inputPizza.value)
//     renderGroups();
//     inputPizza.value = "";
// });
//
//
// groupCheckbox.addEventListener("change", () => {
//     const isChecked = groupCheckbox.checked;
//     groupLabel.classList.toggle("strikethrough", isChecked);
//
//     reminderCheckboxes.forEach(checkbox => {
//         checkbox.checked = isChecked;
//     });
// });





btnLogin.addEventListener("click", async () => {
    await authService.login("admin@admin.ch", "123456");
    updateStatus();
});

btnLogout.addEventListener("click", ()  => {
    authService.logout();
    updateStatus();
});

async function renderOrders() {
    ordersContainer.innerHTML = ordersRenderer({orders: await orderService.getOrders()});
}

ordersContainer.addEventListener("click", async function (event) {
    if(event.target.classList.contains("js-delete")){

        await orderService.deleteOrder(event.target.dataset.id);
        await renderOrders()
    }
});

function updateStatus() {
    Array.from(document.querySelectorAll(".js-non-user")).forEach(x=>x.classList.toggle("hidden", authService.isLoggedIn()))
    Array.from(document.querySelectorAll(".js-user")).forEach(x=>x.classList.toggle("hidden", !authService.isLoggedIn()))

    if (authService.isLoggedIn()) {
        renderOrders();
    }
}
updateStatus();


// // Have to place in correct .js file:
//
// document.querySelectorAll('input[type="text"]').forEach(input => {
//     input.addEventListener('input', function() {
//         this.setAttribute('aria-label', this.value || this.placeholder);
//     });
// });
//
//
//
//
// {
//     groups: [
//         {
//             groupName: "New Group",
//             itemName: "New Reminder",
//             isChecked: true,
//             important: true,
//             dueDate: "2024-07-01",
//             dueDateText: "Due tomorrow"
//         }
//     ]
// }
//
//
//
//
// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelectorAll('input[id^="group-checkbox-"]').forEach(groupCheckbox => {
//         groupCheckbox.addEventListener('change', function() {
//             const groupIndex = this.id.split('-')[2];
//             const isChecked = this.checked;
//             document.querySelectorAll(`#item-${groupIndex} input[type="checkbox"]`).forEach(itemCheckbox => {
//                 itemCheckbox.checked = isChecked;
//             });
//         });
//     });
// });
//
//
//
//
// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelectorAll('input[type="date"]').forEach(dateInput => {
//         dateInput.addEventListener('input', function() {
//             const dueDateText = this.nextElementSibling;
//             if (this.value) {
//                 dueDateText.style.display = 'block';
//             } else {
//                 dueDateText.style.display = 'none';
//             }
//         });
//         dateInput.dispatchEvent(new Event('input'));
//     });
// });
//
//
//
//
// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
//         checkbox.addEventListener('change', function() {
//             const inputField = this.nextElementSibling;
//             if (this.checked) {
//                 inputField.style.textDecoration = 'line-through';
//             } else {
//                 inputField.style.textDecoration = 'none';
//             }
//         });
//     });
// });
//
//
//
//
// let resizeTimeout;
// window.addEventListener('resize', () => {
//     clearTimeout(resizeTimeout);
//     resizeTimeout = setTimeout(() => {
//         // Your resize handling logic here
//     }, 100);
// });
//
// // Assuming you have an array of items with dueDate properties
// const items = [
//     { dueDate: '2024-07-15', isChecked: false, itemName: 'Buy groceries', important: false },
//     { dueDate: '2024-07-01', isChecked: true, itemName: 'Submit report', important: true },
//     { dueDate: '', isChecked: false, itemName: 'Plan vacation', important: false }
// ];
//
//
//
// function formatDueDate(dueDate) {
//     if (!dueDate) {
//         return 'No specific due date';
//     }
//
//     const currentDate = new Date();
//     const dueDateObj = new Date(dueDate);
//     const timeDifference = dueDateObj - currentDate;
//     const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
//
//     if (daysDifference > 0) {
//         return `Due in ${daysDifference} day${daysDifference > 1 ? 's' : ''}`;
//     } else if (daysDifference === 0) {
//         return 'Due today';
//     } else {
//         return `Overdue since ${dueDateObj.toLocaleDateString()}`;
//     }
// }
//
//
//
// function updateDueDateTexts() {
//     items.forEach((item, index) => {
//         const dueDateText = formatDueDate(item.dueDate);
//         const dueDateTextElement = document.getElementById(`due-date-text-0-${index}`);
//         dueDateTextElement.textContent = dueDateText;
//     });
// }
//
//
//
// // Call this function after rendering the list
// updateDueDateTexts();
