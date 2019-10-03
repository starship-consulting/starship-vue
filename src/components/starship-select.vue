<template>
    <label class="starship-select activatable">
        <span class="label" v-show="label">{{ label }}</span>
        <v-select ref="field" v-model="dirty" :items="getItems" :placeholder="placeholder" :item-text="itemText" :item-value="itemValue" :clearable="clearable" @change="changed" :disabled="disabled" :chips="chips" light dense>

        </v-select>
    </label>
</template>

<style lang="scss">

    .starship-select {

        cursor: pointer;
        height: 100%;
        width: 100%;

        .label {
            font-size: 1em;
            font-weight: 500;
        }

        .v-select {
            padding-top: 0;
            margin-top: 0;

            .v-input__slot {
                
                margin-bottom: 0;

                &:before,&:after {
                    display: none;
                }
            }

            .v-select__slot {
                cursor: pointer;
            }

            .v-input__append-inner {
                position: relative;
                top: -12px;
                font-size: 1.5em;
            }

            .v-select__selections {
                height: 29px;
                color: rgb(40, 40, 40);
                font-family: Roboto, sans-serif;
                font-size: 1.2em;
                font-weight: 400;
            }

            input {
                padding-bottom: 0;
                padding-top: 0;
            }
        }
        /*
        width: 100%;

        position: relative;
        z-index: 999;

        .label {
            font-size: 1.1em;
            font-weight: 400;
        }

        .dropdown-menu {
            position: absolute;
            z-index: 1000;
            top: 0px;
            left: 0px;
            padding: .5rem 0;
            min-width: 10rem;
            float: left;
            text-align: left;
            background-clip: padding-box;
            border-radius: .25rem;
            border: 1px solid rgba(0, 0, 0, .15);
            overflow-y: scroll;
            max-height: 100px;

            background-color: white;
            color: #212529;
            transform: translate3d(0px, 46px, 0px);
            will-change: transform;

            .item {
                display: block;
                width: 100%;
                padding: .25rem 1.5rem;
                clear: both;
                font-weight: 400;
                color: #212529;
                text-align: inherit;
                white-space: nowrap;
                background-color: transparent;
                border: 0;
            }
        }
        */
    }
</style>

<script>
    import _ from 'underscore';
    import { Component, Repository } from 'starship';
    
    export default Component('starship-select', {

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
            $itemText: '',
            $chips: false,
            $itemValue: '',
            $disabled: false,
            $allowEmpty: false,
            $datasource: '',
            $selectWhenFocused: false,
            isFocused: false,
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
                    emptyValue[this.itemText] = '';
                    emptyValue[this.itemValue] = '';
                }

                return [emptyValue].concat(this.items);
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

                    if (this.itemText || this.itemValue) {
                        this.dirty = this.value;
                        return;
                    }

                    let match = false;

                    this.items.each(item => {
                        if (item.toLowerCase() == this.value.toLowerCase()) {
                            this.dirty = item;
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
                    
                    if (this.itemText || this.itemValue) {
                        this.dirty = this.value;
                        return;
                    }

                    this.items.each(item => {
                        if (_.isString(this.value)) {
                            if (item.toLowerCase() == this.value.toLowerCase()) {
                                this.dirty = item;
                            }
                        }
                        else {
                            if (item == this.value) {
                                this.dirty = item;
                            }
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

        clicked() {
            if (this.selectWhenFocused) {
                this.focus();
            }
        },

        focus() {
            this.$refs.select.focus();
        },

        focused(e) {
            this.isFocused = true;
            this.$emit('focus', e, this);
        },

        blurred(e) {
            this.isFocused = false;
            this.$emit('blur', e);
        }
    });
</script>