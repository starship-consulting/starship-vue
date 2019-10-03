import _ from 'underscore';
import { Entity, Guid } from 'starship';

class Field extends Entity {

    constructor() {
        super('field');
        
        this.parent = '';
        this.type = 'text';
        this.isDefault = false;
        this.value = '';
        this.type = 'text';
        this.label = 'New Field';
        this.index = 0;
        this.size = 2;
    }

    get name() {
        return this.id;
    }
}

export default Field;