<template>
    <v-layout class="page-column" column fill-height>

        <v-toolbar v-show="showTitle" :height="titleHeight" style="flex: 0 1 auto;" flat>
            <v-toolbar-title><slot name="beforeTitle"></slot>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <slot name="title"></slot>
            </v-toolbar-items>
        </v-toolbar>

        <v-layout class="section-content" column fill-height>
            <slot></slot>
        </v-layout>

    </v-layout>
</template>

<style lang="scss">

    .page-column {
        
        background-color: var(--foreground);
        overflow: hidden;

        .close-button {
            .toolbar-button {
                border-right: 0 !important;
            }
        }

        & .v-card__title {
            flex: 0 0 42px;
            font-weight: 500;
            background-color: white;
            color: var(--header-text-color);
            padding: 0;
            padding-left: 15px;
            align-items: center;
            letter-spacing: 0.03em;
        }

        & .v-toolbar__title {
            color: var(--title-color);
        }

        .v-toolbar {
            border-top-left-radius: 4px !important;
            border-top-right-radius: 4px !important;
            background-color: var(--title-background);
            z-index: 2;
        }

        .v-toolbar__title {
            font-size: 1.1em;
            margin-left: 15px;
        }

        .v-toolbar >>> .v-toolbar__content {
            z-index: 1;
        }

        .section-content {
            border-left: solid 2px var(--border-color);
            border-right: solid 2px var(--border-color);
            overflow: hidden;
            
            //overflow-x: hidden;
            //overflow-y: auto;
        }

        &.no-borders {
            .section-content {
                border: 0 !important;
            }
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('page-column', {

        properties: {
            $title: '',
            $closeable: false,
            $toolbarHeight: 60,
            $titleHeight: 40,

            showToolbar() {
                if (this.$slots.toolbar) {
                    return true;
                }

                return false;
            },

            showTitle() {
                if (this.title || this.$slots.title || this.$slots.beforeTitle) {
                    return true;
                }

                return false;
            }
        }
    });
</script>