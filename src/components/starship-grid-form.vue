<template>
    <form class="starship-grid-form layout row wrap" :class="{ padded: padded }" autocomplete="off">
        <div class="xs12 field layout flex" :class="getClass(field)" v-for="(field, index) in boundFields" :key="field.name">
            <component class="dynamic-field form-field hide-borders" :is="field.component" v-bind="field.attributes" v-model="field.value"></component>
        </div>
    </form>
</template>

<style lang="scss">

    /* Todo:  Move this somewhere else */
    .dynamic-field {

        opacity: 0.8;

        color: var(--form-label-color);
        background-color: var(--form-background-color);

        &:hover, &.focused {
            opacity: 1;
        }

        &.activatable {
            cursor: pointer;
        }

        &.hidden {
            display: none;
        }
    }

    .starship-grid-form {

        //margin: 20px;

        --form-label-color: rgb(40, 50, 80);
        --form-background-color: rgb(255, 255, 255);
        
        //overflow: hidden;
        position: relative;

        border-top: solid 1px var(--form-border-color);
        border-left: solid 1px var(--form-border-color);

        //border-right: solid 1px var(--border-color);
        
        .field {
            //overflow: hidden;
            //border-bottom: solid 1px var(--form-border-color);
        }

        .starship-input {
            cursor: text;
        }

        .form-field {
            padding-top: 4px;
            padding-left: 12px;
            padding-right: 12px;
            padding-bottom: 2px;

            border-right: solid 1px var(--form-border-color);
            border-bottom: solid 1px var(--form-border-color);
            border-top: solid 1px white;
            border-left: solid 1px white;
        }

        &.padded {
            .form-field {
                padding-top: 6px;
                padding-bottom: 8px;
            }
        }
    }

</style>

<script>
    import _ from 'underscore';
    import { Component, Util, DynamicField } from 'starship';
    
    export default Component('starship-grid-form', {

        properties: {

            $padded: false,
            $responsive: false,
            $fields: [],
            $entity: null,

            boundFields() {

                if (this.entity && this.fields && this.fields.length) {
                    
                    return this.fields.map(field => {
                        let dynamicField = new DynamicField(field);
                        dynamicField.value = Util.get(this.entity, field.name) || dynamicField.getValue();
                        return dynamicField;
                    });
                }

                return [];
            }
        },
        
        ready() {
            this.$events.on('save', this.commit);
        },

        commit() {
            this.boundFields.each(field => {

                if (!field.active) {
                    if (Util.has(this.entity, field.name)) {
                        Util.delete(this.entity, field.name);
                    }
                }
                else {
                    Util.set(this.entity, field.name, field.getValue());
                }
            });
        },
        
        getClass(field) {

            let classes = {};

            if (!field.active) {
                classes['hidden'] = true;
            }

            let size = field.size;

            if (!size) {
                size = 4;
            }
            
            if (this.responsive) {
                classes['md' + (field.size * 3)] = true;
            }
            else {
                classes['sm' + (field.size * 3)] = true;
            }
            
            return classes;
        },

        getChanges() {
            
            let changeset = [];

            this.boundFields.where(field => field.active).each(field => {
                
                let oldValue = Util.get(this.entity, field.name);
                let newValue = field.getValue();
                
                if (!oldValue && !newValue) {
                    return;
                }
                
                if (newValue !== oldValue) {

                    changeset.push({
                        name: field.name,
                        label: field.label,
                        oldValue: oldValue,
                        newValue: newValue
                    });
                }
            });

            return changeset;
        }
    });
</script>