import _ from 'underscore';
import { DataProvider, Repository } from 'starship';

export default {

    props: {
        id: {
            type: String
        }
    },

    data() {
        return {
            items: [],
            editing: null
        };
    },

    watch: {
        id: {
            immediate: true,
            handler: 'load'
        }
    },

    methods: {

        async load() {
            let type = Repository.get(this.type).type;

            await this.$starship.load(async () => {

                if (_.isUndefined(this.id)) {
                    this.items = await DataProvider.query(this.type);
                }
                else if (this.id == '0') {
                    this.editing = new type();
                    this.editing._afterLoad();
                }
                else {
                    this.editing = await DataProvider.get(this.type, this.id);
                }

                if (this.onEntityLoaded) {
                    this.onEntityLoaded(this.editing);
                }

                this.$events.emit('editing.started', this.editing);
            });
        },

        async save() {
            
            await this.$starship.load(async () => {

                this.$events.emit('save');
                
                await this.editing.save();

                if (this.saved) {
                    this.saved();
                }
            });
        }
    }
};