import BasePlugin from './BasePlugin';

class ConfirmPlugin extends BasePlugin {

    constructor() {
        super('confirm');
        
        this.state = {
            confirm: false,
            text: ''
        };

        this.mutations = {

            clear(state) {
                state.confirm = false;
            },

            show(state, text) {
                state.text = text;
                state.confirm = true;
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

            return new Promise(resolve => {

                this.$events.once('confirmed', result => {
                    resolve(result);
                });

                this.$events.emit('confirm', message);
            });
        }
    }
};

export default new ConfirmPlugin();