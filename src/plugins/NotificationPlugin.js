import BasePlugin from './BasePlugin';

class NotificationPlugin extends BasePlugin {

    constructor() {
        super('notification');
        
        this.state = {
            notification: false,
            text: ''
        };

        this.mutations = {

            clear(state) {
                state.notification = false;
            },

            show(state, text) {
                state.text = text;
                state.notification = true;
            }
        };

        this.actions = {

            show({ commit }, text) {
                commit('clear');

                setTimeout(() => {
                    commit('show', text);
                }, 250);
            }
        }

        this.mixin = function (message) {
            this.$events.emit('notification', message);
        }
    }
};

export default new NotificationPlugin();