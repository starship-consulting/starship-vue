import _ from 'underscore';

let extensions = {

    sum(predicate) {
        return this.reduce((s, f) => {
            return s + predicate(f);
        }, 0);
    },

    contains(item) {
        return this.includes(item);
    },

    any(field) {

        if (!field) {
            return this.length > 0;
        }

        return _.any(this, field);
    },

    groupBy(field) {
        return _.groupBy(this, field);
    },

    sortBy() {

        let sort = _(this).chain();

        Array.prototype.slice.call(arguments).each(predicate => {
            sort = sort.sortBy(predicate);
        });

        return sort.value();
    },

    take(amount) {
        return _.take(this, amount);
    },

    flatten(arrayFieldName) {
        let results = [];

        _.each(this, each => {
            
            let children = (each[arrayFieldName] || []).flatten(arrayFieldName);

            _.each(children, result => {
                results.push(_.omit(result, arrayFieldName));
            });

            results.push(_.omit(each, arrayFieldName));
        });

        return results;
    },

    find(predicate) {

        if (_.isFunction(predicate)) {
            return _.find(this, predicate);
        }

        let useId = false;

        if (this.length) {
            if (_.has(this[0], 'id')) {
                useId = true;
            }
        }
        
        return _.find(this, each => {

            if (useId && each.id === predicate) {
                return each;
            }

            return each == predicate;
        });
    },

    where(predicate) {
        return _.filter(this, predicate);
    },

    map(predicate) {
        return _.map(this, predicate);
    },

    each(predicate) {
        return _.each(this, predicate);
    },

    sortByReverse(predicate) {
        let result = _.sortBy(this, predicate);
        result.reverse();
        return result;
    },
    
    remove(item) {
        const i = this.indexOf(item);

        if (i >= 0) {
            this.splice(i, 1);
            return true;
        }

        return false;
    },

    removeWhere(predicate) {
        let count = 0;

        for (let i = this.length - 1; i >= 0; i--) {
            if (predicate(this[i])) {
                this.splice(i, 1);
                count++;
            }
        }

        return count;
    },

    last() {
        if (!this.length) {
            return null;
        }

        return this[this.length - 1];
    }
};

for (var each in extensions) {
    Array.prototype[each] = extensions[each];
}