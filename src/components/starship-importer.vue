<template>
    <starship-dialog ref="dialog" title="Data Import" modal closeable>

        <v-layout class="starship-importer ma-3" fill-height column>
                
            <template v-if="allowPickType">
                <v-layout row>
                    <v-spacer></v-spacer>
                    <v-flex shrink>
                        <label>Import Type</label>
                        <starship-dropdown class="mt-2" style="max-width: 188px;" v-model="type" :items="types"></starship-dropdown>
                    </v-flex>
                </v-layout>

                <v-divider class="mt-3 mb-4"></v-divider>
            </template>

            <v-layout v-if="type" column>

                <v-layout class="field-row" v-for="(each, index) in fields" :key="index" row>

                    <v-flex align-self-center md4>
                        <label>{{each.name}}</label>
                    </v-flex>

                    <v-flex align-self-center shrink md1>
                        <starship-icon icon="long-arrow-right"></starship-icon>
                    </v-flex>

                    <v-flex md7>
                        <starship-dropdown style="max-width: 200px;" :items="typeFields" v-model="each.field" allow-empty></starship-dropdown>
                    </v-flex>

                </v-layout>
            </v-layout>
        </v-layout>

        <template slot="actions">
            <v-spacer></v-spacer>
            <v-btn flat @click.native="close">Cancel</v-btn>
            <v-btn flat @click.native="save">Import</v-btn>
        </template>
    </starship-dialog>
</template>

<style lang="scss">
    .starship-importer {

        .field-row {
            min-height: 40px;
        }
    }
</style>

<script>
    import similarity from 'string-similarity';
    import _ from 'underscore';
    import { Component, Formatters, Repository, EntityMapper, DataProvider } from 'starship';

    export default Component('starship-importer', {

        properties: {
            $types: [],
            $type: '',
            $allowPickType: false,
            data: [],
            fields: [],
            typeFields: []
        },

        watch: {

            type: {
                immediate: true,

                async handler() {
                    
                    if (this.type) {
                        await this.updateFields();
                    }
                }
            },

            async fields() {
                await this.updateFields();
            }
        },

        ready() {
            this.$events.on('file-uploaded', (data) => {

                if (!_.isArray(data) || !data.length) {
                    return;
                }

                this.fields = _.map(Object.keys(data[0]), each => {

                    return {
                        name: each,
                        field: ''
                    };
                });
                
                this.data = data;
                this.show();
            });
        },

        async updateFields() {

            this.typeFields = await Repository.getFields(this.type, true);
                        
            _.each(this.fields, (each) => {

                each.field = '';
                        
                let match = similarity.findBestMatch(each.name, this.typeFields).bestMatch;

                if (match.rating >= 0.5) {
                    each.field = match.target;
                }
            });
        },

        show() {
            this.$refs.dialog.show();
        },

        close() {
            this.$refs.dialog.close();
        },

        async save() {

            await this.$starship.load(async () => {

                let mappedFields = _.filter(this.fields, each => {
                    return each.field;
                });

                let entities = _.map(this.data, (item) => {

                    let model = {};

                    _.each(mappedFields, (each) => {
                        model[each.field] = item[each.name];
                    });

                    return model;
                });

                entities = EntityMapper.map(this.type, entities);
                
                await DataProvider.saveAll(entities);

                this.$starship.notification(entities.length + ' records imported successfully.');
            });

            this.close();
        }
    });
</script>