import _ from 'underscore';
import Entity from '../core/Entity';

class Event extends Entity {

    constructor() {
        super('event');
        
        this.name = '';
        this.parameters = {};

        this.source = {
            id: '',
            type: ''
        };
    }
};

export default Event;