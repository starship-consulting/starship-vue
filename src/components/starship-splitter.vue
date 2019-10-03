<template>
    <v-flex class="starship-splitter" shrink>
        <v-layout fill-height column justify-center>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </v-layout>
    </v-flex>
</template>

<style lang="scss">
    .starship-splitter {

        padding-left: 2px;
        padding-right: 2px;
        padding-bottom: 60px;
        background-color: var(--divider-color); //rgb(230, 232, 235); //var(--toolbar-background); //rgb(210, 215, 220);
        cursor: e-resize;

        border-left: solid 1px rgb(200, 200, 200);
        border-right: solid 1px rgb(200, 200, 200);


        .dot {
            height: 5px;
            width: 5px;
            background-color: rgb(180, 180, 180);
            border-radius: 50%;
            display: inline-block;
            margin-bottom: 5px;
        }
    }
</style>

<script>
    import { Component } from 'starship';
    
    export default Component('starship-splitter', {

        properties: {

        }
    });
</script>