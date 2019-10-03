<template>
    <div class="starship-treenode" :class="{ 'has-children': children.length, expanded: expanded, selected: selected, editing: editable && selected }">
        <div class="leaf layout row" @click="open">
            <div @click.stop="toggle" class="node-prepend layout row flex shrink">
                <starship-icon class="flex shrink" :icon="getIcon"></starship-icon>
            </div>
            <div class="flex shrink">
                <label class="hide-when-editing">{{ label }}</label>
                <starship-input ref="input" class="show-when-editing" v-model="model[itemText]" select-when-focused auto-expand></starship-input>
            </div>
            <div class="node-append layout row flex shrink">
                <starship-icon @click.stop="addChild" class="flex shrink show-when-editing" icon="plus-square" :size="20"></starship-icon>
                <starship-icon @click.stop="remove" class="flex shrink show-when-editing" icon="trash-alt" color="rgba(150, 0, 0, 0.5)" :size="18" style="position: relative; top: -1px;"></starship-icon>
            </div>
        </div>
        <starship-treenode ref="childNodes" v-for="child in children" :key="child[itemKey]" :model="child" :close-icon="closeIcon" :open-icon="openIcon" :editable="editable" :item-text="itemText" :item-key="itemKey" :selectable="selectable" @select="$emit('select', $event)" @remove="onRemoved"></starship-treenode>
    </div>
</template>

<style lang="scss">
    .starship-treenode {

        cursor: pointer;

        & > .leaf {
            padding-top: 5px;
            padding-bottom: 5px;

            &:hover {
                background-color: rgb(235, 242, 250);
            }
        }

        label {
            cursor: pointer;
        }

        .show-when-editing,
        .show-when-hovered {
            display: none;
        }

        &.editing > .leaf {
            .show-when-editing {
                display: flex;
            }

            .hide-when-editing {
                display: none;
            }
        }

        &:hover > .leaf {
            .show-when-hovered {
                display: inline;
            }
        }

        .node-prepend {
            min-width: 25px;
            padding-left: 7px;
        }

        .node-append {

            .starship-icon {
                margin-left: 10px;
                opacity: 0.8;

                &:hover {
                    opacity: 1;
                }
            }
        }

        .starship-icon {
            display: inline !important;
        }

        .toggle-icon {
            display: none;
        }

        &.has-children {

            & > .leaf {
                .toggle-icon {
                    display: inline;
                }
            }

            & > .starship-treenode {
                display: none;
                margin-left: 22px;
            }
        }

        &.expanded {
            & > .starship-treenode {
                display: block;
            }
        }

        &.selected > .leaf {

            background-color: rgb(235, 242, 250);

            label {
                color: black;
            }
        }
    }
</style>

<script>
    import Vue from 'vue';
    import _ from 'underscore';
    import moment from 'moment';
    import { Component, Util, Guid } from 'starship';
    
    export default Component('starship-treenode', {

        properties: {
            $model: null,
            $itemText: 'name',
            $itemKey: 'key',
            $icon: '',
            $openIcon: 'caret-down',
            $closeIcon: 'caret-right',
            $editable: false,
            $selectable: false,

            expanded: false,
            selected: false,

            label() {
                if (!this.model) {
                    return '';
                }

                return this.model[this.itemText];
            },

            children() {
                if (!this.model || !this.model.children) {
                    return [];
                }

                return this.model.children;
            },

            getIcon() {

                if (this.children.length) {
                    return this.expanded ? this.openIcon : this.closeIcon;
                }

                return '';
                //return 'list';
            }
        },

        watch: {

            async selected() {
                if (this.selected) {
                    await this.$nextTick();
                    this.$refs.input.focus();
                }
            }
        },

        async toggle() {

            if (this.children.length) {
                this.expanded = !this.expanded;
            }

            //await this.trySelect();
        },

        async open() {
            this.expanded = true;
            await this.trySelect();
        },

        async trySelect() {
            if (!this.selectable) {
                return;
            }

            this.$emit('select', this);
            this.selected = true;

            await this.$nextTick();

            this.$refs.input.focus();
        },

        async addChild() {

            if (!this.model.children) {
                Vue.set(this.model, 'children', []);
            }
            
            let child = {};
            child[this.itemText] = 'New Item';
            child[this.itemKey] = Guid();

            this.model.children.push(child);

            this.expanded = true;

            await this.$nextTick();

            await this.$refs.childNodes.last().trySelect();
        },

        remove() {

            if (this.children.length) {
                this.$starship.notification('You must remove all items below this one first.');
                return;
            }

            this.$emit('remove', this.model);
        },

        onRemoved(item) {
            this.model.children.remove(item);
        }
    });
</script>