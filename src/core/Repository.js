import _ from 'underscore';
import Vue from 'vue';
import Entity from './Entity';
import DataProvider from './DataProvider';
import EventContext from './EventContext';

let event = new EventContext();

class Repository {

    constructor(type, name) {
        this.name = name;
        this.friendlyName = new type()._friendlyName;
        this.type = type;

        this.clear();
    }

    clear() {
        this.items = [];
        this.loaded = false;
        this.loader = null;
    }
    
    async fill(items) {

        if (!this.loaded && !this.loader && items) {
            this.items = items;
            this.loaded = true;
            return this.items;
        }

        if (!this.loaded && !this.loader) {
            this.loader = this.getLoader()();
        }

        if (this.loader) {
            await this.loader;
        }
        
        return this.items;
    }

    getLoader() {
        return async () => {
            
            let items = await DataProvider.query(this.name);

            items.each(item => {

                if (!this.find(item.id)) {
                    this.items.push(item);
                }
            });

            this.loaded = true;
            this.loader = null;
        };
    }

    update(entity) {
        
        if (!entity.id) {
            throw 'Attempted to update entity without id: ' + JSON.stringify(entity);
        }

        if (entity.validUntil && new Date(entity.validUntil) < new Date()) {
            this.remove(entity);
            return;
        }

        let match = this.find(entity.id);

        if (match) {
            Vue.set(this.items, this.items.indexOf(match), entity);
        }
        else {
            this.items.push(entity);
        }

        event.emit(this.name + '.updated', entity);
    }

    remove(entityOrId) {
        
        if (_.isObject(entityOrId)) {
            entityOrId = entityOrId.id;
        }

        let match = this.find(entityOrId);

        if (match) {
            this.items.splice(this.items.indexOf(match), 1);
        }
    }

    where(predicate) {
        return this.items.filter(predicate);
    }

    find(id) {
        return this.items.find(id);
    }

    first() {
        if (this.items.length) {
            return this.items[0];
        }

        return null;
    }

    all() {
        return this.items;
    }
};

export default {

    repositories: {},

    register(entities) {
        for (var entity in entities) {
            this.add(entities[entity]);
        }
    },

    clear() {
        for (var each in this.repositories) {
            this.repositories[each].clear();
        }
    },

    add(type) {
        var instance = new type();
        var name = instance.$type.toLowerCase();

        //console.log('Registering type: ' + name, instance);

        this.repositories[name] = new Repository(type, name);
        return this.get(name);
    },

    async fill(name) {
        let repository = this.get(name);
        return await repository.fill();
    },

    all(name) {
        return this.get(name).items;
    },

    first(name) {
        return this.get(name).first();
    },

    find(name, id) {
        return this.get(name).find(id);
    },

    get(name) {
        name = name.toLowerCase();

        if (this.repositories[name]) {
            return this.repositories[name];
        }

        let runtimeType = (typeName) => class extends Entity {

            constructor() {
                super(typeName);
            }
        };
        
        return this.add(runtimeType(name));
    },

    async getFields(name, hidePrivateFields) {
        //var data = await this.get(name).all();
        var fields = [];
        var type = this.get(name).type;
        var instance = new type();

        //_.each(data, (each) => {
        for (var field in instance) {

                if (hidePrivateFields) {
                    if (field.indexOf('_') == 0) {
                        continue;
                    }

                    if (field == 'id' || field == '$type' || field == 'validUntil' || field == 'owner') {
                        continue;
                    }
                }

                if (!fields.includes(field)) {
                    fields.push(field);
                }
            }
        //});

        return fields.sort();
    },

    getTypes() {
        return Object.keys(this.repositories);
    }
};