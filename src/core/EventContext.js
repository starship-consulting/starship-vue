import EventEmitter from 'EventEmitter';
import _ from 'underscore';

let emitter = new EventEmitter();

class EventContext {

    constructor() {
        this.handlers = [];
    }

    dispose() {
        _.each(this.handlers, (each) => {
            this.off(each.name, each.callback);
        });
        
        this.handlers = [];
    }

    once(name, callback) {
        emitter.once(name, callback);
    }

    on(name, callback) {
        this.handlers.push({ name: name, callback: callback });
        emitter.on(name, callback);
    }

    off(name, callback) {
        emitter.off(name, callback);
    }

    emit() {
        emitter.emit.apply(emitter, arguments);
    }
};

export default EventContext;