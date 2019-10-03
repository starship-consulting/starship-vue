import BasePlugin from './BasePlugin';
import { EventContext } from 'starship';

class UnsavedChangesPlugin extends BasePlugin {

    constructor() {
        super('unsaved');

        this.$event = new EventContext();

        this.state = {
            changes: false,
            editing: null
        };

        this.mutations = {

            edit(state, value) {
                state.editing = value;
            },

            hasChanges(state, value) {
                state.changes = value;
            }
        };
    }

    install(Vue, options) {
        super.install(Vue, options);

        this.router.beforeEach((to, from, next) => {
            
            var editing = this.getState('editing');

            //console.log('editing?', editing);

            if (editing) {
                this.$events.emit('unsaved', to, from, next);
                return;
            }
            
            next();
        });
    }
}

export default new UnsavedChangesPlugin();