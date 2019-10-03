<template>
    <div style="position: relative; width: 100%; height: 100%;">
        <v-layout id="starship-virtual-container" ref="container" class="starship-virtual-container" fill-height row>
            <div class="scroll-area" :style="{ height: containerHeight + 'px' }" v-resize="resized" v-scroll:#starship-virtual-container="scrolled">
                <!--
                <slot></slot>
                -->
            </div>
        </v-layout>

        <div class="viewport">
            <div class="virtual-item" :style="{ height: itemHeight + 'px', width: itemWidth + 'px' }" v-for="(item, index) in items">
                <v-icon>fa-fw fa-{{ item }}</v-icon>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .starship-virtual-container {
        overflow: auto;
        position: relative;

        .scroll-area {
            background-color: rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            position: relative;
            width: 100%;
            height: 100%;
        }

        .viewport {
            top: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            background-color: rgba(255, 0, 0, 0.1);

            .virtual-item {
                display: inline-block;
                color: black;
                font-size: 20px;
            }
        }
    }
</style>

<script>
    import Icons from 'starship/src/data/icons';
    import { Component } from 'starship';
    
    export default Component('starship-virtual-container', {
        
        properties: {
            $items: Icons.slice(0, 500),

            itemWidth: 64,
            itemHeight: 64,

            viewportY: 0,
            viewportWidth: 0,
            viewportHeight: 0,

            containerHeight() {

                if (this.viewportWidth <= 0 || this.viewportHeight <= 0) {
                    return 0;
                }

                let itemsPerRow = Math.floor(this.viewportWidth / this.itemWidth);
                let rows = Math.ceil(this.items.length / itemsPerRow);
                let height = rows * this.itemHeight;

                //console.log({ itemsPerRow: itemsPerRow, rows: rows, height: height });

                return height;
            },

            visibleItems() {
                return this.items;
            }
        },

        resized(e) {
            this.viewportWidth = this.$refs.container.clientWidth;
            this.viewportHeight = this.$refs.container.clientHeight;
        },

        scrolled(e) {
            this.viewportY = e.target.scrollTop;
        }
    });
</script>