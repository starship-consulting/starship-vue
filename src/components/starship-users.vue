<template>
    <div class="starship-users layout row" style="overflow: hidden;">

        <starship-table :class="{ shrink: account }" :data="filteredAccounts" :columns="columns" :selected.sync="account" selectable sortable></starship-table>

        <div v-if="account" class="layout column flex ml-2">
            <page-column :title="account.name" class="flex" style="max-width: 600px;">

                <template slot="title">
                    <starship-icon style="position: relative; top: 2px; right: 2px;" class="ma-2" icon="times-circle" color="white" @click="close"></starship-icon>
                </template>

                <div class="layout column flex ma-2">

                    <div class="flex shrink">
                        <starship-button icon="user-plus" text="Impersonate" @click="impersonate"></starship-button>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="layout row flex">
                        <div class="flex shrink" style="max-width: 200px;">
                            <starship-dropdown label="Role" :items="roles" v-model="role"></starship-dropdown>
                        </div>

                        <!--
                        <div class="flex shrink ml-2">
                            <starship-dropdown label="Plan" :items="plans" v-model="plan" item-text="friendlyName" item-value="id"></starship-dropdown>
                        </div>
                        -->
                    </div>
                </div>
            </page-column>
        </div>
    </div>
</template>

<style lang="scss">
    .starship-users {
        .faded {
            pointer-events: none;
            cursor: not-allowed
        }
    }
</style>

<script>
    import _ from 'underscore';
    import { Component, Util, Data, DataProvider, Repository, User, EntityMapper, TreeViewNode } from 'starship';
    import axios from 'axios';
    import moment from 'moment';
    
    export default Component('starship-users', {

        properties: {

            $id: '',
            $accounts: [],
            $subscriptions: [],

            plans: [],
            account: null,
            roles: ['Agent', 'Manager', 'Leader', 'Coordinator', 'Admin'],

            role: '',
            plan: '',

            columns() {

                if (this.account) {

                    return [
                        { name: 'name', title: 'Name', sorted: 0 },
                        { name: 'email', title: 'Email' },
                        { name: 'roleName', title: 'Role' }
                    ];
                }

                var columns = [
                    { name: 'name', title: 'Name', sorted: 0 },
                    { name: 'email', title: 'Email' },
                    { name: 'creationDate', title: 'Creation Date', type: 'date', format: 'MM/DD/YYYY' },
                    { name: 'lastLogin', title: 'Last Login', type: 'date', format: 'MM/DD/YYYY h:mm a' },
                    { name: 'status', title: 'Status', formatter: 'capitalize' },
                    { name: 'roleName', title: 'Role' }
                ];

                if (this.subscriptions.length) {

                    columns = columns.concat([
                        { name: 'plan', title: 'Plan' }/*,
                        {
                            name: 'billingDate',
                            title: 'Next Charge',
                            formatter(value, row) {

                                if (row.amount > 0 && row.billingDate) {
                                    return '$' + row.amount + ' on ' + moment(row.billingDate).format('MM/DD/YYYY');
                                }

                                return '';
                            }
                        }*/
                    ]);
                }

                return columns;
            },
            
            filteredAccounts() {

                return this.accounts.map(account => {

                    /*let planId = '';
                    let plan = '';
                    let billingDate = '';

                    if (_.has(account.components, 'chargeBee')) {
                        planId = account.components.chargeBee.planId;

                        let match = this.plans.find(planId);

                        if (match) {
                            plan = match.friendlyName;
                        }

                        if (account.components.chargeBee.billingDate) {
                            billingDate = new Date(account.components.chargeBee.billingDate);
                        }
                    }*/

                    let planId = '';
                    let plan = '';
                    //let billingDate = '';
                    //let amount = 0;

                    let subscription = this.subscriptions.find(each => each.accountId == account.id);

                    if (subscription) {
                        planId = subscription.planId;
                        plan = subscription.planName;
                        //amount = parseInt(subscription.amount) / 100;
                        //billingDate = subscription.billingDate;
                    }
                    
                    return {
                        id: account.id,
                        name: account.name,
                        email: account.email,
                        creationDate: account.creationDate,
                        lastLogin: account.lastLogin,
                        status: account.status,
                        roleName: account.roleName,
                        roleType: account.roleType,
                        plan: plan,
                        planId: planId,
                        //amount: amount,
                        //billingDate: billingDate
                    };
                });
            }
        },

        watch: {

            account() {
                if (this.account) {
                    this.role = this.account.roleType;
                    this.plan = this.account.planId;
                }
            },

            async role() {

                let role = (this.role || '').toLowerCase();

                if (role && this.account && this.account.roleType != role) {
                    await this.$starship.load(async () => {
                        await axios.post('/api/users/' + this.account.id + '?role=' + role);
                        this.accounts.find(this.account.id).role = role;
                        this.account = null;
                    });
                }
            }
        },
        
        async ready() {
            //this.groups = await this.$starship.load('group');
            //this.accounts = await this.$starship.load('account');

            //if (this.showBilling) {
            //    this.plans = (await axios.get('/api/billing/plans')).data
            //}

            this.plans = (await axios.get('/api/billing/plans')).data
        },

        async impersonate() {
            await this.$starship.load(async () => {
                if (this.account && this.account.email) {
                    await User.current.impersonate(this.account.email);
                }
            });
        },

        close() {
            this.account = null;
        }
    });
</script>