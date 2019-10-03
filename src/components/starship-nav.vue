<template>
    <v-navigation-drawer class="starship-nav elevation-5 fill-height" :mini-variant="collapsed" width="170" :clipped="clipped" floating app permanent dark>

        <v-layout column fill-height>

            <v-flex shrink>
                <slot name="before"></slot>
            </v-flex>

            <v-list class="flex">

                <!--
                <v-list-tile class="collapser" v-if="collapsible" @click.stop="mini = !mini">
                    <v-list-tile-action>
                        <v-icon color="rgb(120, 120, 120)" v-bind:class="{ 'ml-5': !mini }" @click.stop="mini = !mini">menu</v-icon>
                    </v-list-tile-action>
                </v-list-tile>
                -->

                <template v-for="(item, i) in topItems">
                    <v-tooltip :disabled="!collapsed" right>
                        <v-list-tile slot="activator" avatar class="primary--text" active-class="secondary--text" :key="i" :to="{path: item.page}" ripple>
                            <v-list-tile-action>
                                <v-icon color="rgb(150, 150, 150)">fa-{{item.icon}} fa-fw</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content class="body-2">
                                <v-list-tile-title>{{item.text}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <span>{{item.text}}</span>
                    </v-tooltip>
                </template>
            </v-list>

            <v-list class="flex shrink">
                <template v-for="(item, i) in bottomItems">
                    <v-tooltip :disabled="!collapsed" right>

                        <v-list-tile slot="activator" class="primary--text" active-class="secondary--text" :key="i" :to="{ path: item.page }" ripple>
                            <v-list-tile-action>
                                <v-badge v-model="item.badge > 0" class="mr-2 ml-1" overlap>
                                    <span class="badge" slot="badge" dark>{{ item.badge }}</span>
                                    <v-icon>fa-fw fa-{{item.icon}}</v-icon>
                                </v-badge>
                            </v-list-tile-action>
                            <v-list-tile-content class="body-2">
                                <v-list-tile-title>{{item.text}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <span>{{item.text}}</span>
                    </v-tooltip>
                </template>
            </v-list>

            <div class="flex shrink mt-2">
                <slot name="after"></slot>
            </div>
        </v-layout>

    </v-navigation-drawer>
</template>

<style lang="scss">

    .starship-nav {
        z-index: 10;

        .v-list {
            background-color: var(--nav-color) !important;
            margin-top: 12px;
        }

        .v-list__tile {
            height: 42px;
            padding-right: 0;
        }

        .collapser {

            &, .v-list__tile {
                height: 48px;
            }

            .v-list__tile__action {
                position: relative;
            }
        }

        .v-list__tile__title {
            font-size: 1em;
            font-weight: 400;
            color: var(--text-color-inverse);
            text-overflow: clip;
        }

        .badge,
        .v-badge__badge {
            opacity: 0.8;
            left: 15px;
            top: -12px;
            font-size: 0.9em;
        }

        .v-badge__badge {
            height: 21px;
            width: 21px;
            background-color: var(--icon-color) !important;
        }

        .v-icon {
            color: var(--v-active-base);
            font-size: 1.2em;
            position: relative;
            top: -2px;
        }

        .v-list__tile__action {
            min-width: 40px;
        }
    }
</style>

<script>
    import _ from 'underscore';
    import {Component} from 'starship';
    
    export default Component('starship-nav', {

        properties: {

            $collapsible: false,
            $clipped: false,
            $bottomText: '',
            $items: [],

            $collapsed: false,

            topItems() {
                return _.filter(this.items, each => !each.position || each.position == 'top');
            },

            bottomItems() {
                return _.filter(this.items, each => each.position && each.position == 'bottom');
            }
        },

        toggle() {
            this.mini = !this.mini;
        }
    });
</script>