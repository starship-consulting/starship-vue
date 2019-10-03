<template>
    <!-- 'closeOnClick': true, 'closeOnContentClick': false, 'openOnClick': false,  -->
    <v-combobox class="starship-combobox" ref="field" :menu-props="{ 'contentClass': 'starship-autocomplete-menu', 'maxHeight': 300 }"
                v-model="dirty" :items="items" :item-text="itemText" :item-value="itemValue" :label="label" :multiple="multiple" :small-chips="chips" :deletable-chips="chips" :return-object="false" :placeholder="placeholder"
                clearable hide-no-data hide-selected single-line dense>

        <!-- :return-object="!multiple" -->

        <template slot="item" slot-scope="data">
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
        </template>
    </v-combobox>
</template>

<style lang="scss">

    .starship-combobox {

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

    export default Component('starship-combobox', {

        props: {

            value: {
                type: [String, Object, Array]
            }
        },

        properties: {

            $label: '',
            $itemText: 'text',
            $itemValue: 'id',
            $items: [],

            $titleField: 'title',
            $subtitleField: 'subtitle',
            $imageField: 'image',
            $iconField: 'icon',

            $placeholder: '',

            $multiple: false,
            $chips: false,
            
            dirty: [],
            show: false
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

        blur() {
            this.$refs.field.blur();
        }
    });
</script>