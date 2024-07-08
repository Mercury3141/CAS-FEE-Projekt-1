class ValueStorage {
    setItem(name, value) {
        if (value) {
            localStorage.setItem(name, JSON.stringify(value));
        }
        else {
            localStorage.removeItem(name);
        }
    }

    getItem(name) {
        return JSON.parse(localStorage.getItem(name) || null);
    }

/*
    setGroup(groupId, groupData) {
        let groups = this.getItem('groups') || {};
        groups[groupId] = groupData;
        this.setItem('groups', groups);
    }

    getGroup(groupId) {
        let groups = this.getItem('groups') || {};
        return groups[groupId] || null;
    }

    removeGroup(groupId) {
        let groups = this.getItem('groups') || {};
        delete groups[groupId];
        this.setItem('groups', groups);
    }*/
}




export const valueStorage = new ValueStorage();



