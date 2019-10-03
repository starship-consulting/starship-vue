<template>
    <page-column :title="title" class="shared-data-tree">

        <permission-dialog v-if="allowPermissions" v-model="showPermissions" action="read" :entity="selected"></permission-dialog>

        <template slot="title" v-if="selected && !selected.isVirtual && selected.id">

            <v-tooltip v-show="allowPermissions" left>
                <starship-button slot="activator" icon="key" :icon-size="22" @click="showPermissions = true" color="rgb(235, 235, 235)" flat></starship-button>
                <span>Permissions</span>
            </v-tooltip>

            <starship-button v-show="!isOwner && ownerName" icon="lock" :icon-size="22" color="rgb(235, 235, 235)" @click="$starship.notification(ownerName + ' is the owner of this sequence.')" flat></starship-button>
        </template>

        <starship-treeview class="pl-2" style="overflow-y: auto;" :items="nodes" :selected.sync="internalSelected" open-all selectable></starship-treeview>
    </page-column>
</template>

<style lang="scss">
    .shared-data-tree {
        .v-list .v-list__tile {
            height: 40px;
        }
    }
</style>

<script>
    import { Component, Util, Repository, Services, TreeViewNode, User } from 'starship';

    let EntityTreeBuilder = Services.EntityTreeBuilder;
    
    export default Component('starship-data-tree', {
        
        properties: {

            $data: [],
            $title: '',
            $selected: null,

            showPermissions: false,
            accounts: [],
            internalSelected: null,

            nodes() {
                return EntityTreeBuilder.build(this.data, this.accounts);
            },

            allowPermissions() {

                if (User.current.isAdmin) {
                    return false;
                }

                return this.accounts.length > 1 && this.isOwner;
            },

            isOwner() {

                if (!this.selected) {
                    return false;
                }

                return this.selected.owner == User.current.id;
            },

            ownerName() {
                let account = this.accounts.find(this.selected.owner);

                if (account) {
                    return account.name;
                }

                return '';
            }
        },

        watch: {

            internalSelected(value) {
                this.$emit('update:selected', value);
            }
        },

        async ready() {
            this.accounts = await this.$starship.load('account');
        }
    });
</script>