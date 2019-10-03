import VueRouter from 'vue-router';

export default {
    
    routes: [],

    install(Vue, options) {

        Vue.use(VueRouter);
        
        options.host.router = new VueRouter({
            mode: 'history',
            base: process.env.BASE_URL,
            routes: this.routes
        });
    }
};