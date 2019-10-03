import _ from 'underscore';
import moment from 'moment';

class DateHelper {

    toISO(date) {
        if (!_.isDate(date)) {
            date = new Date(date);
        }

        return date.toISOString();
    }

    toShortDate(date) {
        return this.toISO(date).substr(0, 10);
    }

    parse(date) {
        return moment(date, 'YYYY-MM-DD', true);
    }

    daysBetween(date1, date2) {
        return date1.diff(date2, 'days');
    }

    daysUntil(date) {
        if (_.isString(date)) {
            date = moment.utc(date).startOf('day');
        }

        return date.diff(this.today, 'days') + 1;
    }

    isSameAsOrAfterToday(date) {
        if (moment.utc(date).startOf('day').isSame(this.today)) {
            return true;
        }

        if (moment.utc(date).startOf('day').isAfter(this.today)) {
            return true;
        }

        return false;
    }

    isSameAsOrBeforeToday(date) {

        if (moment.utc(date).startOf('day').isSame(this.today)) {
            return true;
        }

        if (moment.utc(date).startOf('day').isBefore(this.today)) {
            return true;
        }

        return false;
    }

    isWithinDateRange(date, fromDate, toDate) {
        date = moment(date);

        if (fromDate && date.isBefore(moment(fromDate))) {
            return false;
        }

        if (toDate && date.isAfter(moment(toDate))) {
            return false;
        }

        return true;
    }

    get todayUTC() {
        return moment.utc().startOf('day');
    }

    get today() {
        return moment().startOf('day');
    }
}

export default new DateHelper();