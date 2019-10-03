<template>
    <v-menu class="starship-prompt" v-model="show" :close-on-content-click="false" offset-y>
        <template slot="activator">
            <starship-button :icon="icon" :tooltip="tooltip" :size="size" :text="text"><slot></slot></starship-button>
        </template>

        <v-card light flat>
            <v-card-text>
                <starship-text v-model="value" :label="label" clearable></starship-text>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="show = false">Cancel</v-btn>
                <v-btn @click="save">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<style lang="scss">
    .starship-prompt {
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('starship-prompt', {
        
        properties: {
            $label: '',
            $icon: '',
            $tooltip: '',
            $color: '',
            $disabled: false,
            $size: 20,
            $text: '',
            show: false,
            value: '',

            icons: [],

            getIcon() {
                return this.$starship.icons.prefix + this.icon;
            }
        },

        watch: {

            icon: {
                immediate: true,

                handler() {
                    this.icons = this.icon.split(',');
                }
            }
        },

        save() {
            this.$emit('save', this.value);
            this.value = '';
            this.show = false;
        }
    });
</script>