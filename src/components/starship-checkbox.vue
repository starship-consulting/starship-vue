<template>
    <div class="starship-checkbox">
        <v-checkbox v-if="mode == 'checkbox'" :label="label" v-model="model" @click.stop="$emit('click', $event)" @change="$emit('change', $event)" :ripple="false"></v-checkbox>
        <v-switch v-if="mode == 'switch'" :label="label" v-model="model" :ripple="false"></v-switch>
    </div>
</template>

<style lang="scss">
    .starship-checkbox {

        .v-input--selection-controls {
            margin-top: 0px !important;
        }

        .v-input--selection-controls__input i {
            position: relative;
            top: 1px;
        }

        i {
            font-size: 1.4em;
        }

        label {
            color: rgb(80, 80, 80) !important;
            font-weight: 400;
        }
    }
</style>

<script>
    import { Component, Mixins } from 'starship';

    export default Component('starship-checkbox', {

        mixins: [Mixins.ValueModel],

        properties: {

            $label: '',
            
            $size: 30,

            // checkbox or switch
            $mode: 'checkbox'
        }
    });
</script>