import _ from 'underscore';

class ChangeTracker {

    constructor(target) {
        this.snapshot = this.takeSnapshot(target);
    }

    takeSnapshot(target) {
        
        let fields = {};
        target = JSON.parse(JSON.stringify(target));

        for (var field in target) {
            if (target.hasOwnProperty(field)) {

                if (field.startsWith('_')) {
                    continue;
                }

                if (_.isFunction(field)) {
                    continue;
                }

                fields[field] = target[field];
            }
        }

        return JSON.parse(JSON.stringify(fields));
    }
    
    getChanges(target) {

        if (!this.snapshot || !target) {
            return false;
        }

        let changeset = [];
        target = this.takeSnapshot(target);

        for (var field in this.snapshot) {

            let oldValue = this.snapshot[field];
            let newValue = target[field];
            let changed = false;

            if (_.isArray(oldValue)) {
                if (!_.isArray(newValue) || oldValue.length != newValue.length) {
                    changed = true;
                }
            }
            else if (oldValue !== newValue) {
                changed = true;
            }

            if (changed) {
                changeset.push({
                    field: field,
                    oldValue: oldValue,
                    newValue: newValue
                });
            }
        }

        return changeset;
    }

    hasChanges() {
        return this.getChanges().length;
    }
};

export default ChangeTracker;