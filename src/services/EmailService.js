import _ from 'underscore';
import axios from 'axios';

class EmailService {

    constructor() {
    }

    async send(to, subject, body, cc) {

        if (!to || !subject || !body) {
            return;
        }

        let recipients = [];

        if (_.isString(to)) {
            recipients.push(to);
        }
        else {
            recipients = to.where(each => each);

            if (!recipients.length) {
                return;
            }
        }

        await axios.post('/api/email', { to: recipients, subject: subject, body: body, cc: cc });
    }
}

export default new EmailService();