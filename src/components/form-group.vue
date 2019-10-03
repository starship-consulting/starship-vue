<template>
    <div class="form-group" :class="{ full: full }">
        <div class="subheading">{{title}}</div>
        <div class="form-group-content">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss">

    .form-group {
        width: 100%;
        position: relative;

        .form-group-content {
            overflow: hidden;
            width: 100%;
            position: relative;
        }

        &.full {
            border: solid 2px rgb(240, 240, 240);
            border-radius: 4px;
        }

        .subheading {
            position: absolute;
            top: 0;
            left: 12px;
            top: -13px;
            padding-left: 10px;
            padding-right: 10px;
            color: rgb(150, 150, 150);
            width: 100%;

            border-bottom: solid 1px rgba(0, 0, 0, 0.1);
        }
    }
</style>

<script>
    import { Component }  from 'starship';

    export default Component('form-group', {

        properties: {
            $title: '',
            $full: false
        }
    });
</script>