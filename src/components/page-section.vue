<template>
    <v-card class="page-section" light>

        <v-card-title v-show="showTitle" :style="{ 'background-color': titleBackground, color: titleColor }">
            {{ title }}
            <slot name="title"></slot>
            <template v-if="closeable">
                <v-spacer></v-spacer>
                <toolbar-button class="close-button" :color="titleColor" icon="times" @click="$emit('closed')"></toolbar-button>
            </template>
        </v-card-title>

        <v-toolbar v-show="hasToolbar" :height="toolbarHeight" flat>
            <slot name="toolbar"></slot>
        </v-toolbar>

        <div class="section-content">
            <slot></slot>
        </div>

    </v-card>
</template>

<style lang="scss">

    .page-section {

        height: 100%;
        display: flex;
        flex-direction: column;
        border-right: solid 1px var(--divider-color) !important;
        background-color: var(--foreground) !important;

        .close-button {
            .toolbar-button {
                border-right: 0 !important;
            }
        }

        & .v-card__title {
            flex: 1 0 42px;
            height: 42px;
            //font-size: 16px;
            font-weight: 500;
            color: var(--header-text-color);
            padding: 0;
            padding-left: 15px;
            align-items: center;
            letter-spacing: 0.03em;
        }

        .v-toolbar {
            border-top: solid 1px var(--divider-color);
            border-bottom: solid 1px var(--divider-color);
            z-index: 2;
        }

        .v-toolbar >>> .v-toolbar__content {
            outline: solid 1px var(--border-shadow);
            outline-offset: -1px;
            z-index: 1;
        }

        .section-content {
            overflow-x: hidden;
            overflow-y: auto;
            flex: 1 1 auto;
            height: 100%;
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('page-section', {

        properties: {
            $title: '',
            $closeable: false,
            $titleBackground: 'var(--toolbar-background)',
            $titleColor: 'var(--header-text-color)',
            hasToolbar: false,
            toolbarHeight() {

                return 41;
                /*if (this.title) {
                    return 40;
                }

                return 47;*/
            },

            showTitle() {
                if (this.title || this.$slots.title) {
                    return true;
                }

                return false;
            }
        },

        ready() {
            if (this.$slots.toolbar) {
                this.hasToolbar = true;
            }
        }
    });
</script>