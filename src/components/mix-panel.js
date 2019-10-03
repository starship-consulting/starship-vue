import mixpanel from 'mixpanel-browser';
import { Component, User } from 'starship';

export default Component('mix-panel', {

    properties: {

        $id: '',
        
        $events: [],

        mixpanel: null
    },
    
    ready() {
        
        if (window.location.hostname == 'localhost') {
            return;
        }
        
        mixpanel.init(this.id);
        mixpanel.identify(User.current.id);

        let creationDate = new Date(User.current.creationDate).getTime();

        mixpanel.people.set({

            "$email": User.current.email,
            "$name": User.current.name,

            "$created": creationDate,
            "$last_login": new Date(),

            "$role": User.current.role
        });

        console.log(this.id, User.current.id, mixpanel);
        
        this.$events.on('navigate', (to, from) => {
            mixpanel.track('navigate', { from: from.name.toLowerCase(), to: to.name.toLowerCase() });
        });

        this.events.each(name => {
            this.$events.on(name, () => {
                mixpanel.track(name);
            });
        });
    },
    
    render() {
    }
});