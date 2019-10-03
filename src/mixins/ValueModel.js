
export default {

    props: {
        value: {}
    },

    data() {
        return {
            model: null
        };
    },

    watch: {

        model: {
            immediate: true,

            handler(value) {
                this.$emit('input', value);
            }
        },

        value: {
            immediate: true,

            handler(value) {
                this.model = value;
            }
        }
    }
};