<template>
    <label class="starship-textarea layout column">
        <span class="label" v-show="label">{{ label }}</span>
        <textarea class="flex elevation-1" ref="input" v-model="dirty" browser-autocomplete="disabled" autocomplete="starship-textarea" spellcheck="false" />
    </label>
</template>

<style lang="scss">

    .starship-textarea {

        height: 100%;
        width: 100%;

        .label {
            font-size: 1em;
            font-weight: 500;
        }

        textarea {
            width: 100%;
            padding-left: 8px;
            padding-right: 8px;
            padding-top: 5px;
            padding-bottom: 5px;
            background: white !important;

            color: rgb(40, 40, 40);
            font-family: Roboto, sans-serif;
            font-weight: 400;
            font-size: 1em;
        }
    }

</style>

<script>
    import { Component, Util, Formatters } from 'starship';
    
    export default Component('starship-textarea', {

        props: {
            value: {
                type: [Number, String]
            }
        },

        properties: {
            $label: '',
            internalValue: ''
        },

        computed: {

            dirty: {

                get: function () {
                    return this.internalValue;
                },

                set: function (value) {
                    this.internalValue = value;
                    this.$emit('input', value);
                }
            }
        },

        watch: {
            
            value: {
                immediate: true,

                handler(value) {
                    if (this.value != null) {
                        this.dirty = this.value.toString();
                    }
                    else {
                        this.dirty = '';
                    }
                }
            }
        },

        ready() {
        },

        focus() {
            this.$refs.input.focus();
        }
    });
</script>