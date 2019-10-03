import _ from 'underscore';

var BindSlots = {
    
    methods: {

        getSlots(func) {
            return _.map(this.$slots.default, (each) => {
                var item = each.data ? each.data.attrs : {};
                
                item.children = each.children;

                if (func) {
                    func(item);
                }

                return item;
            });
        }
    }
};

export default BindSlots;