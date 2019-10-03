<template>
    <div class="starship-text" @click="focus">
        <label v-if="label">{{label}}</label>

        <div class="starship-field field-container" :class="{ append: hasAppend, prepend: hasPrepend }" :style="style">
            <slot name="prepend"></slot>
            <v-text-field ref="field" class="no-padding no-margin" v-model="dirty" :placeholder="placeholder" :prefix="getPrefix" :mask="getMask" :suffix="getSuffix" spellcheck="false" :validate="validate" :autofocus="autofocus" :clearable="clearable" @keydown.enter="submit" :prepend-icon="prependIcon" :readonly="readonly" :type="fieldType" browser-autocomplete="disabled" outline hide-details></v-text-field>
            <slot name="append"></slot>
        </div>
    </div>
</template>

<style lang="scss">

    .starship-field {

        input {
            color: var(--text-color) !important;
        }

        .v-input__control {
            box-sizing: border-box;
        }
    }

    .starship-text {

        &.fill-height {
            height: 100%;
        }

        .v-input__icon--clear {
            position: relative;
            top: 3px;
                
            .v-icon:not(:hover) {
                color: rgba(0, 0, 0, 0.3);
            }
        }

        .field-container {
            display: flex;
            border: solid 1px var(--border-color);
            border-radius: 4px;

            &:hover {
                border: solid 1px var(--focus-color);
            }
        }
        
        .prepend .v-text-field {
            border-left: solid 1px var(--border-color);
        }

        .append .v-text-field {
            border-right: solid 1px var(--border-color);
        }

        &.fill-height .v-text-field * {
            height: 100%;
            max-height: 100%;
        }

        .append {
            .starship-button {
                position: relative;
                top: -1px;
                height: calc(var(--input-height) + 2px);
            }

            border-bottom: 0 !important;

            .v-input__control {
                border-bottom: solid 1px var(--border-color);
                border-bottom-right-radius: 0 !important;
            }
        }

        .v-text-field {

            /*&.append {
                border-top-right-radius: 0 !important;
                border-bottom-right-radius: 0 !important;
            }*/

            .v-input__slot {
                cursor: pointer !important;
                margin-bottom: 0;
                border-color: transparent !important;
                padding-left: 8px;
                padding-right: 8px;

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
                    //font-size: 16px;
                }
            }

            .v-input__prepend-outer {
                margin-top: 5px;

                .v-input__icon .v-icon {
                    color: rgba(0, 0, 0, 0.4);
                }
            }

            input, .v-text-field__prefix {
                margin: 0 !important;
            }

            &.v-input--is-readonly {

                input {
                    cursor: not-allowed;
                }

                .v-input__slot {
                    background-color: rgba(0, 0, 0, 0.1) !important;
                }
            }
        }
    }

</style>

<script>
    import _ from 'underscore';
    import moment from 'moment';
    import { Component, Util } from 'starship';
    
    export default Component('starship-text', {

        props: {
            value: {
                type: [Number, String, Date]
            },

            initial: {
                type: [Number, String]
            },

            validate: {
                type: [String, Object]
            }
        },

        properties: {
            $type: '',
            $label: '',
            $prefix: '',
            $suffix: '',
            $focused: false,
            $placeholder: '',
            $autofocus: false,
            $readonly: false,
            $clearable: false,
            $prependIcon: '',
            $width: 0,
            hasAppend: false,
            hasPrepend: false,
            dirty: '',
            mask: '',
            dateMenu: false,
            $_monitor: null,

            formatted() {

                if (this.dirty) {
                    if (this.type == 'date') {
                        return moment(this.dirty).format('MM/DD/YYYY');
                    }
                }

                return this.dirty;
            },

            getMask() {
                if (this.mask) {
                    return this.mask;
                }

                let mask = '';

                if (this.type == 'phone') {
                    mask = '(###) ### - ####';
                }
                else if (this.type == 'money') {
                    mask = '111111111';

                    let maskLength = mask.length;
                    let valueLength = 0;

                    if (this.dirty) {
                        valueLength = this.dirty.toString().length;
                    }

                    let limit = Math.min(valueLength, maskLength);

                    mask = mask.substring(0, limit);
                    mask = mask.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    mask = Util.replace(mask, '1', '#');

                    if (valueLength < maskLength) {
                        mask += '#';
                    }

                    mask =  mask;
                }

                return mask;
            },

            getSuffix() {
                if (this.suffix) {
                    return this.suffix;
                }

                if (this.type == 'percent') {
                    return '%';
                }

                return '';
            },

            getPrefix() {
                if (this.prefix) {
                    return this.prefix;
                }

                if (this.type == 'money') {
                    return '$';
                }

                return '';
            },

            style() {
                let style = {};

                if (this.width) {
                    style.width = this.width + 'px';
                }

                return style;
            },

            fieldType() {
                if (this.type == 'password') {
                    return 'password';
                }

                return 'text';
            }
        },

        watch: {

            dirty: {
                immediate: true,

                handler(value) {
                    if (this.type == 'number' || this.type == 'money') {
                        value = parseInt(value);

                        if (!value) {
                            value = 0;
                        }
                    }
                    else if (this.type == 'decimal' || this.type == 'percent') {
                        if (value) {
                            value = value.toString();

                            var decimalPlace = value.indexOf('.');

                            if (decimalPlace == 0) {
                                value = '0.';
                            }
                            else if (decimalPlace >= 1) {
                                var right = value.substring(value.indexOf('.'));
                                value = parseFloat(value).toFixed(Math.min(right.length - 1, 2));

                                if (value.toString().indexOf('.') < 0) {
                                    value = value + '.';
                                }

                                value = parseFloat(value);
                            }
                            else {
                                value = parseInt(value);
                            }
                        }
                    }
                    /*else if (this.type == 'date' && value) {
                        value = new Date(value);
                    }*/
                
                    this.$emit('input', value);
                }
            },

            focused: {
                immediate: true,
                handler: 'updateFocus'
            },

            value: {
                immediate: true,

                handler() {
                    let value = this.initial;

                    if (_.isUndefined(value)) {
                        value = this.value;
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

        focus() {
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
            if (this.type == 'money') {
                e.target.select();
            }
        }
    });
</script>