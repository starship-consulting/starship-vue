<template>
    <label class="starship-input layout column" :class="{ focused: isFocused, rtl: rtl }">
        <span class="label" v-show="label">{{ label }}</span>
        <div class="content layout row grow">
            <span v-if="autoExpand" class="measurement" ref="measurement">{{ dirty }}</span>
            <div class="flex shrink prefix">{{ getPrefix }}</div>
            <slot name="prepend"></slot>
            <input class="flex" ref="input" :style="inputStyles" type="text" v-model="dirty" @focus="focused" @blur="blurred" @input="onInput" browser-autocomplete="disabled" autocomplete="starship-input" spellcheck="false" />
            <div class="flex shrink suffix">{{ getSuffix }}</div>
            <slot name="append"></slot>
        </div>
    </label>
</template>

<style lang="scss">

    .starship-input {

        min-height: 38px;
        height: 100%;
        width: 100%;

        &.field .content {
            border: solid 1px var(--border-color);
            border-radius: 4px;
            padding-left: 8px;
            margin-top: 2px;

            &:hover {
                border: solid 1px var(--focus-color);
            }
        }

        &.focused {
            &.field .content {
                box-shadow: 0 0 5px rgba(167, 203, 226, 1);
            }
        }

        .label {
            font-size: 1em;
            font-weight: 500;
            min-height: 16px;
        }

        .prefix, .suffix, .measurement, input {
            color: rgb(40, 40, 40);
            font-family: Roboto, sans-serif;
            font-weight: 400;
            font-size: 1.2em;
            //padding-top: 5px;
        }

        input {
            width: 100%;
        }

        &.rtl {
            input {
                text-align: right;
                //direction: rtl;
            }
        }

        .measurement {
            position: absolute;
            left: -10000px;
            top: -10000px;
        }
    }

</style>

<script>
    import _ from 'underscore';
    import moment from 'moment';
    import { Component, Util, Formatters } from 'starship';
    
    export default Component('starship-input', {

        props: {
            value: {
                type: [Number, String]
            }
        },

        properties: {
            $label: '',
            $selectWhenFocused: false,
            $hoverDetail: false,
            $type: 'text',
            $prefix: '',
            $suffix: '',
            $mask: '',
            $rtl: false,
            $autoExpand: false,
            width: 0,
            isFocused: false,
            internalValue: '',

            getPrefix() {
                if (this.prefix) {
                    return this.prefix;
                }

                if (this.type == 'money') {
                    //return '$';
                }

                return '';
            },

            getSuffix() {
                if (this.suffix) {
                    return this.suffix;
                }

                if (this.type == 'percent') {
                    //return '%';
                }

                return '';
            },

            inputStyles() {
                
                if (!this.autoExpand || !this.width) {
                    return {};
                }
                
                return {
                    width: this.width + 'px'
                };
            }
        },

        computed: {

            dirty: {

                get: function () {
                    
                    if (!this.isFocused) {
                        if (this.type == 'money') {
                            return '$' + this.internalValue;
                        }

                        if (this.type == 'percent') {
                            return this.internalValue + '%';
                        }

                        if (this.type == 'phone') {
                            return Formatters.phone(this.internalValue);
                        }
                    }

                    return this.internalValue;
                },

                set: function (value) {
                    this.internalValue = value;

                    let formattedValue = value;

                    if (this.type == 'money') {
                        formattedValue = parseFloat(formattedValue.replace(/[^\d.-]/g, '')) || 0;
                    }

                    this.$emit('input', formattedValue);
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

        async ready() {
            await this.onInput();
        },

        async onInput() {

            await this.$nextTick();

            if (this.autoExpand && this.$refs.measurement) {
                this.width = this.$refs.measurement.offsetWidth;
            }
        },

        focus() {
            this.$refs.input.focus();

            this.onInput();
        },

        async focused(e) {
            this.isFocused = true;

            if (this.selectWhenFocused) {
                await this.$nextTick();
                this.$refs.input.setSelectionRange(0, this.dirty.length);
            }

            this.$emit('focus', e, this);
        },

        blurred(e) {
            this.isFocused = false;
            this.$emit('blur', e);
        }
    });
</script>