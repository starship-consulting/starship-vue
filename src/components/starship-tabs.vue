<template>
    <div class="starship-tabs layout column" :class="{ fullWidth: fullWidth }">

        <div class="tabs layout row" style="flex: 0 0 auto;">
            <router-link v-for="tab in tabs" tag="div" :to="root + tab.path" class="tab flex shrink" :class="{ selected: tab.path == selected }">
                <label>{{ tab.title }}</label>
            </router-link>
        </div>

        <component v-if="tab" class="tab-content" :is="tab.component" v-bind="model" style="overflow: hidden;"></component>
    </div>
</template>

<style lang="scss">
    .starship-tabs {

        width: auto !important;
        overflow: hidden;

        .tabs {
            margin-top: 10px;
            margin-left: 60px;
            height: 30px;

            label {
                font-size: 1.1em;
            }

            .tab {
                cursor: pointer;
                padding-bottom: 10px;

                label {
                    font-weight: 400;
                    cursor: pointer;
                    text-render: optimizeLegibility;
                }

                &:not(last-of-type) {
                    margin-right: 50px;
                }

                &:not(.selected) {

                    margin-bottom: 2px;

                    &:hover {
                        label {
                            color: rgb(30, 30, 30);
                            //text-shadow: 0 0 .40px #333, 0 0 .40px #333;
                        }
                    }
                }

                &.selected {
                    border-bottom: solid 2px #fd6f4c;

                    label {
                        color: black;
                        font-weight: 500;
                        //letter-spacing: -.2px;
                    }
                }
            }
        }

        &.fullWidth {
            .tabs {
                margin-left: 26px;
            }
        }

        .tab-content {
            background-color: rgb(248, 248, 248);
            border: solid 1px var(--border-color);
            border-top-left-radius: 4px !important;
            border-top-right-radius: 4px !important;
            width: auto !important;
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('starship-tabs', {

        properties: {
            $root: '',
            $tabs: [],
            $selected: '',
            $model: null,
            $fullWidth: false,

            tab() {
                return this.tabs.find(each => each.path == this.selected);
            }
        }
    });
</script>