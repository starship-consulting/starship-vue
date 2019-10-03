<template>
    <div class="starship-treeview unselectable">
        <starship-treenode ref="childNodes" v-for="item in items" :key="item[itemKey]" :model="item" :close-icon="closeIcon" :open-icon="openIcon" :item-key="itemKey" :item-text="itemText" :editable="editable" :selectable="selectable" @select="select" @remove="onRemoved"></starship-treenode>
    </div>
</template>

<style lang="scss">

    .starship-treeview {
        width: 100%;
        height: 100%;
        position: relative;
    }

</style>

<script>
    import _ from 'underscore';
    import moment from 'moment';
    import Vue from 'vue';
    import { Component, Util } from 'starship';
    
    export default Component('starship-treeview', {

        properties: {

            $openAll: false,
            $itemKey: 'key',
            $itemText: 'name',
            $selected: null,
            $selectable: false,
            $openIcon: 'caret-down', // folder-open
            $closeIcon: 'caret-right', // folder

            $items: [],
            $editable: false,

            selectedNode: null
        },
        
        async ready() {
            if (this.openAll) {

                if (this.$refs.childNodes) {
                    this.$refs.childNodes.each(child => {
                        child.expanded = true;
                    });
                }
            }
        },
        
        select(node) {

            if (this.selectedNode) {
                this.selectedNode.selected = false;
                this.selectedNode = null;
            }

            this.selectedNode = node;

            if (this.selectedNode) {

                this.selectedNode.selected = true;

                let model = this.selectedNode.model.model;
            
                this.$emit('update:selected', model);
                this.$emit('change', model);
            }
        },
        
        onRemoved(item) {
            this.items.remove(item);
        },

        async add(item) {
            this.items.push(item);

            await this.$nextTick();

            this.select(this.$refs.childNodes.last());
        }
    });
</script>