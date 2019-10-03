<template>
    <div class="starship-menu2">
        <div class="content-wrapper elevation-4">
            <div class="menu-title">
                <h4>{{ title }}</h4>
            </div>
            <div class="layout column">
                <div class="menu-item px-2 pt-2 layout row flex" v-for="each in items" @click="$emit('select', each)">
                    <div class="flex shrink"><img :src="each.photo" width="36" height="36" /></div>
                    <div class="ml-3 flex shrink" style="align-self: center; top: -3px; position: relative;">{{ each.name }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

    .starship-menu2 {

        .content-wrapper {
            position: relative;
            background: white;
            z-index: 999;
        }

        .menu-title {
            background: var(--title-background);
            padding: 8px;
            padding-left: 12px;
            color: white;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
        }

        .menu-item {
            opacity: 0.8;
            cursor: pointer;

            &:hover {
                background: var(--hover-background);
                opacity: 1;
            }
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('starship-menu2', {
        
        properties: {
            $title: '',
            $items: []
        },

        ready() {

        }
    });
</script>