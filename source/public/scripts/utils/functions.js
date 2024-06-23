import { getListGroups, saveListGroups, updateListGroup } from './noteService.js';

export async function createNewListGroup() {
    try {
        const newListGroup = {
            id: this.groupIdCounter++,
            title: 'New Reminder',
            userInputted: false,
            reminders: []
        };
        this.listGroups.push(newListGroup);
        await this.saveState();
        this.renderListGroups();
        this.toggleClearButtonState(); // Ensure button state is updated
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
            userInputted: false,
            date: null,
            important: false,
            checked: false
        };
        listGroup.reminders.push(newReminder);
        await this.saveState();
        this.renderListGroups();
        this.toggleClearButtonState(); // Ensure button state is updated
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
    this.toggleImportantButtonState();
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
        this.toggleClearButtonState(); // Ensure button state is updated after loading
    } catch (error) {
        console.error('Error loading list groups:', error);
    }
}

export async function clearCheckedRemindersAndGroups() {
    try {
        this.listGroups = this.listGroups.filter(group => {
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

            // Check if group should be deleted
            const hasNonDeletableReminders = group.reminders.some(reminder => reminder.userInputted);
            if (isGroupChecked || (!isGroupUserInputted && isGroupEmptyTitle && !hasNonDeletableReminders)) {
                return false;
            }

            return true;
        });

        await this.saveState();
        this.renderListGroups();
        this.toggleClearButtonState(); // Ensure button state is updated after deletion
    } catch (error) {
        console.error('Error clearing checked reminders and groups:', error);
    }
}

export function toggleClearButtonState() {
    const $checkboxes = $('.list-group input[type="checkbox"], .checkbox-container input[type="checkbox"]');
    const anyChecked = $checkboxes.is(':checked');

    const anyUnusedReminders = this.listGroups.some(group =>
        group.reminders.some(reminder => !reminder.userInputted)
    );

    const anyEmptyGroups = this.listGroups.some(group => !group.userInputted && group.title.trim() === 'New Reminder');

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

export function toggleImportantButtonState() {
    const anyImportantReminders = this.listGroups.some(group =>
        group.reminders.some(reminder => reminder.important)
    );
    const $importantButton = $('#show-important');
    if (anyImportantReminders) {
        $importantButton.removeClass('inactive');
    } else {
        $importantButton.addClass('inactive');
    }
}

export function filterRemindersByDate(turnOff = false) {
    const $dateButton = $('#sort-by-date');
    const isActive = $dateButton.hasClass('active');

    if (isActive || turnOff) {
        this.renderListGroups();
        $('.selected-list-group').removeClass('selected-list-group');
        $dateButton.removeClass('active');
        $('#show-important').removeClass('inactive');
        this.toggleDateButtonState();
        this.toggleImportantButtonState();
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

        this.listGroups.forEach(group => {
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

        this.$flexContainerElements.empty();

        Object.values(groups).forEach(group => {
            if (group.reminders.length > 0) {
                const newListGroupHtml = this.compiledListGroupTemplate(group);
                const $listGroupElement = $(newListGroupHtml);
                $listGroupElement.addClass('selected-list-group');
                this.$flexContainerElements.append($listGroupElement);
                this.renderReminders(group, $listGroupElement.find('.reminders-container'));
            }
        });

        $dateButton.addClass('active');
        $('#show-important').addClass('inactive');
    }
}

export function filterRemindersByImportant(turnOff = false) {
    const $importantButton = $('#show-important');
    const isActive = $importantButton.hasClass('active');

    if (isActive || turnOff) {
        this.renderListGroups();
        $('.selected-list-group').removeClass('selected-list-group');
        $('.selected-list-group-important').removeClass('selected-list-group-important');
        $importantButton.removeClass('active important-active');
        $('#sort-by-date').removeClass('inactive');
        this.toggleImportantButtonState();
        this.toggleDateButtonState();
    } else {
        this.listGroups.forEach(group => {
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
        listGroup.userInputted = true;
        await updateListGroup(groupId, listGroup);
        this.toggleClearButtonState(); // Ensure button state is updated after title update
    } catch (error) {
        console.error('Error updating group title:', error);
    }
}

export async function updateReminderText(groupId, reminderId, newText) {
    try {
        const listGroup = this.listGroups.find(group => group.id === groupId);
        const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
        reminder.text = newText;
        reminder.userInputted = true;
        await updateListGroup(groupId, listGroup);
        this.toggleClearButtonState(); // Ensure button state is updated after text update
    } catch (error) {
        console.error('Error updating reminder text:', error);
    }
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
