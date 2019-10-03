import _ from 'underscore';
import axios from 'axios';
import moment from 'moment';
import { DateHelper, DataProvider, Repository, EntityMapper } from 'starship';

let currentUser = null;
let settings = null;
let invitations = [];

class User {

    constructor() {
        this.id = '';
        this.email = '';
        this.photo = '';
        this['$type'] = 'account';

        this.impersonating = false;
        this.authenticated = false;
    }

    static async load() {

        let response = await axios.get('/api/user');
        
        _.extend(currentUser, EntityMapper.map('account', response.data.account));

        currentUser.authenticated = true;
        settings = response.data.settings;
        invitations = response.data.invitations;

        if (settings.impersonate) {
            currentUser.impersonating = true;
        }

        //DataProvider.partition = currentUser.id;
    }

    async impersonate(email) {
        
        if (!email) {
            email = '';
        }

        await axios.get('/api/impersonate?email=' + email);

        Repository.clear();
        
        window.location.href = '/';
    }

    get isAdmin() {
        return this.roleType == 'admin';
    }

    get isManager() {
        return this.roleType == 'manager' || this.isLeader;
    }

    get isLeader() {
        return this.roleType == 'leader';
    }

    get isCoordinator() {
        return this.roleType == 'coordinator';
    }

    get canManageTeam() {
        return this.isManager || this.isCoordinator || this.isLeader;
    }

    get hasTeam() {
        return this.groups && this.groups.any();
    }

    get roleType() {
        let role = (this.role || '').toLowerCase();

        switch (role) {
            case 'leader':
            case 'coordinator':
            case 'admin':
            case 'manager':
                return role;
        }

        return 'agent';
    }

    get name() {

        if (!this.firstName && !this.lastName) {
            return '';
        }

        if (!this.lastName) {
            return this.firstName;
        }

        if (!this.firstName) {
            return this.email;
        }

        if (this.firstName.includes('@') && this.lastName.includes('@')) {
            return this.email;
        }

        return this.firstName + ' ' + this.lastName;
    }

    get subscription() {
        return User.current.components.chargeBee;
    }

    get isSubscriptionExpired() {
        //var date = new Date() >= new Date(this.subscription.subscriptionEndDate);
        //console.log(this.subscription.subscriptionEndDate)
        return new Date() >= new Date(this.subscription.subscriptionEndDate);
    }

    get subscriptionTimeRemaining() {
        return moment.duration(moment.utc(this.subscription.subscriptionEndDate).diff(moment.utc()));
    }

    static get settings() {
        return settings;
    }

    static get invitations() {
        return invitations;
    }

    static get current() {
        return currentUser;
    }
};

currentUser = new User();

export default User;