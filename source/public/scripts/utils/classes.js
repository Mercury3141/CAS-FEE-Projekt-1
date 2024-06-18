import {
    createNewListGroup,
    createNewReminder,
    renderListGroups,
    renderReminders,
    loadListGroups,
    clearCheckedRemindersAndGroups,
    toggleClearButtonState,
    toggleDateButtonState,
    toggleImportantButtonState,
    saveState,
    filterRemindersByDate,
    filterRemindersByImportant,
    makeEditable,
    updateGroupTitle,
    updateReminderText
} from './functions.js';
import { updateListGroup } from './noteService.js';

class ReminderApp {
    constructor() {
        this.groupIdCounter = 0;
        this.reminderIdCounter = 0;
        this.listGroups = [];
        this.saveState = saveState.bind(this);
        this.updateReminderText = updateReminderText.bind(this);
        this.updateGroupTitle = updateGroupTitle.bind(this);
        this.toggleClearButtonState = toggleClearButtonState.bind(this);
        this.toggleImportantButtonState = toggleImportantButtonState.bind(this);
    }

    async init() {
        this.$toolbarNewGroupButton = $('#toolbar-new-reminder');
        this.$clearRemindersButton = $('#clear-reminders');
        this.$dateButton = $('#sort-by-date');
        this.$importantButton = $('#show-important');
        this.$flexContainerElements = $('#flex-container-elements');
        this.listGroupTemplate = $('#list-group-template').html();
        this.reminderTemplate = $('#reminder-template').html();
        this.compiledListGroupTemplate = Handlebars.compile(this.listGroupTemplate);
        this.compiledReminderTemplate = Handlebars.compile(this.reminderTemplate);

        this.$toolbarNewGroupButton.on('click', () => this.createNewListGroup());
        this.$clearRemindersButton.on('click', () => this.clearCheckedRemindersAndGroups());
        this.$dateButton.on('click', () => this.filterRemindersByDate());
        this.$importantButton.on('click', () => this.filterRemindersByImportant());

        await this.loadListGroups();
        this.toggleDateButtonState();
        this.toggleImportantButtonState();
        this.toggleClearButtonState();
    }

    async createNewListGroup() {
        if ($('#sort-by-date').hasClass('active') || $('#show-important').hasClass('active')) {
            this.filterRemindersByDate(true);
            this.filterRemindersByImportant(true);
        }
        await createNewListGroup.call(this);
    }

    async createNewReminder(groupId) {
        await createNewReminder.call(this, groupId);
    }

    renderListGroups() {
        renderListGroups.call(this);
    }

    renderReminders(group, $remindersContainer) {
        renderReminders.call(this, group, $remindersContainer);
    }

    async loadListGroups() {
        await loadListGroups.call(this);
    }

    async clearCheckedRemindersAndGroups() {
        await clearCheckedRemindersAndGroups.call(this);
    }

    toggleClearButtonState() {
        toggleClearButtonState.call(this);
    }

    toggleDateButtonState() {
        toggleDateButtonState.call(this);
    }

    toggleImportantButtonState() {
        toggleImportantButtonState.call(this);
    }

    filterRemindersByDate(turnOff = false) {
        filterRemindersByDate.call(this, turnOff);
    }

    filterRemindersByImportant(turnOff = false) {
        filterRemindersByImportant.call(this, turnOff);
    }

    addListGroupEventListeners($listGroupElement, groupId) {
        const $newReminderButton = $listGroupElement.find('[data-action="create-reminder"]');
        $newReminderButton.on('click', () => this.createNewReminder(groupId));

        const $groupCheckbox = $listGroupElement.find(`#group-checkbox-${groupId}`);
        $groupCheckbox.on('change', async (event) => {
            const listGroup = this.listGroups.find(group => group.id === groupId);
            const isChecked = event.target.checked;

            listGroup.reminders.forEach(reminder => {
                reminder.checked = isChecked;
                $(`#checkbox-${reminder.id}`).prop('checked', isChecked);
            });

            this.toggleClearButtonState();
            await updateListGroup(groupId, listGroup);
        });

        const $checkboxes = $listGroupElement.find('input[type="checkbox"]');
        $checkboxes.on('change', async (event) => {
            const listGroup = this.listGroups.find(group => group.id === groupId);
            const reminderId = parseInt($(event.target).closest('.checkbox-container').data('id'), 10);
            const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
            reminder.checked = event.target.checked;
            this.toggleClearButtonState();
            await updateListGroup(groupId, listGroup);
        });

        const $groupTitle = $listGroupElement.find('.group-title');
        $groupTitle.on('click', () => {
            $groupTitle.attr('contenteditable', 'true').focus();
            $groupTitle.removeClass('inactive-label');
        });

        this.addInactiveLabelHandler($groupTitle, groupId);
    }

    addReminderEventListeners($reminderElement, groupId, reminderId) {
        const $toggleImportantButton = $reminderElement.find('[data-action="toggle-important"]');
        $toggleImportantButton.on('click', async () => {
            try {
                const listGroup = this.listGroups.find(group => group.id === groupId);
                const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
                reminder.important = !reminder.important;
                $toggleImportantButton.text(reminder.important ? '!!' : '!').toggleClass('important', reminder.important);
                this.toggleImportantButtonState();
                await updateListGroup(groupId, listGroup);
            } catch (error) {
                console.error('Error toggling important state:', error);
            }
        });

        const $checkboxes = $reminderElement.find('input[type="checkbox"]');
        $checkboxes.on('change', async (event) => {
            const listGroup = this.listGroups.find(group => group.id === groupId);
            const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
            reminder.checked = event.target.checked;
            this.toggleClearButtonState(); // Update button state when checkbox changes
            await updateListGroup(groupId, listGroup);
        });

        const $dateInput = $reminderElement.find(`#date-${reminderId}`);
        $dateInput.on('change', async () => {
            const listGroup = this.listGroups.find(group => group.id === groupId);
            const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
            reminder.date = $dateInput.val();
            await updateListGroup(groupId, listGroup);
        });

        $dateInput.on('input', () => this.toggleDateButtonState());

        const $reminderText = $reminderElement.find('.editable-label.text-list');
        $reminderText.on('click', () => {
            $reminderText.attr('contenteditable', 'true').focus();
            $reminderText.removeClass('inactive-label');
        });

        this.addInactiveLabelHandler($reminderText, groupId);
    }


    addInactiveLabelHandler($element, groupId) {
        $element.on('focus', () => {
            $element.removeClass('inactive-label');
        });

        $element.on('blur keypress', async (event) => {
            if (event.type === 'blur' || event.key === 'Enter') {
                event.preventDefault();
                const newText = $element.text();
                $element.attr('contenteditable', 'false');
                $element.removeClass('inactive-label');

                if ($element.hasClass('group-title')) {
                    await this.updateGroupTitle(groupId, newText);
                } else {
                    const reminderId = parseInt($element.closest('.checkbox-container').data('id'), 10);
                    await this.updateReminderText(groupId, reminderId, newText);
                }
                this.toggleClearButtonState();
            }
        });
    }
}

export default ReminderApp;
