import _ from 'underscore';
import { Entity, Repository } from 'starship';

class DataSet extends Entity {

    constructor(options) {
        super('dataset');

        this.discriminator = '';
        this.items = [];

        _.extend(this, options);
    }
}

export default DataSet;