import _ from 'underscore';

let rootNamespace = 'starship';
let initialized = false;
let plugins = {};

export default class {

    constructor(name) {

        if (!name) {
            throw 'Plugin requires name.';
        }

        this.dependencies = ['store', 'router'];
        this.name = name;
        this.namespace = rootNamespace + '/' + this.name;
    }

    install(Vue, options) {
        
        //Vue.prototype.$starship = Vue.prototype.$starship || {};
        //Vue.prototype.$starship[this.name] = this;
        
        _.each(this.dependencies, (dependency) => {
            this[dependency] = options[dependency];
        });

        if (!initialized) {

            Vue.mixin({

                beforeCreate() {

                    this.$starship = {};
                    //this.$starship[pluginName] = plugin;

                    for (var pluginName in plugins) {

                        let eachPlugin = plugins[pluginName];

                        if (_.isFunction(eachPlugin)) {
                            this.$starship[pluginName] = eachPlugin.bind(this);
                        }
                        else {
                            this.$starship[pluginName] = {};

                            for (var each in eachPlugin) {
                                if (_.isFunction(eachPlugin[each])) {
                                    this.$starship[pluginName][each] = eachPlugin[each].bind(this);
                                }
                                else {
                                    this.$starship[pluginName][each] = eachPlugin[each];
                                }
                            }
                        }
                    }
                }
            });

            initialized = true;
        }

        if (this.mixin) {
            plugins[this.name] = this.mixin;
        }

        if (this.state) {
            
            this.store.registerModule(this.namespace, {
                namespaced: true,
                state: this.state,
                mutations: this.mutations,
                actions: this.actions
            });
        }
        
        if (this.actions) {
            for (var action in this.actions) {
                this[action] = ((name) => {
                    return (arg) => {
                        this.dispatch(name, arg);
                    };
                })(action);
            }
        }

        if (this.mutations) {
            for (var mutation in this.mutations) {
                if (!this[mutation]) {
                    this[mutation] = ((name) => {
                        return (arg) => {
                            this.commit(name, arg);
                        };
                    })(mutation);
                }
            }
        }
    }

    getState(name) {

        var state = this.store.state[this.namespace];

        if (name) {
            return state[name];
        }

        return state;
    }

    commit(action, arg) {
        this.store.commit(this.namespace + '/' + action, arg);
    }

    dispatch(action, arg) {
        this.store.dispatch(this.namespace + '/' + action, arg);
    }
};