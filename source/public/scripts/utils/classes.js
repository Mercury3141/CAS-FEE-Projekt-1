import {
    clearCheckedRemindersAndGroups,
    createNewListGroup,
    createNewReminder,
    filterRemindersByDate,
    filterRemindersByImportant,
    loadListGroups,
    renderListGroups,
    renderReminders,
    saveState,
    toggleClearButtonState,
    toggleDateButtonState,
    toggleImportantButtonState,
    updateGroupTitle,
    updateReminderText
} from './functions.js';
import { updateListGroup } from './noteService.js';

class ReminderApp {
    constructor() {
        this.groupIdCounter = 0;
        this.reminderIdCounter = 0;
        this.listGroups = [];
        this.saveState = saveState.bind(null, this.listGroups);
        this.updateReminderText = updateReminderText.bind(null, this.listGroups);
        this.updateGroupTitle = updateGroupTitle.bind(null, this.listGroups);
        this.toggleClearButtonState = toggleClearButtonState.bind(null, this.listGroups);
        this.toggleImportantButtonState = toggleImportantButtonState.bind(null, this.listGroups);
        this.handleGlobalClick = this.handleGlobalClick.bind(this);
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
        this.$dateButton.on('click', () => {
            this.filterRemindersByDate();
            this.toggleSortable();
        });
        this.$importantButton.on('click', () => {
            this.filterRemindersByImportant();
            this.toggleSortable();
        });

        this.listGroups = await loadListGroups(this.renderListGroups.bind(this), this.toggleClearButtonState);
        this.toggleDateButtonState();
        this.toggleImportantButtonState();
        this.toggleClearButtonState();
        this.initSortable();

        document.addEventListener('click', this.handleGlobalClick);
    }

    async createNewListGroup() {
        if ($('#sort-by-date').hasClass('active') || $('#show-important').hasClass('active')) {
            this.filterRemindersByDate(true);
            this.filterRemindersByImportant(true);
        }
        const result = await createNewListGroup(this.listGroups, this.groupIdCounter, this.renderListGroups.bind(this), this.saveState.bind(this), this.toggleClearButtonState.bind(this));
        this.listGroups = result.listGroups;
        this.groupIdCounter = result.groupIdCounter;
        this.renderListGroups();
        this.initSortable();
    }

    async createNewReminder(groupId) {
        const result = await createNewReminder(this.listGroups, this.reminderIdCounter, groupId, this.renderListGroups.bind(this), this.saveState.bind(this), this.toggleClearButtonState.bind(this));
        this.listGroups = result.listGroups;
        this.reminderIdCounter = result.reminderIdCounter;
        this.renderListGroups();
        this.initSortable();
    }

    renderListGroups() {
        renderListGroups(this.listGroups, this.compiledListGroupTemplate, this.renderReminders.bind(this), this.addListGroupEventListeners.bind(this), this.toggleClearButtonState.bind(this), this.toggleDateButtonState.bind(this), this.toggleImportantButtonState.bind(this));
        this.initSortable();
    }

    renderReminders(group, $remindersContainer) {
        renderReminders(group, $remindersContainer, this.compiledReminderTemplate, this.addReminderEventListeners.bind(this));
    }

    async clearCheckedRemindersAndGroups() {
        this.listGroups = await clearCheckedRemindersAndGroups(this.listGroups, this.saveState.bind(this), this.renderListGroups.bind(this), this.toggleClearButtonState.bind(this));
    }

    toggleClearButtonState() {
        toggleClearButtonState(this.listGroups);
    }

    toggleDateButtonState() {
        toggleDateButtonState();
    }

    toggleImportantButtonState() {
        toggleImportantButtonState(this.listGroups);
    }

    filterRemindersByDate(turnOff = false) {
        filterRemindersByDate(this.listGroups, this.compiledListGroupTemplate, this.renderReminders.bind(this), this.toggleDateButtonState.bind(this), this.toggleImportantButtonState.bind(this), turnOff);
    }

    filterRemindersByImportant(turnOff = false) {
        filterRemindersByImportant(this.listGroups, this.compiledListGroupTemplate, this.renderReminders.bind(this), this.toggleDateButtonState.bind(this), this.toggleImportantButtonState.bind(this), turnOff);
    }

