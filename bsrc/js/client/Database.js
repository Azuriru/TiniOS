import data from '../../data/data';

export class Database {
    constructor(name, placeholder = {}) {
        this.name = name;
        this.data = this.getDatabase(placeholder);
    }

    createDatabase() {
        this.data = data;
        this.save();
    }

    getDatabase(placeholder) {
        // Corrupted save
        if (localStorage.getItem(this.name) === 'undefined') {
            this.clearData();
        }

        // If there isn't one
        if (!localStorage.getItem(this.name)) {
            this.data = this.name === 'global' ? data : placeholder;
            this.save();
        }

        return JSON.parse(localStorage.getItem(this.name));
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        this.save();
    }

    toggle(key, onEnable, onDisable) {
        if (this.data[key]) {
            this.set(key, false);
            typeof onDisable === 'function' && onDisable();
        } else {
            this.set(key, true);
            typeof onEnable === 'function' && onEnable();
        }
    }

    save() {
        localStorage.setItem(this.name, JSON.stringify(this.data));
    }

    export() {
        copy(JSON.stringify(this.data, null, 4));
    }

    clearData() {
        localStorage.removeItem(this.name);
    }
}

const database = new Database('global');
export const get = database.get.bind(database);
export const set = database.set.bind(database);
export const toggle = database.toggle.bind(database);
export default database;
window.db = database;