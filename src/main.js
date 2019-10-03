import _ from 'underscore';
import { Router, Repository } from './core';
export * from './core';
export * from './models';

import Formatters from './formatters';
import Mixins from './mixins';
import Data from './data';
import Entities from './entities';

import Vuex from 'vuex';

import Plugins from './plugins';
import Services from './services';

import VeeValidate from 'vee-validate';

import ScriptLoader from 'vue-plugin-load-script';
Plugins.ScriptLoader = ScriptLoader;

//import AsyncComputed from 'vue-async-computed';

import Theme from './theme';
import './components';

let AppHost = {

    Vue: null,
    router: null,
    store: null,
    
    install(Vue, options) {
        
        this.Vue = Vue;

        //Vue.use(AsyncComputed);

        Vue.use(VeeValidate, {
            fieldsBagName: '__fields'
        });

        options.theme = options.theme || 'core';
        options.entities = options.entities || {};

        for (var each in Entities) {
            options.entities[each] = Entities[each];
        }

        Vue.use(Theme, { theme: options.theme });

        Repository.register(options.entities);

        this.initStore();
        
        Vue.use(Router, { host: this });

        this.initFormatters();
        this.initPlugins(options.plugins || Plugins);
        this.mount(options.render);
    },

    initFormatters() {

        for (var formatter in Formatters) {
            this.Vue.filter(formatter, Formatters[formatter]);
        }
    },

    mount(render) {

        this.Vue.config.productionTip = false;

        new this.Vue({
            router: this.router,
            store: this.store,
            render: render
        })
        .$mount('#app');
    },

    initPlugins(plugins) {

        for (var plugin in plugins) {

            this.Vue.use(plugins[plugin], {
                store: this.store,
                router: this.router
            });
        }
    },
    
    initStore() {

        this.Vue.use(Vuex);

        this.store = new Vuex.Store({
            state: {},
            mutations: {},
            actions: {}
        });
    }
};

export {
    AppHost,
    Mixins,
    Formatters,
    Plugins,
    Data,
    Entities,
    Services
};