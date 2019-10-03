import _ from 'underscore';
import { Entity, Guid, Util } from 'starship';

class Type extends Entity {

    constructor() {
        super('type');

        this.name = '';
        this.fields = [];
    }

    addField(field) {
    }
}

export default Type;