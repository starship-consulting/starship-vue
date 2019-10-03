<template>
    <div class="starship-date" @click="focus" :class="{ hideHeader: hideHeader, borderless: borderless }">
        <label v-if="label">{{label}}</label>

        <div v-if="!inline" class="starship-field field-container" :class="{ append: hasAppend, prepend: hasPrepend }" :style="style">

            <slot name="prepend"></slot>

            <v-menu v-if="!readonly" :close-on-content-click="false" v-model="dateMenu" transition="scale-transition" light lazy>
                <v-text-field ref="field" class="no-padding no-margin starship-date" slot="activator" v-model="formatted" :prefix="prefix" :suffix="suffix" spellcheck="false" :clearable="clearable" readonly outline></v-text-field>
                <v-date-picker v-model="dirty" @input="dateMenu = false" no-title scrollable></v-date-picker>
            </v-menu>

            <v-text-field v-else ref="field" class="no-padding no-margin starship-date readonly" slot="activator" v-model="formatted" :prefix="prefix" :suffix="suffix" spellcheck="false" :clearable="clearable" readonly outline></v-text-field>

            <slot name="append"></slot>
        </div>

        <v-date-picker v-else v-model="dirty" class="inline" @input="dateMenu = false" no-title scrollable></v-date-picker>
    </div>
</template>

<style lang="scss">

    .starship-date {
        
        max-width: 140px;

        label {
            min-height: 16px;
        }

        .readonly {
            opacity: 0.7;

            .v-text-field__slot, input {
                cursor: default !important;
            }
        }

        .starship-field {
            min-height: 38px;
            min-width: 130px;
            width: 100%;
        }

        &.fill-height {
            height: 100%;
        }

        &.hideHeader .v-picker__title {
            display: none;
        }

        .inline .v-picker__body {
            background-color: rgb(245, 245, 245);
            border: solid 1px rgb(220, 220, 220);
        }

        .v-input__control {
            height: var(--input-height);
        }

        &:not(.borderless) .field-container {
            display: flex;
            border: solid 1px var(--divider-color);
            border-radius: 4px;

            &:hover {
                border: solid 1px var(--focus-color);
            }
        }
        
        .prepend .v-text-field {
            border-left: solid 1px var(--divider-color);
        }

        .append .v-text-field {
            border-right: solid 1px var(--divider-color);
        }

        &.fill-height .v-text-field * {
            height: 100%;
            max-height: 100%;
        }

        .v-input__slot {
            padding-left: 8px !important;
            padding-right: 8px !important;
        }

        .v-text-field {

            width: 100%;

            .v-input__slot {
                cursor: pointer !important;
                margin-bottom: 0;
                border-color: transparent !important;
                width: 100%;

                background-color: var(--input-color) !important;
            }

            &.v-text-field--outline .v-input__slot {
                min-height: var(--input-height) !important;
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
                margin-top: 5px;

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
    
    export default Component('starship-date', {

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