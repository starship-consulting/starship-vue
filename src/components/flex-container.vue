<template>
    <div class="flex-container layout column fill-height">
        <div class="flex-row layout row">
            <div class="flex-column layout column flex shrink">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .flex-container {

        .flex-row {
            overflow-y: auto;
        }

        .flex-column {
            flex: 0 0 auto;
        }
    }
</style>

<script>
    import { Component, Mixins } from 'starship';

    export default Component('flex-container', {
    });
</script>