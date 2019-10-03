import Vue from 'vue';
import { Component, User } from 'starship';

export default Component('app-cues', {

    properties: {

        $id: '',
        
        $events: []
    },
    
    ready() {
        
        Vue.loadScript('//fast.appcues.com/' + this.id + '.js').then(() => {
            
            let creationDate = new Date(User.current.creationDate).getTime();
            
            Appcues.identify(User.current.id, {
                name: User.current.name,
                email: User.current.email,
                created_at: creationDate
            });

            this.$events.on('navigate', (to, from) => {
                Appcues.page();
            });

            this.events.each(name => {
                this.$events.on(name, () => {
                    Appcues.track(name);
                });
            });
        });
    },
    
    render() {
    }
});