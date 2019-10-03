<template>
    <starship-icon class="starship-help" :tooltip="tooltip" icon="question-circle" :size="18"></starship-icon>
</template>

<style lang="scss">

    .starship-help {

        i {
            font-size: 18px;
            cursor: pointer;
        }

        span {
            font-size: 16px;
        }
    }
</style>

<script>
    import {Component} from 'starship';
    
    export default Component('starship-help', {

        properties: {
            $tooltip: '',
            $color: 'rgb(150, 150, 150)'
        }
    });
</script>