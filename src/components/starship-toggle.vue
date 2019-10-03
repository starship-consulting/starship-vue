<template>
    <label class="starship-toggle activatable layout column">
        <span v-show="mode == 'checkbox' && label" class="label">{{ label }}</span>
        <div class="checkbox-container layout row">
            <div v-show="mode != 'checkbox'" class="flex shrink label mr-2">{{ getLabel }}</div>
            <v-checkbox v-if="mode == 'checkbox'" v-model="model" @click.stop="$emit('click', $event)" @change="$emit('change', $event, model)" :ripple="false"></v-checkbox>
            <v-switch v-else class="flex shrink" v-model="model" @click.stop="$emit('click', $event)" @change="$emit('change', $event, model)" :ripple="false"></v-switch>
        </div>
    </label>
</template>

<style lang="scss">

    .starship-toggle {

        height: 100%;
        width: 100%;
        align-items: center;

        .label {
            font-size: 1em;
            font-weight: 500;
        }

        .checkbox-container {
            align-items: center;
        }

        .v-input--selection-controls {
            margin-top: 0px !important;
        }

        .v-input--selection-controls__input i {
            position: relative;
            top: 1px;
        }

        i {
            font-size: 2em;
        }

        label {
            color: rgb(80, 80, 80) !important;
            font-weight: 400;
        }

        .v-input__slot {
            margin-bottom: 0 !important;
        }

        .v-input--checkbox {
            padding-top: 0;
        }
    }
</style>

<script>
    import { Component, Mixins } from 'starship';

    export default Component('starship-toggle', {

        mixins: [Mixins.ValueModel],

        properties: {

            $label: '',
            $labelOn: '',
            $labelOff: '',

            $size: 30,

            // checkbox or switch
            $mode: 'checkbox',

            getLabel() {
                
                if (this.labelOn && this.value) {
                    return this.labelOn;
                }
                else if (this.labelOff && !this.value) {
                    return this.labelOff;
                }

                return this.label;
            }
        }
    });
</script>