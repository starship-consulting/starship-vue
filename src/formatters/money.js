export default function (value, options) {
    
    if (!options) {
        options = {};
    }

    options.showCents = options.showCents || false;
    options.includeSign = options.includeSign || false;
    options.suffix = options.suffix || ''; // k or m or *
    
    if (!value) {
        value = 0;
    }

    if (!options.showCents) {
        value = parseInt(value);
    }

    if (options.suffix === '*') {
        if (value >= 1000000) {
            options.suffix = 'm';
        }
        else if (value >= 1000) {
            options.suffix = 'k';
        }
        else {
            options.suffix = '';
        }
    }

    if (value >= 1000) {
        if (options.suffix === 'm') {
            value /= 1000000;
        }

        if (options.suffix === 'k') {
            value /= 1000;
        }
    }
    
    value = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    if (!options.showCents) {
        if (options.suffix == '' || options.suffix == 'k') {
            value = value.slice(0, -3);
        }
        else if (options.suffix == 'm') {
            value = value.slice(0, -1);
        }
    }

    if (!options.includeSign) {
        value = value.replace('$', '');
    }

    //return (value + options.suffix).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return value + options.suffix;
};