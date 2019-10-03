import _ from 'underscore';
import Vue from 'vue';
import axios from 'axios';
import { User } from 'starship';

class ChargeBeeService {

    constructor() {
        this.instance = null;
        this.scriptLoaded = false;
    }

    init(site) {
        this.site = site;
    }

    async loadScript() {

        if (!this.scriptLoaded) {
            await Vue.loadScript('https://js.chargebee.com/v2/chargebee.js');
        }
    }

    async getInstance() {

        await this.loadScript();

        if (this.instance == null) {

            Chargebee.init({
                site: this.site
            });

            this.instance = Chargebee.getInstance();
        }

        return this.instance;
    }

    async openCheckout(plan, callback) {

        console.log('OPEN CHECKOUT', new Date())

        let url = '/api/billing/checkout';

        if (plan) {
            url += '?plan=' + plan;
        }

        /*return axios.get(url).then(response => {

            if (callback != null) {
                callback(response.data);
            }

            return response.data;
        });*/

        let instance = await this.getInstance();
        
        return await instance.openCheckout({
            
            hostedPage() {
                return axios.get(url).then(response => {

                    /*if (callback != null) {
                        callback(response.data);
                    }*/

                    return response.data;
                });
            },

            close() {
                if (callback) {
                    callback();
                }
            }
        });
    }

    async openPortal(plan, callback) {
        
        if (!User.current.subscription || !User.current.subscription.subscriptionEndDate) {
            return await this.openCheckout(plan, callback);
        }

        console.log('OPEN PORTAL', new Date());

        let instance = await this.getInstance();

        await instance.setPortalSession(() => {
            return axios.get('/api/billing/portal').then(response => {
                return response.data;
            });
        });
        
        await instance.createChargebeePortal().open({

            close() {
                if (callback) {
                    callback();
                }
            }
        });
    }
}

export default new ChargeBeeService();