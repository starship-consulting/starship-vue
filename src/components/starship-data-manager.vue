<template>
    <div class="starship-data-manager layout column">

        <v-layout class="mt-3" row shrink>
            <starship-dropdown class="ml-2" v-model="type" :items="types" placeholder="Choose type..."></starship-dropdown>

            <!--
            <prompt-button class="ml-2" icon="database" text="New Type" label="Name" @save="addType"></prompt-button>
            -->
        </v-layout>

        <v-divider class="my-3"></v-divider>

        <!--
        <toolbar-button v-show="type && superadmin" icon="trash" tooltip="Delete Table" @click="deleteTable"></toolbar-button>
        -->

        <div v-show="type" class="layout row flex shrink ml-2">

            <starship-button class="mr-2" :disabled="!dirty.length" icon="save" @click="save">Save</starship-button>

            <!--
            <starship-button class="mr-2" background-color="var(--delete-color)" v-if="selections.length" icon="trash-alt" @click="invalidate">Delete</starship-button>

            <starship-button v-if="type" icon="file-signature" :text="'Add New ' + type" @click="create"></starship-button>

            <prompt-button class="ml-2" icon="th" text="Add Column" label="Column Name" @save="addColumn">
                <v-icon class="mr-1" style="font-size: 12px">fa-plus</v-icon>
            </prompt-button>
            -->
        </div>

        <div class="layout row flex shrink mt-3" v-show="type" style="overflow: auto;">
            <starship-table ref="grid" :data="data" :columns="columns"></starship-table>
            <!--
             :search="search" @changed="edited" @selected="selected" @unselected="unselected" row-editing row-checkboxes
            -->
        </div>

        <starship-importer :types="types" allow-pick-type></starship-importer>
    </div>
</template>

<style lang="scss">

    /*
    .entity-id {
        //font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
    }

    .entity-editor {
        max-height: 600px;
    }

    .v-progress-linear {
        padding: 0;
        margin: 0;
    }

    .save-indicator {
        opacity: 0;
    }
    */

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .starship-data-manager {
        background-color: var(--background);

        .starship-table {
            border-top: solid 1px var(--divider-color);
        }
    }
</style>

<script>
    import _ from 'underscore';
    import { Component, Page, Util, Data, Repository, User, DataProvider, Formatters } from 'starship';

    export default Component('starship-data-manager', {
        
        properties: {

            lastSaved: null,
            saving: false,
            type: '',
            search: '',
            types: [''],
            data: [],
            dirty: [],
            selections: [],

            typeName() {
                if (!this.type) {
                    return '';
                }

                return Util.replace(this.type.toLowerCase(), ' ', '');
            },

            columns() {

                let columns = {};
                let type = Repository.get(this.typeName).type;
                let schema = new type().getSchema();

                for (var field in schema) {
                    if (this.skipField(field, schema[field])) {
                        continue;
                    }

                    columns[field] = Formatters.camelcaseWithSpaces(field);
                }

                this.data.each((item) => {
                    for (var field in item) {
                        if (this.skipField(field, schema[field])) {
                            continue;
                        }

                        if (!columns[field]) {
                            columns[field] = Formatters.camelcaseWithSpaces(field);
                        }
                    }
                });

                return _.map(columns, (name, field) => {

                    let columnDefinition = {
                        name: field,
                        title: name
                    };

                    if (schema[field]) {
                        columnDefinition.type = schema[field].type;
                    }
                            
                    return columnDefinition;
                });
            }
        },

        watch: {

            type: {
                immediate: true,

                async handler() {
                    this.data = [];
                    this.selections = [];

                    if (this.typeName) {
                        this.data = await Repository.get(this.typeName).all();
                    }
                }
            }
        },

        skipField(field, schema) {
            if (field.indexOf('_') == 0) {
                return true;
            }

            if (field == 'id' || field == '$type' || field == 'validUntil' || field == 'owner') {
                return true;
            }

            if (schema) {
                if (schema.type == 'object' || schema.type == 'array') {
                    return true;
                }
            }

            return false;
        },

        async ready() {

            let types = await DataProvider.getTypes();
            
            this.types = types.map((each) => {
                return Formatters.capitalize(each);
            }).sort();
        },

        async save() {
            await this.$starship.load(async () => {
                let results = await DataProvider.saveAll(this.dirty);
                this.dirty = [];
            });
        },

        async deleteTable() {
            return;

            if (!this.type) {
                return;
            }

            await DataProvider.deleteCollection(this.typeName);

            let type = this.typeName;

            this.typeName = '';

            this.types.remove(type);
        },

        async create() {
            let type = Repository.get(this.typeName).type
            let instance = new type();
            
            await this.$nextTick();

            this.$refs.grid.add(instance);
        },

        close() {
            this.edit(null);
        },

        async addType(name) {
            let typeName = Formatters.capitalize(name.toLowerCase());

            // Pre-load types
            await Repository.get(typeName).all();

            this.types.push(typeName);
            this.typeName = typeName;
        },

        async edited(entity, oldValue, newValue, field) {
            if (oldValue != newValue) {
                let existing = _.find(this.dirty, (each) => each == entity);

                if (!existing) {
                    this.dirty.push(entity);
                }

                /*this.lastSaved = new Date();
                await this.$nextTick();
                this.saving = true;
                await entity.save();
                this.saving = false;*/
            }
        },

        addColumn(name) {
            if (!name || !name.length) {
                return;
            }

            if (name.indexOf('$') >= 0 || name.indexOf('_') >= 0) {
                return;
            }
            
            this.columns.push({
                field: Formatters.camelcaseWithSpaces(name),
                headerName: name
            });
        },

        selected(item) {
            this.selections.push(item.id);
        },

        unselected(item) {
            this.selections.remove(item.id);
        },

        async invalidate() {

            if (confirm('Are you sure you want to delete ' + this.selections.length + ' row(s)?')) {

                await this.$starship.load(async () => {

                    await DataProvider.deleteAll(this.selections);

                    this.data = _.filter(this.data, (each) => {
                        return !this.selections.includes(each.id);
                    });

                    this.$starship.notification('Deletion successful.');
                });
            }
        }
    });
</script>