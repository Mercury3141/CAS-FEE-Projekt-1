import { getListGroups, saveListGroups, updateListGroup } from './noteService.js';

export async function createNewListGroup() {
    try {
        const newListGroup = {
            id: this.groupIdCounter++,
            title: 'Group Title',
            reminders: []
        };
        this.listGroups.push(newListGroup);
        await this.saveState();
        this.renderListGroups();
    } catch (error) {
        console.error('Error creating new list group:', error);
    }
}

export async function createNewReminder(groupId) {
    try {
        const listGroup = this.listGroups.find(group => group.id === groupId);
        const newReminder = {
            id: this.reminderIdCounter++,
            text: 'New Reminder',
            date: '',
            important: false,
            checked: false
        };
        listGroup.reminders.push(newReminder);
        await this.saveState();
        this.renderListGroups();
    } catch (error) {
        console.error('Error creating new reminder:', error);
    }
}

export async function saveState() {
    try {
        await saveListGroups(this.listGroups);
    } catch (error) {
        console.error('Error saving list groups:', error);
    }
}

export function renderListGroups() {
    this.$flexContainerElements.empty();
    this.listGroups.forEach(group => {
        const newListGroupHtml = this.compiledListGroupTemplate(group);
        const $listGroupElement = $(newListGroupHtml);
        this.$flexContainerElements.append($listGroupElement);
        this.renderReminders(group, $listGroupElement.find('.reminders-container'));
        this.addListGroupEventListeners($listGroupElement, group.id);
    });
    this.toggleClearButtonState();
    this.toggleDateButtonState();
}

export function renderReminders(group, $remindersContainer) {
    $remindersContainer.empty();
    group.reminders.forEach(reminder => {
        const newReminderHtml = this.compiledReminderTemplate(reminder);
        const $reminderElement = $(newReminderHtml);
        $remindersContainer.append($reminderElement);
        this.addReminderEventListeners($reminderElement, group.id, reminder.id);

        $reminderElement.find(`#checkbox-${reminder.id}`).prop('checked', reminder.checked);
        $reminderElement.find(`#date-${reminder.id}`).val(reminder.date);
        $reminderElement.find(`#label-${reminder.id}`).text(reminder.text);
        $reminderElement.find(`#button-${reminder.id}`).text(reminder.important ? '!!' : '!');
    });
}

export async function loadListGroups() {
    try {
        this.listGroups = await getListGroups();
        this.renderListGroups();
    } catch (error) {
        console.error('Error loading list groups:', error);
    }
}

export async function clearCheckedRemindersAndGroups() {
    try {
        // Filter out the groups that have their header checkbox checked
        this.listGroups = this.listGroups.filter(group => {
            const $groupCheckbox = $(`#group-checkbox-${group.id}`);
            if ($groupCheckbox.is(':checked')) {
                return false; // Remove the entire group
            }

            // Filter out the reminders that are checked
            group.reminders = group.reminders.filter(reminder => {
                const $reminderCheckbox = $(`#checkbox-${reminder.id}`);
                return !$reminderCheckbox.is(':checked');
            });

            return true; // Keep the group if its header checkbox is not checked
        });

        await this.saveState();
        this.renderListGroups();
    } catch (error) {
        console.error('Error clearing checked reminders and groups:', error);
    }
}

export function toggleClearButtonState() {
    const $checkboxes = $('.list-group input[type="checkbox"], .checkbox-container input[type="checkbox"]');
    const anyChecked = $checkboxes.is(':checked');
    const $clearButton = $('#clear-reminders');
    if (anyChecked) {
        $clearButton.removeClass('inactive').addClass('color-caution');
    } else {
        $clearButton.removeClass('color-caution').addClass('inactive');
    }
}

export function toggleDateButtonState() {
    const $dateInputs = $('.date-input');
    const anyDateEntered = $dateInputs.filter(function() { return $(this).val() !== ''; }).length > 0;
    const $dateButton = $('#sort-by-date');
    if (anyDateEntered) {
        $dateButton.removeClass('inactive');
    } else {
        $dateButton.addClass('inactive');
    }
}

export function filterRemindersByDate(turnOff = false) {
    const $dateButton = $('#sort-by-date');
    const isActive = $dateButton.hasClass('active');

    if (isActive || turnOff) {
        this.renderListGroups();
        $('.selected-list-group').removeClass('selected-list-group');
        $dateButton.removeClass('active');
    } else {
        const tempGroup = {
            id: 'temp',
            title: 'Sorted by Date',
            reminders: []
        };

        this.listGroups.forEach(group => {
            group.reminders.forEach(reminder => {
                if (reminder.date) {
                    tempGroup.reminders.push(reminder);
                }
            });
        });

        tempGroup.reminders.sort((a, b) => new Date(a.date) - new Date(b.date));

        this.$flexContainerElements.empty();
        const newListGroupHtml = this.compiledListGroupTemplate(tempGroup);
        const $listGroupElement = $(newListGroupHtml);
        $listGroupElement.addClass('selected-list-group');
        this.$flexContainerElements.append($listGroupElement);
        this.renderReminders(tempGroup, $listGroupElement.find('.reminders-container'));
        $dateButton.addClass('active');
    }
}

export function normalizePaste(event) {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertText', false, text);
}

export function makeEditable(labelElement, saveCallback) {
    const $labelElement = $(labelElement);
    $labelElement.prop('contentEditable', true).focus();

    const saveChanges = () => {
        $labelElement.prop('contentEditable', false);
        saveCallback($labelElement.text());
        $(document).off('click', handleClickOutside);
        $labelElement.off('paste', handlePaste);
    };

    const handleClickOutside = (event) => {
        if (!$labelElement.is(event.target) && !$labelElement.has(event.target).length) {
            saveChanges();
        }
    };

    const handlePaste = (event) => {
        normalizePaste(event);
    };

    $labelElement.on('paste', handlePaste);
    $(document).on('click', handleClickOutside);
}

export async function updateGroupTitle(groupId, newTitle) {
    try {
        const listGroup = this.listGroups.find(group => group.id === groupId);
        listGroup.title = newTitle;
        await updateListGroup(groupId, listGroup);
    } catch (error) {
        console.error('Error updating group title:', error);
    }
}

export async function updateReminderText(groupId, reminderId, newText) {
    try {
        const listGroup = this.listGroups.find(group => group.id === groupId);
        const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
        reminder.text = newText;
        await updateListGroup(groupId, listGroup); // Save the updated list group to the backend
    } catch (error) {
        console.error('Error updating reminder text:', error);
    }
}
