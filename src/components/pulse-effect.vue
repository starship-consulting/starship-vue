<template>
    <div class="effect">
        <div class="pulse effect" :style="effect"><slot></slot></div>
    </div>
</template>

<style scoped>

    .pulse {
         animation-name: shadow-pulse;
    }

    .effect {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    @keyframes shadow-pulse {

        0% {
            box-shadow: 5px 0 0 0px rgba(0, 0, 0, 0.2);
            background-color: rgba(0, 0, 0, 0.2);
        }

        100% {
            box-shadow: 5px 0 0 8px rgba(0, 0, 0, 0);
            background-color: rgba(0, 0, 0, 0);
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('pulse-effect', {

        properties: {

            $iterations: 'infinite',
            $duration: '1',

            effect() {
                return {
                    'animation-duration': this.duration + 's',
                    'animation-iteration-count': this.iterations
                };
            }
        },

        ready() {

        }
    });
</script>