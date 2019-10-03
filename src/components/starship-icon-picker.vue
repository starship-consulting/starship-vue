<template>
    <div class="starship-icon-picker">
        <v-dialog v-model="show" width="800" lazy>
            <div class="icon-picker-button" slot="activator">
                <v-icon class="mt-1">fa-fw fa-{{ dirty }}</v-icon>
            </div>

            <v-card class="starship-icon-card starship-dialog" light>
                <v-card-title class="title">
                    Choose Icon
                    <v-btn class="close-button" @click="close" flat small>
                        <v-icon color="rgb(100, 100, 100)">far fa-times-circle</v-icon>
                    </v-btn>
                </v-card-title>

                <v-layout style="overflow: auto; padding: 10px;" fill-height row>
                    <v-flex>
                        <v-icon class="clickable-icon" style="margin: 5px;" size="30" v-for="(icon, index) in icons" :key="index" @click="select(icon)">fa-fw fa-{{ icon }}</v-icon>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
    </div>
</template>

<style lang="scss">

    .starship-icon-card {

        .clickable-icon {
            opacity: 0.8;
            cursor: pointer;

            &:hover {
                opacity: 1;
            }
        }
    }

    .starship-icon-picker {

        display: block !important;

        .icon-picker-button {

            width: 48px;
            height: 38px;
            border: solid 1px var(--divider-color);
            text-align: center;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>

<script>
    import Icons from 'starship/src/data/icons';
    import { Component } from 'starship';

    let icons = Icons.slice(0, 100);

    export default Component('starship-icon-picker', {
        
        properties: {
            $value: '',
            dirty: '',
            icons: icons,
            show: false
        },

        ready() {
            this.dirty = this.value;
        },

        select(icon) {
            this.dirty = icon;
            this.$emit('input', icon);
            this.close();
        },

        close() {
            this.show = false;
        }
    });
</script>