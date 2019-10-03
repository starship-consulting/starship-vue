<template>
    <v-dialog v-model="loading" width="300" persistent hide-overlay>
        <v-card class="starship-loader" color="primary" dark>
            <v-card-text>
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped>
</style>

<script>
    import { Component } from 'starship';
    
    export default Component('starship-loader', {

        properties: {
            loading: 0
        },

        ready() {
            this.$events.on('loading.start', () => {
                setTimeout(() => {
                    this.loading += 1;
                });
            });

            this.$events.on('loading.stop', () => {
                setTimeout(() => {
                    this.loading -= 1;
                });
            });
        }
    });
</script>