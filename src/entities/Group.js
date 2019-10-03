import _ from 'underscore';
import { Entity, Guid, Util } from 'starship';
let defaultPhoto = require('starship/src/theme/images/team.png');

class Group extends Entity {

    constructor() {
        super('group');

        this.name = '';
        this.photo = '';
        this.participants = [];
    }

    async addParticipant(id, role) {

        if (!this.getParticipant(id)) {

            this.participants.push({
                id: id,
                role: role || ''
            });
            
            return true;
        }

        return false;
    }

    async removeParticipant(id) {

        if (this.getParticipant(id)) {
            this.participants.removeWhere(each => each.id == id);
            return true;
        }

        return false;
    }

    getPhoto() {
        return defaultPhoto;
    }

    getParticipant(id) {
        return this.participants.find(each => each.id == id);
    }

    hasParticipant(id) {
        return this.getParticipant(id) != null;
    }
}

export default Group;