<template>
    <!-- 'closeOnClick': true, 'closeOnContentClick': false, 'openOnClick': false,  -->
    <v-autocomplete class="starship-autocomplete" ref="autocomplete" :menu-props="{ 'contentClass': 'starship-autocomplete-menu', 'maxHeight': 300 }"
                    v-model="dirty" :items="options" :search-input.sync="search" item-text="name" :item-value="itemValue" :label="label" :multiple="multiple" :small-chips="chips" :deletable-chips="chips" :return-object="!multiple" :placeholder="placeholder" :filter="filter" :solo="solo" :flat="flat"
                    @blur="blurred"
                    clearable hide-no-data hide-selected single-line dense>

        <template slot="item" slot-scope="data">
            <!--
            <template v-if="data.item.type == 'group'">
                <v-list-tile-content class="starship-autocomplete">
                    <v-list-tile-title><label class="item-group">{{ data.item[titleField] }}</label></v-list-tile-title>
                </v-list-tile-content>
            </template>
            <template v-else>
                <v-list-tile-avatar>
                    <img v-if="data.item[imageField]" :src="data.item[imageField]" />
                    <starship-icon v-if="data.item[iconField]" :icon="data.item[iconField]"></starship-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title style="height: 22px;" v-html="data.item[titleField]"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="data.item[subtitleField]"></v-list-tile-sub-title>
                </v-list-tile-content>
            </template>
            -->

            <v-list-tile-avatar>
                <img v-if="data.item[imageField]" :src="data.item[imageField]" />
                <starship-icon v-if="data.item[iconField]" :icon="data.item[iconField]"></starship-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title style="height: 22px;" v-html="data.item[titleField]"></v-list-tile-title>
                <v-list-tile-sub-title v-html="data.item[subtitleField]"></v-list-tile-sub-title>
            </v-list-tile-content>
        </template>
    </v-autocomplete>
</template>

<style lang="scss">

    .starship-autocomplete {

        //height: 60px;
        margin-top: 10px;
        padding-top: 2px;

        .v-chip {
            margin: 0;
            padding: 0;
        }

        .item-group {
            font-size: 1em;
            cursor: pointer;
            font-weight: bold;
        }

        input {
            color: var(--text-color) !important;
        }

        label, input {
            font-size: 1.15em !important;
        }
    }

    .starship-autocomplete-menu {

        .v-list__tile {
            height: 46px !important;
        }

        .v-list__tile__title {
            height: 18px;
        }
    }
</style>

<script>
    import _ from 'underscore';
    import { Component, Util, Repository } from 'starship';

    export default Component('starship-autocomplete', {

        props: {

            value: {
                type: [String, Object, Array]
            }
        },

        properties: {

            $label: '',
            $itemValue: 'id',
            $items: [],
            $text: '',

            $titleField: 'title',
            $subtitleField: 'subtitle',
            $imageField: 'image',
            $iconField: 'icon',

            $placeholder: '',
            $multiple: false,
            $chips: false,
            $flat: false,
            $solo: false,
            $requireInput: false,

            search: null,
            
            dirty: [],

            closing: false,

            filter() {

                return (item, queryText, itemText) => {

                    if (!queryText || !queryText.length) {
                        return false;
                    }
                    
                    return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1;
                };
            },

            options() {
                if (this.requireInput) {
                    if (!this.search || !this.search.length) {
                        return [];
                    }
                }

                return this.items;
            }
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
        
        remove(item) {
            const index = this.dirty.indexOf(item.name);

            if (index >= 0) {
                this.dirty.splice(index, 1);
            }
        },

        blurred() {
            if (!this.closing) {
                this.closing = true;
                this.$refs.autocomplete.blur();

                setTimeout(() => {
                    this.closing = false;
                }, 300);
            }
        },

        clear() {
            this.search = '';
        }
    });
</script>