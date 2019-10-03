<template>
    <div class="starship-entity-editor fill-height">

        <grid-layout :class="{ editing: editing }" :isDraggable="editing" :isResizable="editing" :layout.sync="fields" :col-num="4" :row-height="60" :vertical-compact="true" :margin="[16, 10]" :use-css-transforms="true">
            <grid-item v-for="field in fields" :key="field.i" :x="field.x" :y="field.y" :w="field.w" :h="field.h" :i="field.i" :maxH="1" drag-ignore-from=".field-edit-icon">
                <div v-if="editing" class="editor-overlay">
                    <starship-icon class="edit-field" :size="18" @click="edit(field)" icon="edit"></starship-icon>
                    <starship-icon class="delete-field" :size="18" color="rgba(150, 0, 0, 0.8)" @click="invalidate(field)" icon="times"></starship-icon>
                </div>
                <component class="unselectable" :is="field.component" v-bind="field.binding" v-model="value[field.i]"></component>
            </grid-item>
        </grid-layout>

        <starship-dialog ref="editor" class="field-dialog" title="Edit Field" :width="300" @closed="closed" modal closeable>

            <v-container class="no-padding" fluid grid-list-lg>
                <v-layout class="ma-1" column fill-height>
                    <v-flex>
                        <starship-text label="Label" v-model="model.attributes.label"></starship-text>
                    </v-flex>
                    <v-flex>
                        <starship-text label="Name" v-model="model.i" readonly disabled></starship-text>
                    </v-flex>
                    <v-flex>
                        <starship-dropdown label="Type" :items="fieldTypes" v-model="model.type"></starship-dropdown>
                    </v-flex>
                    <v-flex v-show="model.type == 'dropdown'">
                        <starship-dropdown label="Source" :items="types" v-model="model.attributes.datasource"></starship-dropdown>
                    </v-flex>
                    <v-flex v-show="model.type == 'dropdown' && model.attributes.datasource">
                        <starship-dropdown label="Field" :items="typeFields" v-model="model.attributes.itemText"></starship-dropdown>
                    </v-flex>
                </v-layout>
            </v-container>

            <template slot="actions">

                <v-spacer></v-spacer>

                <v-btn flat @click="close">
                    <span style="color: rgb(100, 100, 100);">Cancel</span>
                </v-btn>

                <v-btn @click="save" flat>Save</v-btn>
            </template>

        </starship-dialog>
    </div>
</template>

<style lang="scss">
    .starship-entity-editor {

        .vue-grid-layout {
            width: 100%;
            height: 100%;
        }

        .vue-grid-layout.editing {

            .vue-grid-item {

                .edit-field {
                    opacity: 0;
                    transition: opacity 0.1s;
                    cursor: pointer;
                    position: relative;
                    left: 5px;
                    top: 1px;

                    &:hover {
                        opacity: 1 !important;
                    }
                }

                .delete-field {
                    opacity: 0;
                    transition: opacity 0.1s;
                    cursor: pointer;
                    position: absolute;
                    right: 5px;
                    top: 1px;

                    &:hover {
                        opacity: 1 !important;
                    }
                }

                label {
                    position: relative;
                    left: 0;
                    transition: left 0.25s;
                }

                &:hover {
                    label {
                        left: 30px;
                    }

                    .edit-field, .delete-field {
                        opacity: 0.7;
                    }
                }
            }
        }

        .vue-resizable-handle {
            right: -8px !important;
            bottom: -7px !important;
            z-index: 5;
        }

        .editor-overlay {
            width: calc(100% + 10px);
            height: calc(100% + 6px);
            left: -5px;
            top: -2px;
            z-index: 1;
            position: absolute;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.04);

            &:hover {
                background-color: rgba(0, 0, 0, 0.06);
            }
        }
    }
</style>

<script>
    import VueGridLayout from 'vue-grid-layout';
    import _ from 'underscore';
    import { Component, Data, DataProvider, Formatters, Repository, Entities, Util } from 'starship';

    let Field = Entities.Field;
    
    export default Component('starship-entity-editor', {

        components: {
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem
        },

        properties: {
            $fields: [],
            $value: null,
            field: null,
            fieldTypes: Data.fieldTypes,
            typeFields: [],
            editing: false,
            types: [],
            model: new Field(),

            label() {
                return this.model.attributes.label;
            },

            datasource() {
                return this.model.attributes.datasource;
            }
        },

        watch: {

            field: {
                immediate: true,

                handler() {
                    if (this.field) {
                        this.model = JSON.parse(JSON.stringify(this.field));
                    }
                }
            },

            label() {
                this.model.i = Formatters.camelcase(this.model.attributes.label);
            },

            async datasource() {

                this.typeFields = [];

                if (this.datasource) {
                    this.typeFields = await Repository.getFields(this.datasource, true);
                }
            }
        },

        async ready() {
            this.types = await DataProvider.getTypes();
        },

        edit(field) {
            this.field = field;
            this.$refs.editor.show();
        },

        async invalidate(field) {
            await this.$starship.load(async () => {
                await field.delete();
                this.$emit('deleted', field);
            });
        },

        toggleEditing() {
            this.editing = !this.editing;
        },

        close() {
            this.$refs.editor.close();
        },

        closed() {
            this.field = null;
        },

        async save() {
            await this.$starship.load(async () => {
                _.extend(this.field, this.model);
                this.$emit('saved', this.field);
                this.close();
            });
        }
    });
</script>