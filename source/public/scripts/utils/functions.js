import { getListGroups, saveListGroups, updateListGroup } from './noteService.js';

export async function createNewListGroup(listGroups, groupIdCounter, renderListGroups, saveState, toggleClearButtonState) {
    try {
        const newListGroup = {
            id: groupIdCounter++,
            title: 'New Reminder',
            userInputted: false,
            reminders: []
        };
        listGroups.push(newListGroup);
        await saveState(listGroups);
        renderListGroups();
        toggleClearButtonState(listGroups); // Ensure button state is updated
    } catch (error) {
        console.error('Error creating new list group:', error);
    }
    return { listGroups, groupIdCounter };
}

export async function createNewReminder(listGroups, reminderIdCounter, groupId, renderListGroups, saveState, toggleClearButtonState) {
    try {
        const listGroup = listGroups.find(group => group.id === groupId);
        const newReminder = {
            id: reminderIdCounter++,
            text: 'New Reminder',
            userInputted: false,
            date: null,
            important: false,
            checked: false
        };
        listGroup.reminders.push(newReminder);
        await saveState(listGroups);
        renderListGroups();
        toggleClearButtonState(listGroups); // Ensure button state is updated
    } catch (error) {
        console.error('Error creating new reminder:', error);
    }
    return { listGroups, reminderIdCounter };
}

export async function saveState(listGroups) {
    try {
        await saveListGroups(listGroups);
    } catch (error) {
        console.error('Error saving list groups:', error);
    }
}

export function renderListGroups(listGroups, compiledListGroupTemplate, renderReminders, addListGroupEventListeners, toggleClearButtonState, toggleDateButtonState, toggleImportantButtonState) {
    const $flexContainerElements = $('#flex-container-elements');
    $flexContainerElements.empty();
    listGroups.forEach(group => {
        const newListGroupHtml = compiledListGroupTemplate(group);
        const $listGroupElement = $(newListGroupHtml);
        $flexContainerElements.append($listGroupElement);
        renderReminders(group, $listGroupElement.find('.reminders-container'));
        addListGroupEventListeners($listGroupElement, group.id);
    });
    toggleClearButtonState(listGroups);
    toggleDateButtonState();
    toggleImportantButtonState();
}

export function renderReminders(group, $remindersContainer, compiledReminderTemplate, addReminderEventListeners) {
    $remindersContainer.empty();
    group.reminders.forEach(reminder => {
        const newReminderHtml = compiledReminderTemplate(reminder);
        const $reminderElement = $(newReminderHtml);
        $remindersContainer.append($reminderElement);
        addReminderEventListeners($reminderElement, group.id, reminder.id);

        $reminderElement.find(`#checkbox-${reminder.id}`).prop('checked', reminder.checked);
        $reminderElement.find(`#date-${reminder.id}`).val(reminder.date);
        $reminderElement.find(`#label-${reminder.id}`).text(reminder.text);
        $reminderElement.find(`#button-${reminder.id}`).text(reminder.important ? '!!' : '!');
    });
}

export async function loadListGroups(renderListGroups, toggleClearButtonState) {
    try {
        const listGroups = await getListGroups();
        renderListGroups(listGroups);
        toggleClearButtonState(listGroups);
    } catch (error) {
        console.error('Error loading list groups:', error);
    }
    return listGroups;
}