    cancelFiltering() {
        const isDateFilterActive = $('#sort-by-date').hasClass('active');
        const isImportantFilterActive = $('#show-important').hasClass('active');

        if (isDateFilterActive) {
            this.filterRemindersByDate(true);
        }
        if (isImportantFilterActive) {
            this.filterRemindersByImportant(true);
        }
    }

    addListGroupEventListeners($listGroupElement, groupId) {
        const $newReminderButton = $listGroupElement.find('[data-action="create-reminder"]');
        $newReminderButton.on('click', async (event) => {
            const $closestListGroup = $(event.target).closest('.list-group');
            const closestGroupId = parseInt($closestListGroup.data('id'), 10);
            await this.createNewReminder(closestGroupId);
        });

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
        $groupTitle.on('click', (e) => {
            e.stopPropagation();
            $groupTitle.attr('contenteditable', 'true').focus();
            $groupTitle.removeClass('inactive-label');
        });

        this.addInactiveLabelHandler($groupTitle, groupId);

        $listGroupElement.on('click', (e) => {
            e.stopPropagation();
        });
    }

    addReminderEventListeners($reminderElement, groupId, reminderId) {
        const $toggleImportantButton = $reminderElement.find('[data-action="toggle-important"]');
        $toggleImportantButton.on('click', async (e) => {
            e.stopPropagation();
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
        $reminderText.on('click', (e) => {
            e.stopPropagation();
            $reminderText.attr('contenteditable', 'true').focus();
            $reminderText.removeClass('inactive-label');
        });

        this.addInactiveLabelHandler($reminderText, groupId);

        $reminderElement.on('click', (e) => {
            e.stopPropagation();
        });
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
                    this.listGroups = await updateGroupTitle(this.listGroups, groupId, newText, this.saveState.bind(this), this.toggleClearButtonState.bind(this));
                } else {
                    const reminderId = parseInt($element.closest('.checkbox-container').data('id'), 10);
                    this.listGroups = await updateReminderText(this.listGroups, groupId, reminderId, newText, this.saveState.bind(this), this.toggleClearButtonState.bind(this));
                }
                this.toggleClearButtonState();
            }
        });
    }

    initSortable() {
        this.sortableGroups = new Sortable(this.$flexContainerElements[0], {
            animation: 150,
            onStart: () => this.cancelFiltering(),
            onEnd: async (event) => {
                const movedGroup = this.listGroups.splice(event.oldIndex, 1)[0];
                this.listGroups.splice(event.newIndex, 0, movedGroup);
                await this.saveState(this.listGroups);
                this.renderListGroups();
            }
        });

        this.sortableReminders = this.listGroups.map(group => {
            const $remindersContainer = $(`#reminders-container-${group.id}`);
            return new Sortable($remindersContainer[0], {
                animation: 150,
                group: {
                    name: 'reminders',
                    pull: true,
                    put: true
                },
                onStart: () => this.cancelFiltering(),
                onEnd: async (event) => {
                    const fromGroupId = parseInt(event.from.closest('.list-group').dataset.id, 10);
                    const toGroupId = parseInt(event.to.closest('.list-group').dataset.id, 10);
                    const movedReminder = this.listGroups
                        .find(g => g.id === fromGroupId)
                        .reminders.splice(event.oldIndex, 1)[0];
                    this.listGroups
                        .find(g => g.id === toGroupId)
                        .reminders.splice(event.newIndex, 0, movedReminder);
                    await this.saveState(this.listGroups);
                    this.renderListGroups();
                }
            });
        });
    }

    toggleSortable() {
        const isDateFilterActive = $('#sort-by-date').hasClass('active');
        const isImportantFilterActive = $('#show-important').hasClass('active');
        const enableSortable = !isDateFilterActive && !isImportantFilterActive;

        if (this.sortableGroups) {
            this.sortableGroups.option('disabled', !enableSortable);
        }

        if (this.sortableReminders) {
            this.sortableReminders.forEach(sortable => sortable.option('disabled', !enableSortable));
        }
    }

    handleGlobalClick(event) {
        const $target = $(event.target);
        if (!$target.closest('.list-group, .checkbox-container').length) {
            this.deselectAll();
        }
    }

    deselectAll() {
        // Implement deselect logic if needed
    }
}

export default ReminderApp;
