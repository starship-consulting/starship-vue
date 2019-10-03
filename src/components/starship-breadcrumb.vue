<template>
    <ul class="breadcrumbs text-no-wrap" :class="{ reversed: reversed, sequential: sequential }">
        <li v-for="(item, index) in items" :class="{ active: isActive(index), noText: !item.name, disabled: isDisabled(index), completed: isCompleted(index) }">
            <a @click="activate($event, index)" slot="activator">
                <!--
                <v-icon v-if="item.icon" size="18" class="mr-2">{{ item.icon }}</v-icon> {{item.name}} <div>{{item.subtitle}}</div>
                -->
                <template v-if="item.subtitle">
                    <div class="breadcrumb-title">{{ item.name }}</div>
                    <div class="breadcrumb-subtitle">{{ item.subtitle }}</div>
                </template>

                <template v-else>
                    {{ item.name }}
                </template>
            </a>
        </li>
    </ul>
</template>

<style lang="scss">
    @import '~compass-mixins/lib/compass/css3';

    $background 	: var(--button-color); //rgb(252, 253, 254);
    $disabled       : rgb(150, 150, 150);
    $completed      : #3E9B6B;
    $active 		: rgb(210, 110, 60);

    $color          : var(--toolbar-background);
    $text           : var(--v-clickable-text-base);
    $height         : 36px;

    .breadcrumbs {

        padding: 0;
        list-style: none;
        display: flex;
        background: $color;
        font-family: Roboto;
        font-size: 0.85em;
        font-weight: 500;
        letter-spacing: 0.05em;
        z-index: 10;
        width: 100%;

        li {
            -webkit-box-shadow: 0 2px 4px -3px #000000;
            -moz-box-shadow: 0 2px 4px -3px #000000;
            box-shadow: 0 2px 4px -3px #000000;

            flex: 1 0 auto;
            opacity: 1;

            &:not(.disabled):hover,
            &.completed:hover {
                opacity: 0.8;
            }

            &.active {
                opacity: 0.8;
            }

            &.noText {
                max-width: 70px;
                
                .v-icon {
                    left: 12px;
                    position: relative;
                }
            }

            a {
                color: $text;
                background: $background;
                display: block;
                text-decoration: none;
                position: relative;
                height: $height;
                line-height: $height;
                text-align: center;
                margin-right: 23px;

                &:before,
                &:after {
                    content: "";
                    position: absolute;
                    top: 0;
                    border: 0 solid $background;
                    border-width: ($height/2) 10px;
                    width: 0;
                    height: 0;
                }
            }

            &:first-child {
                a {
                    @include border-radius(3px 0 0 3px);
                }
            }

            &:last-child {
                a {
                    margin: 0;
                    @include border-radius(0 3px 3px 0);
                }
            }
        }

        &.reversed li {

            &:first-child {
                a {
                    &:after {
                        border: none;
                    }
                }
            }

            &:last-child {
                a {
                    &:before {
                        border: none;
                    }
                }
            }

            a {
                background-color: $background;
                color: white;
                cursor: pointer;

                &:before {
                    left: 100%;
                    border-right-color: transparent;
                }

                &:after {
                    left: -20px;
                    border-color: transparent;
                    border-right-color: $background;
                }
            }

            &.disabled a {
                background-color: $disabled;
                cursor: not-allowed;

                &:before {
                    border-color: $disabled;
                    border-right-color: transparent;
                }

                &:after {
                    border-color: transparent;
                    border-right-color: $disabled;
                }
            }

            &.completed a {
                background-color: $completed;
                cursor: pointer;

                &:before {
                    border-color: $completed;
                    border-right-color: transparent;
                }

                &:after {
                    border-color: transparent;
                    border-right-color: $completed;
                }
            }

            &.active a {
                background-color: $active;
                cursor: pointer;
        
                &:before {
                    border-color: $active;
                    border-right-color: transparent;
                }

                &:after {
                    border-color: transparent;
                    border-right-color: $active;
                }
            }
        }

        &:not(.reversed) li {

            &:first-child {
                a {
                    &:before {
                        border: none;
                    }
                }
            }

            &:last-child {
                a {
                    &:after {
                        border: none;
                    }
                }
            }

            a {
                &:before {
                    left: -20px;
                    border-left-color: transparent;
                }

                &:after {
                    left: 100%;
                    border-color: transparent;
                    border-left-color: $background;
                }
            }
        }

        .breadcrumb-title,
        .breadcrumb-subtitle {
            height: 16px;
            position: relative;
            top: -8px;
        }

        .breadcrumb-subtitle {
            //font-size: 1em;
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('starship-breadcrumb', {

        properties: {
            $reversed: false,
            $value: 0,
            $items: [],
            $sequential: false
        },

        activate(e, index) {
            if (this.isDisabled(index)) {
                return;
            }
            
            let value = this.getActualIndex(index);
            //this.$emit('input', value);
            this.$emit('change', e, value);
        },

        isActive(index) {
            return this.value == this.getActualIndex(index);
        },

        getActualIndex(index) {
            if (this.reversed) {
                return this.items.length - index - 1;
            }

            return index;
        },

        isDisabled(index) {

            return false;

            if (this.isCompleted(index)) {
                return false;
            }

            index = this.getActualIndex(index);
            
            if (this.value == index) {
                return false;
            }

            return Math.abs(index - this.value) != 1;
        },

        isCompleted(index) {
            index = this.getActualIndex(index);

            return index < this.value;
        }
    });
</script>