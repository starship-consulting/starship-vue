<template>
    <img class="starship-image" :src="value" />
</template>

<style lang="scss">

    .starship-image {
        display: block;
        background-color: var(--v-header-base);
    }
</style>

<script>
    import Icons from 'starship/src/data/icons';
    import { Component } from 'starship';

    export default Component('starship-image', {
        
        properties: {
            $value: '',
            dirty: ''
        },

        ready() {
            this.dirty = this.value;
        }
    });
</script>