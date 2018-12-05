import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { People } from '../api/people.js';
 
import './person.js';
import './body.html';
 
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('people');
});

Template.body.helpers({
  people() {
    const instance = Template.instance();
		if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter people
		return People.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
		}
    // Otherwise, return all of the people
		return People.find({}, { sort: { createdAt: -1 } });
  },
  //  incompleteCount() {
  //   return People.find({ checked: { $ne: true } }).count();
  // },
});

Template.body.events({
  'submit .new-person'(event) {

    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
	  Meteor.call('people.insert', text);
 
    // Clear form
    target.text.value = '';
  },
  //   'change .hide-completed input'(event, instance) {
  //   instance.state.set('hideCompleted', event.target.checked);
  // },
});