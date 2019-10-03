<template>
    <starship-dialog ref="dialog" :title="title" modal closeable>

        <starship-entity-editor v-model="entity" :fields="fields"></starship-entity-editor>

        <template slot="actions">
            <starship-icon icon="edit" @click="addField"></starship-icon>
            <v-spacer></v-spacer>
            <v-btn flat @click.native="close">Cancel</v-btn>
            <v-btn flat @click.native="save">Save</v-btn>
        </template>
    </starship-dialog>
</template>

<style lang="scss">
</style>

<script>
    import { Component, Formatters } from 'starship';

    export default Component('starship-editor-dialog', {

        properties: {

            entity: null,
            fields: [],

            title() {

                if (!this.entity) {
                    return '';
                }

                return 'Edit ' + Formatters.capitalize(this.entity.$type);
            }
        },

        ready() {
            this.$events.on('entity.edit', (entity) => {
                this.entity = entity;
                this.show();
            });
        },

        show() {
            this.$refs.dialog.show();
        },

        close() {
            this.$refs.dialog.close();
        },

        addField() {

        }
    });
</script>