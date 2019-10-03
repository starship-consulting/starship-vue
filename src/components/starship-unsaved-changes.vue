<template>
    <starship-dialog ref="dialog" title="Unsaved Changes" modal closeable>

        <div class="starship-unsaved-changes ma-3">
            <div class="mb-2">Are you sure you want to leave this page without saving?</div>
            <!--
            <div v-for="change in changes">
                <div class="field">{{ change.label | capitalize(true) }} changed from '{{ change.oldValue }}' to '{{ change.newValue }}'.</div>
            </div>
            -->
        </div>

        <template slot="actions">
            <v-spacer></v-spacer>
            <starship-button text="Leave this page" @click="leave" flat></starship-button>
            <starship-button text="Stay on this page" @click="close"></starship-button>
        </template>
    </starship-dialog>
</template>

<style lang="scss">
    .starship-unsaved-changes {

        .field {
            margin-left: 15px;
            font-size: 14px;
        }
    }
</style>

<script>
    import _ from 'underscore';
    import { Component, Formatters, ChangeTracker } from 'starship';

    export default Component('starship-unsaved-changes', {

        properties: {

            editing: null,

            tracker: null,

            path: '',

            changes: []
        },

        ready() {

            this.$events.on('editing.started', (context) => {
                this.editing = context.entity;

                if (this.editing) {
                    this.tracker = context.changetracker || new ChangeTracker(this.editing);
                }
            });

            this.$events.on('editing.stopped', this.stopTracking);

            this.$events.on('navigate.before', (to, from, cancel) => {

                if (this.editing && this.tracker) {

                    this.changes = this.tracker.getChanges(this.editing).where(change => {
                        
                        if (!this.isValidChange(change.oldValue) || !this.isValidChange(change.newValue)) {
                            return false;
                        }

                        return true;
                    });

                    if (this.changes.length) {
                        this.path = to.path;
                        this.show();
                        cancel();
                    }
                    else {
                        this.stopTracking();
                    }
                }
            });
        },

        isValidChange(value) {
            
            if (value && (_.isObject(value) || _.isFunction(value) || _.isArray(value))) {
                return false;
            }

            return true;
        },

        stopTracking() {
            this.path = '';
            this.editing = null;
            this.tracker = null;
            this.changes = [];
        },

        show() {
            this.$refs.dialog.show();
        },

        close() {
            this.$refs.dialog.close();
        },

        leave() {
            let path = this.path;

            this.$events.emit('editing.stopped');
            this.close();
            this.$router.push(path);
        }
    });
</script>