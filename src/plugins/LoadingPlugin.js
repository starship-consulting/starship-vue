import _ from 'underscore';
import BasePlugin from './BasePlugin';
import { DataProvider, Repository } from 'starship';

class LoadingPlugin extends BasePlugin {

    constructor() {
        super('load');

        async function load(callback) {

            try {
                this.$events.emit('loading.start');
                await callback();
            }
            catch (e) {
                console.error(e);
                this.$events.emit('error', e);
            }
            finally {
                this.$events.emit('loading.stop');
            }
        };

        this.mixin = async function (callbackOrEntityType, query) {
            
            if (_.isFunction(callbackOrEntityType)) {
                await load.call(this, callbackOrEntityType);
            }
            else if (_.isArray(callbackOrEntityType)) {

                await load.call(this, async () => {

                    let results = await DataProvider.get(callbackOrEntityType, query);
                    
                    for (var type in results) {
                        let repository = Repository.get(type);
                        repository.fill(results[type]);
                    }
                });
            }
            else if (_.isString(callbackOrEntityType)) {
                
                if (query) {
                    return await DataProvider.get(callbackOrEntityType, query);
                }

                let repository = Repository.get(callbackOrEntityType);
                
                if (!repository.loaded) {
                    await load.call(this, repository.fill.bind(repository));
                }
                
                return repository.all();
            }
        }
    }
};

export default new LoadingPlugin();