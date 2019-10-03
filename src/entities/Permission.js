import { Entity } from 'starship';

class Permission extends Entity {

    constructor() {
        super('permission');

        /*this.subject = {
            id: '',
            type: '*' // User, role, group, or *,
        };*/

        this.subject = ''; // User / group id that permission is granted to
        this.resource = ''; // Entity type being granted access
        this.scope = ''; // Filter query
        this.actions = []; // List of actions the subject can perform against the resource

        //this.condition = null; // Programmable condition statement to access the resource
    }
}

export default Permission;