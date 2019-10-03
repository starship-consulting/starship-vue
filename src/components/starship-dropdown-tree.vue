<template>
    <label class="starship-dropdown-tree activatable layout column" :class="{ hideInput: hideInput }" @click="open">
        <div class="layout row flex shrink">
            <span class="label flex shrink" v-show="label">{{ label }}</span>
            <starship-icon @click.stop="edit" v-if="editable" class="edit-icon" icon="cog" :size="18" tooltip="Edit Values"></starship-icon>
        </div>
        <form class="flex" browser-autocomplete="disabled" autocomplete="off" spellcheck="false">
            <treeselect ref="treeselect" v-model="model" :options="nodes" :always-open="alwaysOpen" :disable-branch-nodes="!selectableBranches" :show-count="true" :placeholder="placeholder" :default-expand-level="expandLevel" :multiple="multiple" :close-on-select="!multiple" @open="opened" @close="closed" :append-to-body="appendToBody">
                <div slot="value-label" slot-scope="{ node }">{{ resolveLabel(node) }}</div>
            </treeselect>
        </form>
    </label>
</template>

<style lang="scss">

    .vue-treeselect__menu {
        max-height: 150px !important;
    }

    .starship-dropdown-tree {
        
        width: 100%;

        form {
            padding-top: 2px;
        }

        .label {
            font-size: 1em;
            font-weight: 500;
        }

        &.hideInput {
            .vue-treeselect__control {
                display: none;
            }
        }

        .vue-treeselect__control {
            height: 38px;
        }

        .vue-treeselect {
            width: initial !important;
        }

        input.vue-treeselect__input {
            width: 50px !important;
        }

        /*.vue-treeselect__control {
            width: auto;

            & > *, & * {
                width: initial !important;
            }
        }*/

        /*.vue-treeselect__menu {
            width: initial !important;

            .vue-treeselect__option,
            .vue-treeselect__label-container {
                width: initial !important;
            }
        }*/

        .vue-treeselect__x-container,
        .vue-treeselect__control-arrow-container {
            width: 16px !important;
        }

        .vue-treeselect__placeholder {
            color: rgb(150, 150, 150);
        }

        .vue-treeselect__multi-value-item {
            background: var(--icon-color);
            color: white !important;
        }

        .vue-treeselect__input-container {
            width: 10px;
        }

        &.hide-borders {

            .vue-treeselect__control,
            .vue-treeselect__single-value,
            .vue-treeselect__input-container,
            input {
                padding-left: 0;
            }

            .vue-treeselect__control {
                border: 0;
            }

            .vue-treeselect__control-arrow-container {
                display: none;
            }
        }

        input {
            cursor: pointer;
        }

        .vue-treeselect__icon svg {
            color: white;
        }

        svg {
            color: rgb(130, 130, 130);
        }

        .edit-icon {
            position: relative;
            margin-left: 10px;
        }
    }
</style>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    import _ from 'underscore';
    import { Component, Repository, Mixins } from 'starship';

    export default Component('starship-dropdown-tree', {

        mixins: [Mixins.ValueModel],

        components: { Treeselect },

        properties: {
            $label: '',
            $alwaysOpen: false,
            $items: [],
            $placeholder: '',
            $selectableBranches: false,
            $appendToBody: false,
            $multiple: false,
            $editable: false,
            $selectAll: false,
            $hideInput: false,
            $expandLevel: 1,

            $itemValue: 'id',
            $itemText: 'label',

            isOpen: false,

            nodes() {
                return this.mapNodes(this.items);
            }
        },

        watch: {

            model() {

                if (this.multiple) {
                    return;
                }

                setTimeout(() => {
                    this.close();
                }, 10);
            }
        },
        
        mapNodes(nodes) {
            
            return nodes.map(node => {

                let item = {
                    id: node[this.itemValue] || node[this.itemText],
                    label: node[this.itemText]
                };
                
                if (node.children && node.children.length) {
                    item.children = this.mapNodes(node.children);
                }

                return item;
            });
        },

        close() {
            this.$refs.treeselect.closeMenu();
        },

        open(e) {

            if (!this.appendToBody) {
                return;
            }
            
            if (!this.isOpen) {
                this.$refs.treeselect.openMenu();
            }
            else {
                this.$refs.treeselect.closeMenu();
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        },

        opened() {
            setTimeout(() => {
                this.isOpen = true;
            }, 150);
        },

        closed() {
            setTimeout(() => {
                this.isOpen = false;
            }, 150);
        },

        edit(e) {
            this.$events.emit('dropdown-tree.edit', this.itemType);
            e.preventDefault();
            e.stopPropagation();
            return false;
        },

        resolveLabel(node) {

            if (node.label.endsWith(' (unknown)')) {
                return node.label.replace(' (unknown)', '');
            }

            return node.label;
        }
    });
</script>