export async function clearCheckedRemindersAndGroups(listGroups, saveState, renderListGroups, toggleClearButtonState) {
    try {
        listGroups = listGroups.filter(group => {
            const $groupCheckbox = $(`#group-checkbox-${group.id}`);
            const isGroupChecked = $groupCheckbox.is(':checked');
            const isGroupUserInputted = group.userInputted;
            const isGroupEmptyTitle = group.title.trim() === 'New Reminder';

            group.reminders = group.reminders.filter(reminder => {
                const $reminderCheckbox = $(`#checkbox-${reminder.id}`);
                const isReminderChecked = $reminderCheckbox.is(':checked');
                const isReminderUserInputted = reminder.userInputted;
                const isReminderEmptyText = reminder.text.trim() === 'New Reminder';

                return !(isReminderChecked || (!isReminderUserInputted && isReminderEmptyText));
            });

            const hasNonDeletableReminders = group.reminders.some(reminder => reminder.userInputted);
            return !(isGroupChecked || (!isGroupUserInputted && isGroupEmptyTitle && !hasNonDeletableReminders));
        });

        await saveState(listGroups);
        renderListGroups(listGroups);
        toggleClearButtonState(listGroups);
    } catch (error) {
        console.error('Error clearing checked reminders and groups:', error);
    }
    return listGroups;
}

export function toggleClearButtonState(listGroups) {
    const $checkboxes = $('.list-group input[type="checkbox"], .checkbox-container input[type="checkbox"]');
    const anyChecked = $checkboxes.is(':checked');

    const anyUnusedReminders = listGroups.some(group =>
        group.reminders.some(reminder => !reminder.userInputted)
    );

    const anyEmptyGroups = listGroups.some(group => !group.userInputted && group.title.trim() === 'New Reminder');

    const $clearButton = $('#clear-reminders');
    if (anyChecked || anyUnusedReminders || anyEmptyGroups) {
        $clearButton.removeClass('inactive').addClass('color-caution');
    } else {
        $clearButton.removeClass('color-caution').addClass('inactive');
    }
}

export function toggleDateButtonState() {
    const $dateInputs = $('.date-input');
    const anyDateEntered = $dateInputs.filter(function () {
        return $(this).val() !== '';
    }).length > 0;
    const $dateButton = $('#sort-by-date');
    if (anyDateEntered) {
        $dateButton.removeClass('inactive');
    } else {
        $dateButton.addClass('inactive');
    }
}

export function toggleImportantButtonState(listGroups) {
    const anyImportantReminders = listGroups.some(group =>
        group.reminders.some(reminder => reminder.important)
    );
    const $importantButton = $('#show-important');
    if (anyImportantReminders) {
        $importantButton.removeClass('inactive');
    } else {
        $importantButton.addClass('inactive');
    }
}

export function filterRemindersByDate(listGroups, compiledListGroupTemplate, renderReminders, toggleDateButtonState, toggleImportantButtonState, turnOff = false) {
    const $dateButton = $('#sort-by-date');
    const isActive = $dateButton.hasClass('active');

    if (isActive || turnOff) {
        renderListGroups(listGroups, compiledListGroupTemplate, renderReminders, addListGroupEventListeners, toggleClearButtonState, toggleDateButtonState, toggleImportantButtonState);
        $('.selected-list-group').removeClass('selected-list-group');
        $dateButton.removeClass('active');
        $('#show-important').removeClass('inactive');
        toggleDateButtonState();
        toggleImportantButtonState();
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const groups = {
            past: {
                id: 'past',
                title: 'Past',
                reminders: []
            },
            today: {
                id: 'today',
                title: 'Today',
                reminders: []
            },
            tomorrow: {
                id: 'tomorrow',
                title: 'Tomorrow',
                reminders: []
            },
            withinWeek: {
                id: 'within-week',
                title: 'Next Week',
                reminders: []
            },
            beyondWeek: {
                id: 'beyond-week',
                title: 'Upcoming',
                reminders: []
            }
        };

        listGroups.forEach(group => {
            group.reminders.forEach(reminder => {
                if (reminder.date) {
                    const reminderDate = new Date(reminder.date);
                    reminderDate.setHours(0, 0, 0, 0);

                    const diffDays = Math.floor((reminderDate - today) / (1000 * 60 * 60 * 24));

                    if (reminderDate < today) {
                        groups.past.reminders.push(reminder);
                    } else if (diffDays === 0) {
                        groups.today.reminders.push(reminder);
                    } else if (diffDays === 1) {
                        groups.tomorrow.reminders.push(reminder);
                    } else if (diffDays <= 7) {
                        groups.withinWeek.reminders.push(reminder);
                    } else {
                        groups.beyondWeek.reminders.push(reminder);
                    }
                }
            });
        });

        const $flexContainerElements = $('#flex-container-elements');
        $flexContainerElements.empty();

        Object.values(groups).forEach(group => {
            if (group.reminders.length > 0) {
                const newListGroupHtml = compiledListGroupTemplate(group);
                const $listGroupElement = $(newListGroupHtml);
                $listGroupElement.addClass('selected-list-group');
                $flexContainerElements.append($listGroupElement);
                renderReminders(group, $listGroupElement.find('.reminders-container'));
            }
        });

        $dateButton.addClass('active');
        $('#show-important').addClass('inactive');
    }
}

