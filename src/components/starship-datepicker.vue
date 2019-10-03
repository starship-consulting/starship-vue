<template>
    <label class="starship-datepicker activatable" @click="focus" :class="{ hideHeader: hideHeader }">
        <span class="label" v-if="label">{{label}}</span>

        <div class="starship-field field-container" :style="style">
            <v-menu :close-on-content-click="false" v-model="dateMenu" lazy transition="scale-transition" light lazy>
                <v-text-field ref="field" class="no-padding no-margin starship-datepicker" slot="activator" v-model="formatted" :prefix="prefix" :suffix="suffix" spellcheck="false" :clearable="clearable" readonly outline></v-text-field>
                <v-date-picker v-model="dirty" @input="dateMenu = false" no-title scrollable></v-date-picker>
            </v-menu>
        </div>
    </label>
</template>

<style lang="scss">

    .starship-datepicker {
        
        width: 100%;

        .label {
            font-size: 1.1em;
            font-weight: 400;
        }

        &.fill-height {
            height: 100%;
        }

        .starship-field {
            width: 100%;
        }

        &.hideHeader .v-picker__title {
            display: none;
        }

        .inline .v-picker__body {
            background-color: rgb(245, 245, 245);
        }

        .v-input__control {
            height: 30px;
        }

        .v-input__slot {
            padding: 0 !important;
            min-height: 30px !important;
            max-height: 30px !important;
            border: 0 !important;
        }

        .v-text-field {

            width: 100%;

            .v-input__slot {
                cursor: pointer !important;
                margin-bottom: 0;
                border-color: transparent !important;
                padding: 0;
                width: 100%;

                background-color: var(--input-color) !important;
            }

            &.v-input--is-focused {

                .v-input__slot {
                    box-shadow: 0 0 5px rgba(167, 203, 226, 1);
                }

                .v-text-field__prefix {
                    color: rgb(175, 175, 175);
                }
            }

            .v-input__append-inner {
                margin-top: 0;
                left: 10px;
                position: relative;

                .v-icon {
                    font-size: 16px;
                }
            }

            .v-input__prepend-outer {
                .v-input__icon .v-icon {
                    color: rgba(0, 0, 0, 0.4);
                }
            }

            .v-input__icon--clear {
                position: relative;
                top: 3px;
                opacity: 0;
            }
            
            input {
                width: 100%;
                margin: 0;
                padding: 0;
                padding-top: 5px;
            }

            input, .v-text-field__prefix {
                margin: 0 !important;
                font-size: 1rem;
            }
        }

        .v-input:hover {
            .v-input__icon--clear {
                opacity: 1;
            }
        }
    }

</style>

<script>
    import _ from 'underscore';
    import moment from 'moment';
    import { Component, Util } from 'starship';
    
    export default Component('starship-datepicker', {

        props: {
            value: {
                type: [String, Date]
            },

            validate: {
                type: [String, Object]
            }
        },

        properties: {
            $label: '',
            $prefix: '',
            $suffix: '',
            $focused: false,
            $placeholder: '',
            $autofocus: false,
            $readonly: false,
            $transparent: false,
            $clearable: false,
            $prependIcon: '',
            $width: 0,
            $landscape: false,
            $inline: false,
            $hideHeader: false,
            $openWhenFocused: false,
            $borderless: false,
            hasAppend: false,
            hasPrepend: false,
            dirty: '',
            mask: '',
            dateMenu: false,
            $_monitor: null,

            getSuffix() {
                if (this.suffix) {
                    return this.suffix;
                }
                return '';
            },

            style() {
                let style = {};

                if (this.width) {
                    style.width = this.width + 'px';
                }

                return style;
            }
        },

        computed: {

            formatted: {

                get() {
                    if (!this.dirty) {
                        return '';
                    }

                    return moment(this.dirty).format('MM/DD/YYYY');
                },

                set(value) {
                    if (!value) {
                        this.dirty = '';
                    }
                }
            }
        },

        watch: {

            dirty(value) {
                this.$emit('input', value);
            },

            focused: {
                immediate: true,
                handler: 'updateFocus'
            },

            value: {
                immediate: true,

                handler() {
                    let value = this.value;

                    if (value) {
                        value = moment(value).toISOString().substr(0, 10);
                    }
                    
                    this.dirty = value;
                }
            }
        },

        ready() {
            this.updateFocus();
            
            if (this.$slots.append) {
                this.hasAppend = true;
            }

            if (this.$slots.prepend) {
                this.hasPrepend = true;
            }
        },

        updateFocus() {
            if (this.focused) {
                this.focus();
            }
        },

        open() {
            this.dateMenu = true;
        },

        focus(e) {

            this.$emit('focus', e, this);

            if (this.openWhenFocused) {
                this.open();
            }

            if (this.$refs.field) {

                if (!this.$el.offsetParent) {
                    if (!this.$_monitor) {
                        this.$_monitor = setInterval(this.focus, 100);
                    }

                    return;
                }

                this.clearMonitor();

                this.$refs.field.focus();
            }
        },

        clearMonitor() {
            if (this.$_monitor) {
                clearInterval(this.$_monitor);
                this.$_monitor = null;
            }
        },

        beforeDestroy() {
            this.clearMonitor();
        },

        submit(e) {
            this.$emit('submit', e);
        },

        onFocused(e) {
        }
    });
</script>