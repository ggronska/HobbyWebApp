import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Hobbies } from '../api/hobbies.js';

import './hobby.html';

Template.hobby.events({
    'click .delete'(){
        Meteor.call('hobbies.remove', this._id);
    }
})