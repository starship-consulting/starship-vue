<template>
    <starship-tooltip :text="tooltip" class="starship-tag" top>
        <starship-icon v-if="icon" :icon="icon" :size="size"></starship-icon>
        <slot></slot>
    </starship-tooltip>
</template>

<style lang="scss">

    .starship-tag {

        border-radius: 3px;
        border: solid 1px rgb(210, 210, 210);
        font-size: 0.8em;
        font-weight: 600;
        color: black;
        //font-family: Segoe UI;
        margin-right: 5px;
        margin-bottom: 5px;
        padding: 5px;
        padding-top: 3px;
        padding-bottom: 2px;
        background-color: rgb(240, 245, 250);

        &:hover {
            background-color: rgb(210, 230, 255);
        }

        .starship-icon {
            margin-right: 3px;
        }
    }

</style>

<script>
    import { Component } from 'starship';
    
    export default Component('starship-tag', {
        
        properties: {
            $icon: '',
            $tooltip: '',
            $size: 16
        }
    });
</script>