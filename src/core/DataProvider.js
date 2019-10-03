import _ from 'underscore';
import axios from 'axios';
import mapper from './EntityMapper';
import Repository from './Repository';

class DataProvider {

    constructor(options) {
        options = options || {};

        this.endpoint = options.endpoint || '/api/data/';
        this.partition = '';
    }

    async getTypes() {
        let response = await axios.get(this.endpoint);
        let serverTypes = response.data;
        let clientTypes = Repository.getTypes();
        let types = [];

        _.each(clientTypes, (each) => {
            types.push(Repository.get(each).friendlyName);
        });

        _.each(serverTypes, (each) => {
            if (clientTypes.indexOf(each) < 0) {
                types.push(each);
            }
        });

        return types.sort();
    }

    getQueryParameters(parameters) {

        parameters = parameters || {};

        const results = [];

        if (this.partition) {
            parameters['partition'] = this.partition;
        }
        
        for (let parameter in parameters) {
            let value = parameters[parameter];

            if (value != null && value.toString().length) {

                if (_.isDate(value)) {
                    value = value.toISOString();
                }

                results.push(encodeURIComponent(parameter) + '=' + encodeURIComponent(value));
            }
        }

        if (results.length) {
            return '?' + results.join('&');
        }

        return '';
    }
    
    async get(typeName, idOrQueryParameters) {

        let url = this.endpoint;

        if (_.isArray(typeName)) {
            url += typeName.join();
        }
        else {
            url += typeName;
        }

        if (idOrQueryParameters) {

            if (_.isObject(idOrQueryParameters)) {
                url += this.getQueryParameters(idOrQueryParameters);
            }
            else {
                url += '/' + idOrQueryParameters + this.getQueryParameters();
            }
        }
        
        let response = await axios.get(url);
        return this.handleResponse(typeName, response);
    }

    async deleteLastEventOfType(id, eventName) {
        let response = await axios.delete('/api/events/' + id + '/' + eventName);
        return response.data;
    }

    async getEventsByType(entityType, eventName, startDate, endDate) {
        let url = '/api/events' + this.getQueryParameters({ type: entityType, name: eventName, startDate: startDate, endDate: endDate });

        let response = await axios.get(url);
        return response.data;
    }

    async getEvents(id) {
        let response = await axios.get('/api/events/' + id);
        return response.data;
    }

    async query(typeName) {
        let url = this.endpoint + typeName + this.getQueryParameters();
        let response = await axios.get(url);
        return this.handleResponse(typeName, response);
    }

    async deleteCollection(typeName) {
        let response = await axios.delete('/admin/' + typeName);
    }

    async deleteAll(items) {
        let url = this.endpoint + this.getQueryParameters();
        let response = await axios.delete(url, { data: items });
        return true;
    }

    async delete(typeName, id) {
        let url = this.endpoint + typeName + '/' + id + this.getQueryParameters();
        let response = await axios.delete(url);
        return true;
    }

    async save(typeName, fields) {

        let url = this.endpoint + typeName + this.getQueryParameters();
        let response = await axios.post(url, fields);
        return this.handleResponse(typeName, response);
    }

    async saveAll(entities) {

        let url = this.endpoint + this.getQueryParameters();
        let response = await axios.post(url, entities);

        return response.data.map(each => {
            let type = each['$type'];
            let entity = mapper.map(type, each);
            Repository.get(type).update(entity);
            return entity;
        });
    }

    handleError(error) {

    }

    handleResponse(typeName, response) {

        if (_.isArray(typeName)) {

            let results = {};

            for (var type in response.data) {
                results[type] = mapper.map(type, response.data[type]);
            }

            return results;
        }

        return mapper.map(typeName, response.data);
    }
};

export default new DataProvider();