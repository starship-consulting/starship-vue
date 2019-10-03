<template>
    <v-tooltip :disabled="!tooltip" :top="direction == 'top'" :left="direction == 'left'" :right="direction == 'right'" :bottom="direction == 'bottom'" lazy>
        <v-btn @click="$emit('click', $event)" slot="activator" class="no-padding no-margin toolbar-button" :to="to" :disabled="disabled" active-class="" :class="{ 'mr-4': text }" flat>
            <slot></slot>
            <template v-for="(icon, i) in icons">
                <v-icon :key="i" :style="{ color: color }" :size="size" style="padding-left: 2px; padding-bottom: 2px;" :class="{ 'mr-2': text }">{{ getIcon }}</v-icon>
            </template>
            {{ text }}
        </v-btn>
        <span>{{ tooltip }}</span>
    </v-tooltip>
</template>

<style scoped>
    .toolbar-button {
        /*
            border-right: solid 1px var(--divider-color);
        */
        border-radius: 0;
        height: 100%;
        z-index: 3;
        width: 100%;
        min-width: 40px;
    }

    .v-tooltip {
        height: 100%;
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('toolbar-button', {

        properties: {
            $to: '',
            $icon: '',
            $tooltip: '',
            $color: '',
            $disabled: false,
            $size: 20,
            $text: '',
            $direction: 'bottom',

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
        }
    });
</script>