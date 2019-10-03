<template>
    <v-rating class="starship-rating" size="12" length="3" empty-icon="fas fa-star" full-icon="fas fa-star full" v-model="dirty" hover clearable>

    </v-rating>
</template>

<style lang="scss">
    .starship-rating {

        line-height: 18px;

        .v-icon {
            padding: 0;
            color: rgb(50, 50, 50) !important;
            position: relative;
            //top: -10px;
        }

        .v-icon.full {
            color: rgb(230, 230, 130) !important;
        }

        .v-icon:not(:first-of-type) {
            //top: -15px;
        }

        .v-icon:last-of-type {
            //top: -20px;
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('starship-rating', {
        
        properties: {
            $vertical: false,
            $value: 0,
            dirty: 0
        },

        watch: {

            dirty(value) {
                this.$emit('input', value);
            },

            value: {
                immediate: true,

                handler() {
                    this.dirty = this.value;
                }
            }
        },

        ready() {
        }
    });
</script>