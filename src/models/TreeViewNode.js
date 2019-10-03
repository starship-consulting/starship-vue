import _ from 'underscore';

export default class {

    constructor(model, key) {
        this.key = key || model.key || model.id;
        this.model = model;
        this.children = [];
    }

    add(item) {

        let parent = this;

        item.getParent = function () {
            return parent;
        };

        this.children.push(item);
        this.children = this.children.sortBy('name');
    }

    removeSelf() {
        this.getParent().remove(this);
    }

    remove(item) {
        this.children.remove(item);
    }

    get name() {
        return this.model.name;
    }

    set name(name) {
        this.model.name = name;
    }

    get label() {
        return this.name;
    }

    get id() {
        return this.model.id;
    }

    set id(id) {
        this.model.id = id;
    }
}