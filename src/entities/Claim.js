import { Entity } from 'starship';
import axios from 'axios';

class Claim extends Entity {

    constructor() {
        super('claim');

        this.name = '';
        this.value = '';
        this.status = 0;
    }

    async request(email) {
        //await this.save();
        await axios.post('/claims?email=' + email);
    }
}

export default Claim;