<template>
    <v-tooltip :disabled="!tooltip" :bottom="bottom" :top="top" :left="left" :right="right" :max-width="300" lazy>
        <starship-button v-if="button" slot="activator" flat :icon="getIcon" :icon-size="size" @click="$emit('click', $event)"></starship-button>
        <v-icon v-else slot="activator" class="starship-icon" :size="getSize" :color="color" @click="$emit('click', $event)">{{ getIcon }}</v-icon>
        <span>{{ tooltip }}</span>
    </v-tooltip>
</template>

<style lang="scss">
    .starship-icon {
        //color: var(--icon-color);
    }
</style>

<script>
    import { Component } from 'starship';
    
    export default Component('starship-icon', {

        properties: {

            $icon: '',
            $tooltip: '',
            $color: '',
            $size: 20,
            $button: false,

            $left: false,
            $top: false,
            $bottom: true,
            $right: false,

            getSize() {
                return ((this.size / 10) - 0.7) + 'rem';
            },

            getIcon() {
                return this.$starship.icons.prefix + this.icon;
            }
        }
    });
</script>