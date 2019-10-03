<template>
    <v-alert :style="{ 'background-color': color }" :color="color" class="starship-stat elevation-2" :class="{ help: help.length }" :value="visible" transition="scale-transition" @click="$emit('click', $event)" outline>
        <starship-help v-show="help" :tooltip="help" class="mr-1"></starship-help>
        <label>{{ label }}</label>
        <v-flex class="value-label">
            <slot></slot>
        </v-flex>
    </v-alert>
</template>

<style lang="scss">
    .starship-stat {

        padding: 5px;
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 4px;
        border-left: solid 1px var(--border-shadow);
        border-right: solid 1px var(--border-shadow);
        border-bottom: solid 1px var(--border-shadow);

        margin: initial;

        &.help {
            padding-left: 10px;
        }

        .value-label {
            color: var(--darkened-text-color);
            font-size: 20px;
            font-weight: bold;
        }

        .v-icon {
            color: rgb(180, 180, 180) !important;
            //font-size: 20px !important;
        }

        label {
            font-size: 1em;
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('starship-stat', {
        
        properties: {

            $color: 'var(--stat-background)',
            $icon: '',
            $label: '',
            $help: '',
            visible: false,

            getIcon() {
                if (!this.icon) {
                    return '';
                }

                if (this.help) {
                    return 'question-circle';
                }

                return this.$starship.icons.prefix + this.icon;
            }
        },

        ready() {
            setTimeout(() => {
                this.visible = true;
            }, 1);
        }
    });
</script>