import moment from 'moment';
import _ from 'underscore';

export default function (value, options) {

    if (!value) {
        return '';
    }

    options = options || {};
    
    if (_.isString(options)) {
        return moment(value).format(options);
    }

    let output = moment(value);
    let format = options.format || 'MM/DD/YYYY';

    if (options.subtract) {
        output = output.subtract(options.subtract.unit, options.subtract.value);
    }
    
    return output.format(format);
};