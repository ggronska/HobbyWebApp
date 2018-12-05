import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { People } from '../api/people.js';

import './hobby.js';
import './person.html';

import { Hobbies } from '../api/hobbies.js';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('hobbies');
});

Template.person.helpers({
  isOwner(){
    return this.owner === Meteor.userId();
  },
  hobbies(){
    const instance = Template.instance();
		return Hobbies.find({ personId:this._id }).fetch();
  },
});

Template.person.events({
  'submit .new-hobby'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
   
    // console.log('personId:this._id', )

    // Insert a task into the collection
    Meteor.call('hobbies.insert', this._id, text);
    console.warn("this id", this._id) 
    console.warn("this", this)
    // Clear form
    target.text.value = '';
  },
  // 'click .toggle-checked'() {
  //   // Set the checked property to the opposite of its current value
	//   Meteor.call('people.setChecked', this._id, !this.checked);
  // },
  'click .delete'() {
    Meteor.call('people.remove', this._id);
  },
  'click .toggle-private' () {
    Meteor.call('people.setPrivate', this._id, !this.private);
  },
});