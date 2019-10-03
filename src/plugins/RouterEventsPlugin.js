import { EventContext } from 'starship';

class RouterEventsPlugin {

    constructor() {
        this.context = new EventContext();
    }

    install(Vue, options) {

        options.router.beforeEach((to, from, next) => {
            let cancelled = false;
            let resolved = false;

            this.context.emit('navigate.before', to, from, function (path) {

                if (path) {
                    resolved = true;
                    next(path);
                    return;
                }

                cancelled = true;
            });

            if (resolved) {
                return;
            }

            if (cancelled) {
                next(false);
            }
            else {
                next();
            }
        });
        
        options.router.afterEach((to, from, next) => {
            this.context.emit('navigate', to, from, next);
        });
    }
}

export default new RouterEventsPlugin();