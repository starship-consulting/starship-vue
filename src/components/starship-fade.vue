<template>
    <div class="starship-fade" :class="{ fading: fading }"><slot></slot></div>
</template>

<style scoped>
    .starship-fade {
        opacity: 1;
        transition: opacity 1s;
    }

    .fading {
        opacity: 0;
    }
</style>

<script>
    import {Component} from 'starship';

    export default Component('starship-fade', {

        properties: {
            $after: 0,
            $in: false,
            fading: false
        },

        ready() {
            if (this.after) {
                this.fading = false;

                setTimeout(() => {
                    this.fading = true;
                }, this.after);
            }
        }
    });
</script>