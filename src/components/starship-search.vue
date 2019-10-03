<template>
    <starship-autocomplete class="starship-search" placeholder="Search" ref="field" :label="label" :items="items" v-model="dirty" title-field="name" item-text="name" item-value="name" image-field="photo" :solo="solo" :flat="flat" require-input></starship-autocomplete>
</template>

<style lang="scss">

    .starship-search {

        //height: 60px;
        padding-top: 2px;
        margin-top: 0;
        //padding-top: 20px;

        .v-chip {
            margin: 0;
            padding: 0;
        }

        .item-group {
            //font-size: 14px;
            cursor: pointer;
            font-weight: bold;
        }

        .v-input__append-inner {
            .v-input__icon {
                display: none;
            }
        }
    }
</style>

<script>
    import _ from 'underscore';
    import { Component, Util, Repository } from 'starship';

    export default Component('starship-search', {
        
        properties: {

            $label: '',
            $value: null,
            dirty: null,

            $items: [],

            $flat: false,
            $solo: false
        },

        watch: {

            value: {
                immediate: true,

                handler() {
                    this.dirty = this.value;
                }
            },

            dirty() {
                this.$emit('input', this.dirty);
            }
        },

        clear() {
            this.$refs.field.clear();
        },

        blur() {
            this.$refs.field.blur();
        }
    });
</script>