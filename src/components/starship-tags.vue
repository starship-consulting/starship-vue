<template>
    <label class="starship-tags" :class="{ focused: isFocused }">
        <starship-icon class="help-icon" icon="question-circle" :size="18" :tooltip="help"></starship-icon>
        <span class="label" v-show="label">{{ label }}</span>
        <v-combobox class="tags" v-model="dirty" @focus="focused" @blur="blurred" multiple chips>
            <template v-slot:selection="data">
                <v-chip :selected="data.selected" @input="removeTag(data.item)" close>
                    <label>{{ data.item }}</label>
                </v-chip>
            </template>
        </v-combobox>
    </label>
</template>

<style lang="scss">

    .starship-tags {

        height: 100%;
        width: 100%;
        cursor: text;

        .help-icon {
            position: relative;
            margin-right: 5px;
        }

        .label {
            font-size: 1em;
            font-weight: 500;
        }

        .v-input__slot {
            margin-bottom: 0;
        }

        .tags {
            margin-top: 0;
            padding-top: 0;

            label {
                color: rgb(30, 30, 30);
                font-family: Roboto, sans-serif;
                font-size: 1.1em;
            }

            .v-input__icon--append {
                display: none;
            }

            .v-chip {
                margin: 0;
                margin-right: 10px;
            }

            .v-input__slot {

                &:before, &:after {
                    display: none;
                }
            }
        }

        input {
            color: rgb(80, 80, 80);
            font-family: Roboto, sans-serif;
            font-size: 1.2em;
        }
    }

</style>

<script>
    import _ from 'underscore';
    import moment from 'moment';
    import { Component, Util } from 'starship';
    
    export default Component('starship-tags', {

        props: {
            value: {
                type: [Array, String]
            }
        },

        properties: {
            $label: '',
            $selectWhenFocused: false,
            $hoverDetail: false,
            $help: 'Tags are words you can use to describe things.  Press enter after typing each tag to add it.',
            isFocused: false,
            dirty: []
        },

        watch: {

            dirty: {
                immediate: true,

                handler(value) {
                    this.$emit('input', value);
                }
            },

            value: {
                immediate: true,

                handler(value) {
                    
                    if (_.isString(value)) {
                        this.dirty = [value];
                        return;
                    }
                    
                    if (this.value != null) {
                        this.dirty = this.value;
                    }
                    else {
                        this.dirty = [];
                    }
                }
            }
        },

        ready() {
        },

        focus() {
            this.$refs.input.focus();
        },

        removeTag(item) {
            this.dirty.splice(this.dirty.indexOf(item), 1);
            this.dirty = [...this.dirty];
        },

        focused(e) {
            this.isFocused = true;
            this.$emit('focus', e, this);
        },

        blurred(e) {
            this.isFocused = false;
            this.$emit('blur', e);
        }
    });
</script>