<template>
    <div class="starship-dropdown">
        <label>{{label}}</label>
        <div class="starship-field">
            <v-select :class="{ simple: simple }" ref="field" v-model="dirty" :items="getItems" :menu-props="{ lazy: true }" :placeholder="placeholder" :outline="!simple" :item-text="itemText" :item-value="itemValue" :clearable="clearable" @change="changed" :disabled="disabled" light dense></v-select> <!--  @blur="blurred" -->
        </div>
    </div>
</template>

<style lang="scss">
    .starship-dropdown {

        box-sizing: border-box;

        .v-input__control,.v-input__slot {
            height: 38px;
        }

        .v-text-field__details {
            display: none;
        }

        input:not([placeholder]) {
            width: 8px;
        }

        input[placeholder] {
            padding-left: 10px;
        }

        .v-input__slot {
            min-width: 120px;
        }

        &:focus, input, input:focus {
            outline: none !important;
            border: none !important;
            text-shadow: 0 0 0 transparent !important;
            color: transparent !important;
            caret-color: transparent;
        }

        .v-select.simple {
            font-size: 12px;
            padding-top: 0;

            &:not(.v-input--is-dirty) input::placeholder {
                color: rgb(0, 0, 0) !important;
            }

            .v-input__slot {
                height: 20px;
            }
        }

        .v-select:not(.simple) {

            background-color: var(--input-color);

            .v-select__selections {
                padding-top: 0 !important;
                overflow: hidden;
            }

            .v-select__selection {
                white-space: nowrap;
                font-size: 0.9rem;
                font-weight: normal;
                left: 10px;
                position: relative;
            }

            .v-input__append-inner {
                margin: 0 !important;
                padding: 0 !important;
            }

            .v-input__icon--clear {
                position: relative;
                left: 15px;
                
                .v-icon {
                    color: rgba(0, 0, 0, 0.3);
                }
            }

            .v-input__icon--append {
                position: relative;
                top: 3px;
                //left: 10px;
            }

            .v-icon.primary--text {
                color: var(--v-icon-base) !important;
            }

            .v-input__control:hover:before {
                background-color: var(--v-button-text-base);
            }

            /* Glowing hover effect */
            .v-input__control:before {
                border-radius: inherit;
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                opacity: 0.12;
                -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
                transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
                width: 100%;
            }

            .v-input__slot {
                min-height: var(--input-height);

                cursor: pointer !important;
                margin-bottom: 0;
                border: solid 1px var(--divider-color);
                padding-left: 0;
                padding-right: 0;

                &:hover {
                    border: solid 1px var(--focus-color) !important;
                }
            }
        }
    }
    
</style>

<script>
    import _ from 'underscore';
    import { Component, Repository, Formatters, Util } from 'starship';
    
    export default Component('starship-dropdown', {

        props: {

            value: {
                type: [String, Number]
            }
        },

        properties: {
            
            $label: '',
            $items: [],
            $placeholder: '',
            $simple: false,
            $clearable: false,
            $itemText: 'name',
            $itemValue: 'id',
            $disabled: false,
            $allowEmpty: false,
            $datasource: '',
            dirty: '',
            data: [],

            getItems() {

                if (this.data && this.data.length) {
                    return this.data;
                }

                if (!this.allowEmpty) {
                    return this.items;
                }

                let emptyValue = '';

                if (this.itemText || this.itemValue) {
                    emptyValue = {};
                    emptyValue[this.itemText] = this.placeholder || '';
                    emptyValue[this.itemValue] = '';
                }

                return [emptyValue].concat(this.items);
            },

            hasObjects() {
                if (this.items && this.items.length) {
                    return _.isObject(this.items[0]);
                }

                return false;
            }
        },

        watch: {

            value: {

                immediate: true,

                handler() {
                    
                    if (!this.value) {
                        this.dirty = '';
                        return;
                    }

                    /*if (this.hasObjects) {
                        if (this.itemText || this.itemValue) {
                            this.dirty = this.value;
                            return;
                        }
                    }*/

                    let match = false;

                    this.items.each(item => {
                        let compare = item;

                        if (!_.isString(compare)) {
                            compare = compare[this.itemValue];

                            if (compare) {
                                compare = compare.toString();
                            }
                        }
                        
                        let value = this.value;

                        if (Util.hasValue(value)) {
                            value = value.toString().toLowerCase();
                        }
                        
                        if (compare && compare.toLowerCase() == value) {
                            this.dirty = compare;
                            match = true;
                        }
                    });

                    if (!match) {
                        this.dirty = this.value;
                    }
                }
            },

            items: {

                handler() {

                    /*if (this.hasObjects) {
                        if (this.itemText || this.itemValue) {
                            this.dirty = this.value;
                            return;
                        }
                    }*/

                    this.items.each(item => {

                        let compare = item;

                        if (!_.isString(compare)) {
                            compare = compare[this.itemValue];

                            if (compare) {
                                compare = compare.toString();
                            }
                        }

                        let value = this.value;

                        if (Util.hasValue(value)) {
                            value = value.toString().toLowerCase();
                        }

                        if (compare && compare.toLowerCase() == value) {
                            this.dirty = compare;
                        }
                    });
                }
            },

            dirty: {
                handler() {

                    if (this.dirty != this.value) {
                        this.$emit('input', this.dirty);
                    }
                }
            }
        },

        changed(e) {
            this.$emit('change', e);
        },

        blurred() {
            this.$refs.field.blur();
        }
    });
</script>