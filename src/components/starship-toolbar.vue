<template>
    <div class="starship-toolbar layout row flex">
        <slot></slot>
    </div>
</template>

<style lang="scss">

    .starship-toolbar {

        align-items: center;

        height: 50px;
        padding: 5px;

        background-color: var(--toolbar-background);

        & > * {
            height: 100%;
        }
    }

</style>

<script>
    import _ from 'underscore';
    import moment from 'moment';
    import { Component, Util } from 'starship';
    
    export default Component('starship-toolbar', {

        properties: {
        }
    });
</script>