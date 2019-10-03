import BasePlugin from './BasePlugin';

class IconsPlugin extends BasePlugin {

    constructor() {
        super('icons');

        this.mixin = {
            prefix: 'fas fa-fw fa-'
        };

        //this.prefix = 'fas fa-fw fa-';
    }
}

export default new IconsPlugin();