import Vuetify from 'vuetify/lib';

import 'material-design-icons-iconfont/dist/material-design-icons.css';
import './main.styl';
import '@fortawesome/fontawesome-pro/css/all.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import './styles.scss';
import 'dropzone/dist/dropzone.css';

import Resize from 'vuetify/lib/directives/resize';
import Scroll from 'vuetify/lib/directives/scroll';

import Verte from 'verte';
import 'verte/dist/verte.css';

export default Plugin = {

    install(Vue, options) {

        Vue.component('verte', Verte);

        Vue.directive('resize', Resize);
        Vue.directive('scroll', Scroll);
        
        Vue.use(Vuetify, {

            iconfont: 'md',
        
            options: {
                customProperties: true
            },
        
            theme: options.theme
        });
    }
};