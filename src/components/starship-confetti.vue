<template>
    <canvas id="confetti"></canvas>
</template>

<style lang="scss">
    #confetti {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        pointer-events: none;
    }
</style>

<script>
    import {Component} from 'starship';
    import "confetti-js";

    export default Component('starship-confetti', {

        properties: {
        },

        ready() {
            var confetti = new ConfettiGenerator({
                rotate: true,
                target: 'confetti'
            });

            confetti.render();
        }
    });
</script>