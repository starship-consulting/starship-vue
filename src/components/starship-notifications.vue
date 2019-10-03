<template>
    <v-snackbar v-model="show" bottom right>
        {{text}}
        <v-btn flat @click="show = false"><v-icon color="orange">fa-times</v-icon></v-btn>
    </v-snackbar>
</template>

<script>
    import { Component } from 'starship';
    
    export default Component('starship-notifications', {

        properties: {
            show: false,
            text: ''
        },

        ready() {

            this.$events.on('notification', async text => {

                this.show = false;
                this.text = text;

                await this.$nextTick();

                this.show = true;
            });
        }
    });
</script>