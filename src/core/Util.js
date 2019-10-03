import _ from 'underscore';

let Util = {

    hasValue(value) {
        return !_.isUndefined(value) && !_.isNull(value);
    },

    set(target, path, value) {
        var arr = path.split('.');
        while (arr.length - 1 && (target = target[arr.shift()]));
        target[arr.shift()] = value;
        return target;
    },

    has(target, path) {
        var arr = path.split('.');
        while (arr.length - 1 && (target = target[arr.shift()]));
        return _.has(target, arr.shift());
    },

    delete(target, path) {
        var arr = path.split('.');
        while (arr.length - 1 && (target = target[arr.shift()]));
        delete target[arr.shift()];
    },

    get(target, path) {
        var arr = path.split('.');
        while (arr.length && (target = target[arr.shift()]));
        return target;
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    roundToNearest(value, interval) {
        return Math.round(value / interval) * interval;
    },

    keys(obj) {
        return _.map(obj, (value, key) => {
            return key;
        });
    },

    values(obj) {
        return _.map(obj, (value, key) => {
            return value;
        });
    },

    spaceCamelcase(input) {
        return input.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3').replace(/^./, function (str) { return str.toUpperCase(); });
    },

    replace(input, search, replacement) {
        return input.replace(new RegExp(search, 'g'), replacement);
    },

    ensureDate(value) {
        if (!_.isDate(value)) {
            return new Date(value);
        }

        return value;
    },

    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    toQueryString(json) {
        return Object.keys(json).map(function (key) {
            if (json[key].toString().length) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
            }

            return '';
        }).join('&');
    }
};


export default Util;