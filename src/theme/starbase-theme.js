import colors from 'vuetify/es5/util/colors'
import './starbase-styles.scss';

var primary = colors.grey;

var Theme = {
    header: '#282F38',
    primary: primary.lighten1, // Main font color
    nav: '#363D48', // Nav background color
    secondary: primary.lighten3, // Active font color
    border: '#322444',
    clickable: colors.lightBlue.darken3,
    'clickable-text': colors.shades.white,
    highlight: colors.blue.darken4,
    'form-text': primary.darken2,
    accent: '#0E79B2', // Button text & icons
    toolbar: '#F6F7F9',
    focus: colors.orange.base
};

Theme.icon = Theme.accent;
Theme['button-text'] = Theme.icon;
Theme.hover = Theme['button-text'];
Theme.divider = primary.lighten2;


export default Theme;