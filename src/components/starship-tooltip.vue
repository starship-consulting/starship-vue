<template>
    <v-tooltip :disabled="!text" :bottom="bottom" :top="top" :left="left" :right="right" :max-width="300" lazy>
        <div slot="activator">
            <slot></slot>
        </div>
        <span>{{ text }}</span>
    </v-tooltip>
</template>

<style lang="scss">
    .starship-tooltip {
    }
</style>

<script>
    import { Component } from 'starship';
    
    export default Component('starship-tooltip', {

        properties: {
            $text: '',
            $left: false,
            $top: false,
            $bottom: false,
            $right: false
        }
    });
</script>