export function filterRemindersByImportant(listGroups, compiledListGroupTemplate, renderReminders, toggleDateButtonState, toggleImportantButtonState, turnOff = false) {
    const $importantButton = $('#show-important');
    const isActive = $importantButton.hasClass('active');

    if (isActive || turnOff) {
        renderListGroups(listGroups, compiledListGroupTemplate, renderReminders, addListGroupEventListeners, toggleClearButtonState, toggleDateButtonState, toggleImportantButtonState);
        $('.selected-list-group').removeClass('selected-list-group');
        $('.selected-list-group-important').removeClass('selected-list-group-important');
        $importantButton.removeClass('active important-active');
        $('#sort-by-date').removeClass('inactive');
        toggleImportantButtonState(listGroups);
        toggleDateButtonState();
    } else {
        listGroups.forEach(group => {
            let hasImportantReminders = false;
            group.reminders.forEach(reminder => {
                const $reminderElement = $(`#checkbox-${reminder.id}`).closest('.checkbox-container');
                const $importantButton = $reminderElement.find('[data-action="toggle-important"]');
                if (!reminder.important) {
                    $reminderElement.hide();
                } else {
                    $reminderElement.show();
                    $importantButton.addClass('important');
                    hasImportantReminders = true;
                }
            });
            const $listGroupElement = $(`#group-checkbox-${group.id}`).closest('.list-group');
            if (!hasImportantReminders) {
                $listGroupElement.hide();
            } else {
                $listGroupElement.show();
                $listGroupElement.addClass('selected-list-group-important');
            }
        });
        $importantButton.addClass('active important-active');
        $('#sort-by-date').addClass('inactive');
    }
}

export function normalizePaste(event) {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text');

    const textNode = document.createTextNode(text);

    const selection = window.getSelection();
    if (!selection.rangeCount) return false;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
}

document.querySelectorAll('.editable-label').forEach(label => {
    label.addEventListener('paste', normalizePaste);
});

export async function updateGroupTitle(listGroups, groupId, newTitle, saveState, toggleClearButtonState) {
    try {
        const listGroup = listGroups.find(group => group.id === groupId);
        listGroup.title = newTitle;
        listGroup.userInputted = true;
        await saveState(listGroups);
        toggleClearButtonState(listGroups);
    } catch (error) {
        console.error('Error updating group title:', error);
    }
    return listGroups;
}

export async function updateReminderText(listGroups, groupId, reminderId, newText, saveState, toggleClearButtonState) {
    try {
        const listGroup = listGroups.find(group => group.id === groupId);
        const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
        reminder.text = newText;
        reminder.userInputted = true;
        await saveState(listGroups);
        toggleClearButtonState(listGroups);
    } catch (error) {
        console.error('Error updating reminder text:', error);
    }
    return listGroups;
}

document.querySelectorAll('.date-input').forEach(input => {
    if (!input.value) {
        input.classList.add('empty');
    }

    input.addEventListener('input', () => {
        if (input.value) {
            input.classList.remove('empty');
        } else {
            input.classList.add('empty');
        }
    });
});
