import _ from 'underscore';
import DataProvider from './DataProvider';
import Repository from './Repository';
import User from './User';
import Util from './Util';
import { Entities, EventBus } from 'starship';
import EventContext from './EventContext';
import EntityMapper from './EntityMapper';

let eventContext = new EventContext();

class Entity {

    constructor(type) {
        this.id = '';
        this.validUntil = null;
        this.$type = Util.replace(type.toLowerCase(), ' ', '');
        this.owner = User.current.id;
        this.creationDate = new Date();
        this.updatedDate = new Date();
        this.updatedBy = User.current.id;
        this.participants = [];
        this.permissions = [];
        this._friendlyName = type;
    }
    
    getType() {
        return this['$type'];
    }

    getOwner() {
        return Repository.find('account', this.owner);
    }

    is(type) {
        return this['$type'] == type;
    }

    isNew() {
        return !this.id;
    }
    
    async event(name, parameters) {

        if (!this.canEdit()) {
            return false;
        }

        // Todo:  Generate a unique ID instead to correlate event?
        if (this.isNew()) {
            await this.save();
        }

        let event = new Entities.Event();
        event.name = name;
        event.parameters = parameters;

        event.source = {
            id: this.id,
            type: this.$type
        }

        let eventHandler = this['on' + name];

        if (eventHandler) {
            eventHandler.call(this, parameters);
        }
        
        var fields = this.getFields();

        await DataProvider.saveAll([event, fields]);

        this.updateRepository(this);

        eventContext.emit('entity.event', event);
    }

    async getEvents() {

        if (this.isNew()) {
            return [];
        }

        return await DataProvider.getEvents(this.id);
    }
    
    getFields() {
        var fields = {};
        
        for (var field in this) {
            if (this.hasOwnProperty(field)) {

                if (field.startsWith('_')) {
                    continue;
                }

                if (_.isFunction(field)) {
                    continue;
                }

                fields[field] = this[field];
            }
        }

        return JSON.parse(JSON.stringify(fields));
    }

    clone() {
        let clone = EntityMapper.map(this.$type, this.getFields());
        clone.id = '';
        clone.creationDate = new Date();
        clone.owner = User.current.id;
        clone.permissions = [];

        return clone;
    }

    getSchema() {
        let schema = {};

        for (var field in this) {
            let value = this[field];

            if (field == 'id') {
                schema[field] = { type: 'id', readonly: true };
            }
            else if (field == 'owner') {
                schema[field] = { type: 'owner' };
            }
            else if (_.isDate(value)) {
                schema[field] = { type: 'date' };
            }
            else if (_.isBoolean(value)) {
                schema[field] = { type: 'boolean' };
            }
            else if (_.isObject(value)) {
                schema[field] = { type: 'object' };
            }
            else if (_.isArray(value)) {
                schema[field] = { type: 'array' };
            }
            else if (_.isNumber(value)) {
                schema[field] = { type: 'number' };
            }
            else {
                schema[field] = { type: 'string' };
            }

            if (field.indexOf('_') == 0) {
                schema[field].hidden = true;
            }
        }

        return schema;
    }

    _afterLoad() {
    }

    invalidate(date) {

        if (!this.canEdit()) {
            return false;
        }

        if (!date) {
            date = new Date();
        }

        this.validUntil = date;
        return true;
    }

    isDeleted(date) {
        if (!date) {
            date = new Date();
        }

        return this.validUntil && this.validUntil <= date;
    }
    
    async save(interceptor) {

        if (!this.canEdit()) {
            return false;
        }

        var fields = this.getFields();

        if (interceptor) {
            fields = interceptor(fields);
        }

        if (this._beforeSave) {
            this._beforeSave();
        }

        let result = await DataProvider.save(this.$type, fields);

        // Todo:  Remap fields?
        if (this.id != result.id) {
            this.id = result.id;
        }

        if (this._afterSave) {
            this._afterSave();
        }
        
        this.updateRepository(result);
        
        return this;
    }

    updateRepository(entity) {
        Repository.get(this.$type).update(entity);
    }

    async delete() {

        if (this.isNew()) {
            return true;
        }

        if (!this.canEdit()) {
            return false;
        }
        
        await DataProvider.delete(this.$type, this.id);
        Repository.get(this.$type).remove(this.id);

        return true;
    }

    canEdit(user) {
        
        if (!this.owner) {
            return true;
        }

        if (!user) {
            user = User.current;
        }

        if (user.roleType == 'admin') {
            return true;
        }

        /*let permission = false;

        if (user.claims && user.claims.length) {

            user.claims.each(claim => {
                if (claim.name == this.owner) {
                    if (claim.value == '*' || claim.value == this.$type) {
                        permission = true;
                    }
                }
            });
        }

        if (permission) {
            return true;
        }*/

        if (this.owner == user.id) {
            return true;
        }

        if (this.owner == 'system') {
            return false;
        }

        return true;
        return this.owner == user.id;
    }
};

export default Entity;