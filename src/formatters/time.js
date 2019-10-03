import moment from 'moment'

export default function (value, format) {

    if (!value) {
        return '';
    }
    
    return moment(value).fromNow();
};