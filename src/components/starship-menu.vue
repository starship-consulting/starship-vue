<template>
    <v-menu ref="menu" v-model="show" class="starship-menu" style="max-width: 500px" :close-on-content-click="false" :close-on-click="false" :z-index="1000" :position-x="x" :position-y="y" left absolute>
        <slot></slot>
    </v-menu>
</template>

<style lang="scss">
</style>

<script>
    import { Component, InputState } from 'starship';

    export default Component('starship-menu', {

        properties: {
            $value: false,
            $x: 0,
            $y: 0,
            show: false
        },

        watch: {

            value() {

                this.show = this.value;
                
                /*if (this.show) {
                    setTimeout(() => {

                        let width = this.$refs.menu.$el.offsetWidth;
                        let height = this.$refs.menu.$el.offsetHeight + 1;
                        
                        this.x = InputState.x + width - (width / 5);
                        this.y = InputState.y + 25;

                    }, 10);
                }*/
            },

            show() {
                this.$emit('input', this.show);
            } 
        },

        close() {
            this.show = false;
        }
    });
</script>