import _ from 'underscore';
import Vue from 'vue';

var reserved = ['components', 'asyncComputed', 'updated', 'props', 'beforeRouteLeave', 'template', 'mixins', 'functional', 'render', 'methods', 'name', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'watch', 'activated'];

var aliases = {
    ready: 'mounted',
    dispose: 'beforeDestroy'
};

function cloneValue(value) {

    if (value == null) {
        return null;
    }

    if (_.isDate(value)) {
        return new Date(value);
    }
    else if (_.isArray(value)) {
        return _.map(value, cloneValue);
    }
    else if (_.isObject(value)) {
        let instance = JSON.parse(JSON.stringify(value));
        instance.__proto__ = value.__proto__;
        return instance;
    }

    return JSON.parse(JSON.stringify(value));
}

function mapProperties(component, properties) {

    var data = {};

    for (var propertyName in properties) {
        var value = properties[propertyName];
        let defaultValue = value;

        if (_.isFunction(value)) {
            component.computed[propertyName] = value;
            continue;
        }
        
        if (propertyName.startsWith('$')) {
            var type;

            if (_.isString(value)) {
                type = String;
            }
            else if (_.isNumber(value)) {
                type = Number;
            }
            else if (_.isBoolean(value)) {
                type = Boolean;
            }
            else if (_.isArray(value)) {
                type = Array;
                defaultValue = (function (val) {
                    //let instanceValue = JSON.parse(JSON.stringify(val));
                    return function () {
                        //return instanceValue;
                        return JSON.parse(JSON.stringify(val));
                    }
                })(value);
            }
            else if (_.isDate(value)) {
                type = Date;
                defaultValue = (function (val) {
                    //let instanceValue = JSON.parse(JSON.stringify(val));
                    return function () {
                        return new Date(val);
                    }
                })(value);
            }
            else if (_.isObject(value) || value === null) {
                type = Object;
                defaultValue = (function (val) {
                    //let instanceValue = JSON.parse(JSON.stringify(val));
                    return function () {

                        if (val === null) {
                            return null;
                        }

                        return cloneValue(val);
                    }
                })(value);
            }
            else {
                type = Symbol;
            }
            
            component.props[propertyName.substring(1)] = {
                type: type,
                default: defaultValue
            };

            continue;
        }

        data[propertyName] = value;
    }

    component.data = (function (presets) {

        return function () {
            var result = {};

            for (var each in presets) {
                result[each] = cloneValue(presets[each]);
            }

            return result;
        }
    })(data);   
};

export default function (name, definition) {

    var component = {
        computed: definition.computed || {}
    };

    for (var member in definition) {

        if (member == 'computed') {
            continue;
        }
        
        var memberName = aliases[member] || member;
        var value = definition[member];

        if (_.contains(reserved, memberName)) {
            component[memberName] = value;
            continue;
        }

        if (_.isFunction(value)) {
            
            component.methods = component.methods || {};
            component.methods[memberName] = value;
            continue;
        }

        if (memberName == 'properties') {
            component.props = component.props || {};
            mapProperties(component, value);
        }
    }
    
    return Vue.component(name, component);
};