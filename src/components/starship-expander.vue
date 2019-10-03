<template>
    <div class="starship-expander layout column" :class="{ expanded: isExpanded }">

        <div v-show="direction == 'top'" class="toggle flex" @click="toggle">
            <starship-icon :icon="isExpanded ? 'angle-up' : 'angle-down'" color="white" :size="22"></starship-icon>
        </div>

        <div class="flex shrink">
            <slot name="visible"></slot>
        </div>

        <v-expand-transition>
            <div v-show="isExpanded" class="flex">
                <slot></slot>
            </div>
        </v-expand-transition>

        <div v-show="direction == 'bottom'" class="toggle flex" @click="toggle">
            <starship-icon :icon="isExpanded ? 'angle-up' : 'angle-down'" color="white" :size="22"></starship-icon>
        </div>
    </div>
</template>

<style lang="scss">
    .starship-expander {

        .toggle {
            padding-top: 6px;
            padding-bottom: 6px;
            background-color: var(--title-background);
            text-align: center;
            cursor: pointer;
            opacity: 0.9;
            max-height: 32px;

            &:hover {
                opacity: 1;
            }
        }
    }
</style>

<script>
    import {Component} from 'starship';

    export default Component('starship-expander', {

        properties: {
            $top: false,
            $bottom: false,
            $expanded: false,
            isExpanded: false,

            direction() {

                if (this.bottom) {
                    return 'bottom';
                }

                return 'top';
            }
        },

        watch: {
            expanded: {
                immediate: true,
                handler() {
                    this.isExpanded = this.expanded;
                }
            }
        },

        toggle() {
            this.isExpanded = !this.isExpanded;
            this.$emit('update:expanded', this.isExpanded);
        }
    });
</script>