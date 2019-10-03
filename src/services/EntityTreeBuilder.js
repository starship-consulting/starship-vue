import _ from 'underscore';
import { TreeViewNode, User } from 'starship';

export default new class {

    build(entities, accounts) {

        let personal = new TreeViewNode({ name: 'Personal', id: 'personal', isVirtual: true });
        let shared = new TreeViewNode({ name: 'Shared', id: 'shared', isVirtual: true });
        let global = new TreeViewNode({ name: 'Global', id: 'global', isVirtual: true });

        entities.sortBy('isFolder').reverse().each(entity => {

            let parent = personal;

            if (entity.owner == 'system') {
                parent = global;
            }
            else if (entity.owner != User.current.id) {
                let ownerAccount = accounts.find(each => each.id == entity.owner);

                if (ownerAccount) {
                    parent = shared.children.find(each => each.id == entity.owner);
                    
                    if (!parent) {
                        parent = new TreeViewNode({ name: ownerAccount.name, id: entity.owner, isVirtual: true });
                        shared.add(parent);
                    }
                }
            }

            parent = parent.children.find(each => each.id == entity.folder) || parent;
            parent.add(new TreeViewNode(entity));
        });

        return [personal, shared, global];
    }
}