import _ from 'underscore';

export default class {

    constructor(options) {
        _.extend(this, options);
    }

    getDefaultValue() {

        switch (this.type) {

            case 'number':
            case 'text':
            case 'phone':
                return '';

            case 'currency': // deprecated
            case 'money':
            case 'percent':
                return 0;

            case 'checkbox':
            case 'toggle':
                return false;
        }

        return null;
    }

    getValue() {
        return this.value || this.getDefaultValue();
    }

    resolveComponent(type) {

        if (!type) {
            type = this.type;
        }
        
        switch (type) {

            case 'date':
                type = 'datepicker';
                break;

            case 'currency': // deprecated
            case 'phone':
            case 'number':
            case 'percent':
            case 'text':
            case 'money':
                type = 'input';
                break;

            case 'checkbox':
            case 'toggle':
                type = 'toggle';
                break;
        }

        return 'starship-' + type;
    }

    static get types() {

        return [
            'text',
            'money',
            'percent',
            'date',
            //'tags',
            'checkbox',
            'toggle',
            'phone'
        ]
        .sort();
    }

    // Todo:  Fix this hack
    get attributes() {

        let attributes = {
            label: this.label,
            'select-when-focused': true
        };

        if (this.type == 'select' || this.type == 'dropdown-tree') {
            attributes.items = this.items;
            attributes.appendToBody = true;
        }

        if (this.help) {
            attributes.help = this.help;
        }

        if (this.type == 'text' || this.type == 'money' || this.type == 'percent' || this.type == 'phone') {
            attributes.type = this.type;
        }

        if (this.type == 'toggle') {
            attributes.mode = 'switch';
        }

        if (this.editable) {
            attributes.editable = true;
        }

        if (this.selectableBranches) {
            attributes.selectableBranches = true;
        }

        return attributes;
    }

    get component() {
        return this.resolveComponent(this.type);
    }
}