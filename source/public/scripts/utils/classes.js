import {
    createNewListGroup,
    createNewReminder,
    renderListGroups,
    renderReminders,
    loadListGroups,
    clearAllListGroups,
    toggleClearButtonState,
    toggleDateButtonState,
    saveState,
    filterRemindersByDate,
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
    }

    async init() {
        this.$toolbarNewGroupButton = $('#toolbar-new-reminder');
        this.$clearRemindersButton = $('#clear-reminders');
        this.$dateButton = $('#sort-by-date');
        this.$flexContainerElements = $('#flex-container-elements');
        this.listGroupTemplate = $('#list-group-template').html();
        this.reminderTemplate = $('#reminder-template').html();
        this.compiledListGroupTemplate = Handlebars.compile(this.listGroupTemplate);
        this.compiledReminderTemplate = Handlebars.compile(this.reminderTemplate);

        this.$toolbarNewGroupButton.on('click', () => this.createNewListGroup());
        this.$clearRemindersButton.on('click', () => this.clearAllListGroups());
        this.$dateButton.on('click', () => this.filterRemindersByDate());

        await this.loadListGroups();
        this.toggleDateButtonState();
    }

    async createNewListGroup() {
        if ($('#sort-by-date').hasClass('active')) {
            this.filterRemindersByDate(true);
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

    async clearAllListGroups() {
        await clearAllListGroups.call(this);
    }

    toggleClearButtonState() {
        toggleClearButtonState.call(this);
    }

    toggleDateButtonState() {
        toggleDateButtonState.call(this);
    }

    filterRemindersByDate(turnOff = false) {
        filterRemindersByDate.call(this, turnOff);
    }

    addListGroupEventListeners($listGroupElement, groupId) {
        const $newReminderButton = $listGroupElement.find('[data-action="create-reminder"]');
        $newReminderButton.on('click', () => this.createNewReminder(groupId));

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
            makeEditable($groupTitle[0], async (newTitle) => {
                await updateGroupTitle.call(this, groupId, newTitle);
            });
        });
    }

    addReminderEventListeners($reminderElement, groupId, reminderId) {
        const $toggleImportantButton = $reminderElement.find('[data-action="toggle-important"]');
        $toggleImportantButton.on('click', async () => {
            try {
                const listGroup = this.listGroups.find(group => group.id === groupId);
                const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
                reminder.important = !reminder.important;
                $toggleImportantButton.text(reminder.important ? '!!' : '!');
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
            this.toggleClearButtonState();
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
            makeEditable($reminderText[0], async (newText) => {
                await updateReminderText.call(this, groupId, reminderId, newText);
            });
        });
    }
}

export default ReminderApp;
