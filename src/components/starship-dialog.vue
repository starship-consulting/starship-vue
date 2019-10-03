<template>
    <v-dialog :class="{ autowidth: autoWidth }" :max-width="width + 'px'" v-model="active" :persistent="modal" :scrollable="scrollable" light>
        <v-card class="starship-dialog">

            <v-card-title class="subheading">
                {{ title }}
                <starship-button icon="times-circle" class="close-button" v-if="closeable" @click="close" flat small></starship-button>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text ref="content" :style="getStyles">
                <slot></slot>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <slot name="actions"></slot>
                <!--
                <v-btn flat @click.native="active = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn flat @click.native="active = false">Save</v-btn>
                -->
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style lang="scss">
    .v-dialog__container { display: none !important; }

    .v-dialog.autowidth {
        width: auto !important;
    }

    .starship-dialog {

        .close-button {
            position: absolute;
            top: 0;
            right: 0;
            margin: 0;
            padding: 0 !important;
            height: 40px;
            width: 50px;

            .v-icon {
                color: var(--text-color-inverse) !important;
            }
        }

        .v-card__text {
            padding: 0;
            overflow-x: hidden;
        }

        .v-card__title {
            padding: 0;
            height: 40px;
            padding-left: 12px;
            color: var(--text-color-inverse);
            background-color: var(--title-background);
        }

        .v-card__actions {
            background-color: rgb(245, 245, 245);
            padding: 4px;
        }
    }
</style>

<script>
    import {Component} from 'starship';
    
    export default Component('starship-dialog', {

        properties: {
            $title: '',
            $scrollable: true,
            $modal: false,
            $closeable: false,
            $width: 600,
            $height: 0,
            $autoWidth: false,
            $value: false,
            active: false,

            getStyles() {

                if (this.height) {
                    return {
                        height: this.height + 'px'
                    };
                }

                return '';
            }
        },

        watch: {

            active() {
                this.$emit('input', this.active);
            },

            value: {
                immediate: true,

                handler() {
                    this.active = this.value;
                }
            }
        },

        show() {
            this.active = true;
        },

        close() {
            this.active = false;
            this.$emit('closed');
        },

        scrollToBottom() {
            this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
        }
    });
</script>