import _ from 'underscore';
import Repository from './Repository';

function mapItem(type, item) {
    let instance = new type();
    let schema = instance.getSchema();

    for (var field in item) {

        if (schema[field]) {
            switch (schema[field.type]) {
                case 'date':
                    instance[field] = new Date(item[field]);
                    continue;
            }
        }

        instance[field] = item[field];
    }

    instance._afterLoad();

    return instance;
};

export default {
    
    map(typeName, data) {
        var repository = Repository.get(typeName);

        if (repository == null) {
            throw 'Unknown type: ' + typeName;
        }

        var type = repository.type;

        if (_.isArray(data)) {
            return data.map(each => {
                return mapItem(type, each);
            });
        }

        return mapItem(type, data);
    }
};