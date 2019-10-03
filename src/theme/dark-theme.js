import colors from 'vuetify/es5/util/colors'

var accent = colors.indigo;
var primary = colors.grey;

var Theme = {
    header: primary.darken4,
    primary: primary.base,
    nav: primary.darken3,
    secondary: colors.grey.lighten3,
    border: '#322444',
    clickable: colors.lightBlue.darken3,
    'clickable-text': colors.shades.white,
    highlight: colors.blue.darken4,
    form: colors.shades.white,
    'form-text': primary.darken2,
    accent: accent.base,
    toolbar: colors.grey.lighten4,
    focus: colors.orange.base
};

Theme.icon = accent.lighten1;
Theme['button-text'] = Theme.icon;
Theme.hover = Theme['button-text'];
Theme.divider = primary.lighten2;


export default Theme;