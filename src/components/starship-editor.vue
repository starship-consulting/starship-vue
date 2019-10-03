<template>
    <v-container class="no-padding starship-editor" fluid grid-list-lg>
        <v-layout wrap :row="layout == 'row'" :column="layout == 'column'">
            <template v-for="(item, key) in value">
                <template v-if="!getSchema[key].hidden">
                    <v-flex shrink :xs4="columns == 3" :xs6="columns == 2" :xs12="columns == 1">
                        <label v-if="getSchema[key].type != 'object'">{{ key | camelcaseWithSpaces }}</label>

                        <template v-if="getSchema[key].type == 'color'">
                            <verte :style="{ 'background-color': value[key] }" v-model="value[key]" model="rgb" picker="square"></verte>
                        </template>
                        <template v-else-if="getSchema[key].type == 'image'">
                            <starship-image v-model="value[key]"></starship-image>
                        </template>
                        <template v-else-if="getSchema[key].type == 'boolean'">
                            <starship-checkbox v-model="value[key]"></starship-checkbox>
                        </template>
                        <template v-else-if="getSchema[key].type == 'icon'">
                            <starship-icon-picker v-model="value[key]"></starship-icon-picker>
                        </template>
                        <template v-else-if="getSchema[key].type == 'object'">
                            <starship-editor :value="value[key]" :columns="4"></starship-editor>
                        </template>
                        <template v-else>
                            <starship-text v-model="value[key]" :readonly="getSchema[key].readonly"></starship-text>
                        </template>
                    </v-flex>
                </template>
            </template>
        </v-layout>
    </v-container>
</template>

<style lang="scss">
    .starship-editor {

        height: 100%;

        .verte {
            border: solid 1px black;

            .verte__guide {
                width: 100%;
            }

            .verte__menu {
                z-index: 9999;
            }
        }
    }
</style>

<script>
    import _ from 'underscore';
    import { Component } from 'starship';

    export default Component('starship-editor', {

        props: {
            value: {
                type: [Object, Array]
            }
        },

        properties: {

            $schema: null,
            $layout: 'row',
            $columns: 1,

            getSchema() {

                let schema = this.schema || {};

                if (this.value.getSchema) {
                    schema = this.value.getSchema();

                    if (schema.id) {
                        schema.id.hidden = true;
                    }

                    return schema;
                }
                
                if (this.value) {
                    if (_.isObject(this.value)) {

                        for (var field in this.value) {

                            if (schema[field]) {
                                continue;
                            }

                            let fieldValue = this.value[field];

                            if (schema.$value) {
                                schema[field] = { type: schema.$value };
                            }
                            else {
                                schema[field] = {};
                                
                                if (field == 'id') {
                                    schema[field] = { type: 'id', readonly: true };
                                }
                                else if (field == 'owner') {
                                    schema[field] = { type: 'owner' };
                                }
                                else if (_.isBoolean(fieldValue)) {
                                    schema[field] = { type: 'boolean' };
                                }
                                else if (_.isObject(fieldValue)) {
                                    schema[field] = { type: 'object' };
                                }
                                else if (_.isArray(fieldValue)) {
                                    schema[field] = { type: 'array' };
                                }
                                else if (_.isNumber(fieldValue)) {
                                    schema[field] = { type: 'number' };
                                }
                                else {
                                    schema[field] = { type: 'string' };
                                }

                                if (field.indexOf('_') == 0) {
                                    schema[field].hidden = true;
                                }

                                if (field == 'icon') {
                                    schema[field].type = 'icon';
                                }
                            }

                            //let fieldValue = this.value[field];
                            
                            //if (_.isBoolean(fieldValue)) {
                            //    schema[field] = 'boolean';
                            //}
                        }
                    }
                }
                
                return schema;
            }
        }
    });
</script>