import { EventContext } from 'starship';

class EventsPlugin {
    
    install(Vue, options) {
        
        Vue.mixin({
            
            beforeCreate() {
                this.$events = new EventContext();
            },

            beforeDestroy() {
                this.$events.dispose();
                delete this.$events;
            }
        });
    }
};

export default new EventsPlugin();