<template>
    <v-btn slot="activator" class="starship-button" :class="{ reversed: reversed }" :style="{ 'background-color': getBackgroundColor }" :flat="flat" @click="$emit('click', $event)" :to="to" :small="small" :disabled="disabled" :large="large" :round="round">
        <v-icon v-if="icon" :class="{ 'mr-2': hasContent }" :size="iconSize" :color="getColor">{{ getIcon }}</v-icon>
        <!-- REMOVE TOOLTIP DUE TO PERFORMANCE
        <starship-icon v-if="icon" :color="getColor" :size="iconSize" :class="{ 'mr-2': hasContent }" :icon="icon"></starship-icon>    
        -->
        <label :style="{ 'color': getColor }">{{ text }}<slot></slot></label>
    </v-btn>
</template>

<style lang="scss">

    .theme--dark.v-btn.v-btn--disabled:not(.v-btn--icon):not(.v-btn--flat) {
        cursor: not-allowed !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
    }

    /* (Button) Color for flat buttons */
    .v-toolbar:not(.main) .v-btn.v-btn--flat:not(.v-btn--disabled),
    .v-toolbar:not(.main) .v-select__selection,
    .v-card__actions .v-btn.v-btn--flat:not(.v-btn--disabled) {
        color: var(--v-button-text-base) !important;
    }

    /* (Button) Colors for non-flat buttons */
    .v-toolbar:not(.main) .v-btn:not(.v-btn--flat):not(.v-btn--disabled),
    .v-btn:not(.v-btn--flat):not(.v-btn--disabled):not(.v-btn--icon) {
        background-color: var(--button-color);
        color: var(--v-clickable-text-base);
    }

    .starship-button {

        margin: 0;
        height: calc(var(--input-height) + 1px);
        min-width: 30px;
        padding-left: 10px;
        padding-right: 10px;

        .starship-icon {
            position: relative;
            top: 1px;
        }

        &.reversed {
            .v-btn__content {
                padding-left: 10px;
                flex-direction: row-reverse;
            }
        }

        .v-chip__content {
            cursor: pointer;
        }

        .v-btn__content {
            cursor: pointer;
            font-size: 0.9rem;
        }

        &.v-btn--disabled {
            background-color: grey !important;
        }

        &.v-btn--flat {
            .v-btn__content {
                color: var(--button-color);
            }
        }

        &:not(.v-btn--flat) {
            .v-btn__content {
                color: white;
            }
        }

        label {
            font-family: Roboto;
            cursor: pointer;
            font-size: 1em;
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('starship-button', {

        properties: {

            $to: '',
            $text: '',
            $icon: '',
            $color: '',
            $backgroundColor: '',
            $disabled: false,
            $flat: false,
            $small: false,
            $large: false,
            $reversed: false,
            $round: false,
            $iconSize: 18,

            getIcon() {
                return this.$starship.icons.prefix + this.icon;
            },

            getBackgroundColor() {
                if (this.backgroundColor) {
                    return this.backgroundColor;
                }

                if (!this.flat) {
                    return 'var(--button-color)';
                }

                return 'transparent';
            },

            getColor() {
                if (this.color) {
                    return this.color;
                }

                if (this.flat) {
                    return 'var(--button-color)';
                }

                return 'white';
            },

            hasContent() {
                if (this.text && this.text.length >= 1) {
                    return true;
                }
                
                if (this.$slots.default && this.$slots.default.length >= 1) {
                    return true;
                }

                return false;
            }
        }
    });
</script>